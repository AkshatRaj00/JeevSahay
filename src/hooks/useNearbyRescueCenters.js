import { useState, useEffect, useCallback, useRef } from 'react';
import { geohashQueryBounds, distanceBetween } from 'geofire-common';
import {
  collection,
  query,
  orderBy,
  startAt,
  endAt,
  getDocs,
} from 'firebase/firestore';
import { db } from '../firebaseConfig';

const DEFAULT_RADIUS_KM = 30;
const MIN_RADIUS_KM = 1;
const MAX_RADIUS_KM = 200;

const normalizeType = (value) => {
  if (!value) return null;
  return String(value).trim().toLowerCase();
};

const isValidNumber = (value) => typeof value === 'number' && Number.isFinite(value);

export const useNearbyRescueCenters = (
  center,
  radiusInKm = DEFAULT_RADIUS_KM,
  typeFilter = null,
  limitResults = 50
) => {
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const requestIdRef = useRef(0);

  const fetchNearby = useCallback(async () => {
    const lat = center?.lat;
    const lng = center?.lng;

    if (!isValidNumber(lat) || !isValidNumber(lng)) {
      setResults([]);
      setLoading(false);
      setError(null);
      return [];
    }

    const currentRequestId = ++requestIdRef.current;
    setLoading(true);
    setError(null);

    try {
      const safeRadiusKm = Math.min(
        MAX_RADIUS_KM,
        Math.max(MIN_RADIUS_KM, Number(radiusInKm) || DEFAULT_RADIUS_KM)
      );

      const safeLimit = Math.max(1, Number(limitResults) || 50);
      const radiusInM = safeRadiusKm * 1000;
      const bounds = geohashQueryBounds([lat, lng], radiusInM);
      const baseRef = collection(db, 'rescueCenters');
      const normalizedTypeFilter = normalizeType(typeFilter);

      const snapshots = await Promise.all(
        bounds.map(([start, end]) =>
          getDocs(
            query(baseRef, orderBy('geohash'), startAt(start), endAt(end))
          )
        )
      );

      if (currentRequestId !== requestIdRef.current) return [];

      const seenIds = new Set();
      const matched = [];

      for (const snap of snapshots) {
        for (const docSnap of snap.docs) {
          if (seenIds.has(docSnap.id)) continue;
          seenIds.add(docSnap.id);

          const data = docSnap.data();
          if (!data) continue;

          if (data.isActive === false) continue;
          if (!isValidNumber(data.lat) || !isValidNumber(data.lng)) continue;
          if (typeof data.geohash !== 'string' || !data.geohash.trim()) continue;

          const docType = normalizeType(data.type);
          if (normalizedTypeFilter && docType !== normalizedTypeFilter) continue;

          const distanceKm = distanceBetween([data.lat, data.lng], [lat, lng]);

          if (!Number.isFinite(distanceKm)) continue;
          if (distanceKm > safeRadiusKm) continue;

          matched.push({
            id: docSnap.id,
            ...data,
            distanceKm: Number(distanceKm.toFixed(1)),
          });
        }
      }

      matched.sort((a, b) => a.distanceKm - b.distanceKm);

      const finalResults = matched.slice(0, safeLimit);

      if (currentRequestId === requestIdRef.current) {
        setResults(finalResults);
        setError(null);
      }

      return finalResults;
    } catch (err) {
      console.error('Nearby rescue center search failed:', err);

      if (currentRequestId === requestIdRef.current) {
        setResults([]);
        setError(
          'Nearby centers load nahi ho paaye. Firestore geohash/index/data check karo.'
        );
      }

      return [];
    } finally {
      if (currentRequestId === requestIdRef.current) {
        setLoading(false);
      }
    }
  }, [center?.lat, center?.lng, radiusInKm, typeFilter, limitResults]);

  useEffect(() => {
    fetchNearby();

    return () => {
      requestIdRef.current += 1;
    };
  }, [fetchNearby]);

  return {
    results,
    loading,
    error,
    refetch: fetchNearby,
  };
};