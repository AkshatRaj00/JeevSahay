import { useState, useEffect, useCallback, useRef } from "react";

const DEFAULT_STATE = {
  loading: true,
  loaded: false,
  coords: null,
  error: null,
  accuracy: null,
  bestAccuracy: null,
  source: null,
  isWatching: false,
};

const PRECISE_OPTIONS = {
  enableHighAccuracy: true,
  timeout: 20000,
  maximumAge: 0,
};

const FAST_OPTIONS = {
  enableHighAccuracy: false,
  timeout: 8000,
  maximumAge: 15000,
};

const GOOD_ACCURACY_METERS = 30;
const ACCEPTABLE_ACCURACY_METERS = 80;
const MAX_WATCH_TIME = 25000;

export const useGeoLocation = () => {
  const mounted = useRef(true);
  const watchIdRef = useRef(null);
  const stopTimerRef = useRef(null);
  const bestPositionRef = useRef(null);

  const [state, setState] = useState(DEFAULT_STATE);

  const safeSet = useCallback((updater) => {
    if (!mounted.current) return;
    setState((prev) => (typeof updater === "function" ? updater(prev) : updater));
  }, []);

  const clearWatcher = useCallback(() => {
    if (
      watchIdRef.current !== null &&
      typeof navigator !== "undefined" &&
      navigator.geolocation
    ) {
      navigator.geolocation.clearWatch(watchIdRef.current);
      watchIdRef.current = null;
    }

    if (stopTimerRef.current) {
      clearTimeout(stopTimerRef.current);
      stopTimerRef.current = null;
    }

    safeSet((prev) => ({ ...prev, isWatching: false }));
  }, [safeSet]);

  const normalizePosition = useCallback((position, source = "gps") => {
    const {
      latitude,
      longitude,
      accuracy,
      altitude,
      altitudeAccuracy,
      heading,
      speed,
    } = position.coords;

    return {
      latitude,
      longitude,
      accuracy: typeof accuracy === "number" ? accuracy : null,
      altitude: altitude ?? null,
      altitudeAccuracy: altitudeAccuracy ?? null,
      heading: heading ?? null,
      speed: speed ?? null,
      timestamp: position.timestamp ?? Date.now(),
      source,
    };
  }, []);

  const applyBestPosition = useCallback(
    (position, source = "gps") => {
      const nextCoords = normalizePosition(position, source);
      const nextAccuracy = nextCoords.accuracy ?? Number.POSITIVE_INFINITY;
      const currentBestAccuracy =
        bestPositionRef.current?.coords?.accuracy ?? Number.POSITIVE_INFINITY;

      if (!bestPositionRef.current || nextAccuracy < currentBestAccuracy) {
        bestPositionRef.current = position;
      }

      const bestCoords = normalizePosition(bestPositionRef.current || position, source);

      safeSet((prev) => ({
        ...prev,
        loading: false,
        loaded: true,
        coords: bestCoords,
        accuracy: nextCoords.accuracy,
        bestAccuracy: bestCoords.accuracy,
        source,
        error: null,
      }));

      if (
        typeof bestCoords.accuracy === "number" &&
        bestCoords.accuracy <= GOOD_ACCURACY_METERS
      ) {
        clearWatcher();
      }
    },
    [normalizePosition, safeSet, clearWatcher]
  );

  const buildErrorMessage = useCallback((error) => {
    if (error?.code === 1) {
      return "Location permission denied. Browser settings me allow karo.";
    }
    if (error?.code === 2) {
      return "Location abhi available nahi hai. GPS ya network weak hai.";
    }
    if (error?.code === 3) {
      return "Location request timeout ho gaya. Open area me try karo.";
    }
    return "Location fetch nahi ho payi.";
  }, []);

  const startPreciseTracking = useCallback(() => {
    if (typeof window === "undefined" || !("geolocation" in navigator)) {
      safeSet({
        ...DEFAULT_STATE,
        loading: false,
        loaded: true,
        error: "Browser geolocation support nahi karta.",
      });
      return;
    }

    clearWatcher();
    bestPositionRef.current = null;

    safeSet((prev) => ({
      ...prev,
      loading: true,
      loaded: false,
      error: null,
      isWatching: true,
    }));

    navigator.geolocation.getCurrentPosition(
      (position) => {
        applyBestPosition(position, "initial");
      },
      () => {},
      FAST_OPTIONS
    );

    watchIdRef.current = navigator.geolocation.watchPosition(
      (position) => {
        applyBestPosition(position, "watch");
      },
      (error) => {
        const message = buildErrorMessage(error);

        safeSet((prev) => ({
          ...prev,
          loading: false,
          loaded: true,
          error: prev.coords ? null : message,
          isWatching: false,
        }));

        if (!bestPositionRef.current) {
          clearWatcher();
        }
      },
      PRECISE_OPTIONS
    );

    stopTimerRef.current = setTimeout(() => {
      clearWatcher();

      safeSet((prev) => {
        const best = bestPositionRef.current
          ? normalizePosition(bestPositionRef.current, "best-fix")
          : null;

        return {
          ...prev,
          loading: false,
          loaded: true,
          coords: best || prev.coords,
          accuracy: best?.accuracy ?? prev.accuracy,
          bestAccuracy: best?.accuracy ?? prev.bestAccuracy,
          error:
            best &&
            typeof best.accuracy === "number" &&
            best.accuracy <= ACCEPTABLE_ACCURACY_METERS
              ? null
              : prev.error || "Exact GPS lock weak hai. Open sky me refresh karo.",
          isWatching: false,
        };
      });
    }, MAX_WATCH_TIME);
  }, [
    safeSet,
    clearWatcher,
    applyBestPosition,
    buildErrorMessage,
    normalizePosition,
  ]);

  const refetch = useCallback(() => {
    startPreciseTracking();
  }, [startPreciseTracking]);

  useEffect(() => {
    mounted.current = true;
    startPreciseTracking();

    return () => {
      mounted.current = false;
      clearWatcher();
    };
  }, [startPreciseTracking, clearWatcher]);

  return {
    ...state,
    refetch,
    startPreciseTracking,
    stopTracking: clearWatcher,
    isPrecise:
      typeof state.bestAccuracy === "number" &&
      state.bestAccuracy <= GOOD_ACCURACY_METERS,
  };
};