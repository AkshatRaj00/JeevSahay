// src/pages/MapRadar.jsx
import { useMemo, useState, useEffect, useCallback } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { collection, query, orderBy, limit, getDocs } from 'firebase/firestore';
import { db } from '../firebaseConfig';
import { useGeoLocation } from '../hooks/useGeoLocation';
import { useNearbyRescueCenters } from '../hooks/useNearbyRescueCenters';

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png',
  iconUrl:
    'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',
  shadowUrl:
    'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
});

const hospitalIcon = new L.Icon({
  iconUrl: 'https://cdn-icons-png.flaticon.com/512/3063/3063822.png',
  iconSize: [34, 34],
  iconAnchor: [17, 34],
  popupAnchor: [0, -30],
});

const ngoIcon = new L.Icon({
  iconUrl: 'https://cdn-icons-png.flaticon.com/512/2913/2913518.png',
  iconSize: [34, 34],
  iconAnchor: [17, 34],
  popupAnchor: [0, -30],
});

const shelterIcon = new L.Icon({
  iconUrl: 'https://cdn-icons-png.flaticon.com/512/684/684908.png',
  iconSize: [34, 34],
  iconAnchor: [17, 34],
  popupAnchor: [0, -30],
});

const rescueIcon = new L.Icon({
  iconUrl: 'https://cdn-icons-png.flaticon.com/512/616/616408.png',
  iconSize: [34, 34],
  iconAnchor: [17, 34],
  popupAnchor: [0, -30],
});

const userIcon = new L.Icon({
  iconUrl: 'https://cdn-icons-png.flaticon.com/512/149/149060.png',
  iconSize: [28, 28],
  iconAnchor: [14, 28],
  popupAnchor: [0, -24],
});

const INDIA_CENTER = { lat: 20.5937, lng: 78.9629 };

function FitMapToMarkers({ centers, userLocation }) {
  const map = useMap();

  useEffect(() => {
    const points = [];

    if (
      userLocation &&
      Number.isFinite(userLocation.lat) &&
      Number.isFinite(userLocation.lng)
    ) {
      points.push([userLocation.lat, userLocation.lng]);
    }

    centers.forEach((c) => {
      if (Number.isFinite(c.lat) && Number.isFinite(c.lng)) {
        points.push([c.lat, c.lng]);
      }
    });

    if (points.length === 0) return;

    if (points.length === 1) {
      map.setView(points[0], 12);
      return;
    }

    map.fitBounds(points, { padding: [50, 50], maxZoom: 13 });
  }, [centers, userLocation, map]);

  return null;
}

function safeReadFavs() {
  try {
    const raw = window.localStorage.getItem('favNGOs');
    const parsed = JSON.parse(raw || '[]');
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function safeWriteFavs(items) {
  try {
    window.localStorage.setItem('favNGOs', JSON.stringify(items));
    return true;
  } catch {
    return false;
  }
}

function normalizeCenter(center) {
  const lat = Number(center?.lat);
  const lng = Number(center?.lng);

  if (!Number.isFinite(lat) || !Number.isFinite(lng)) return null;

  return {
    id: center.id || `${center.name || 'center'}-${lat}-${lng}`,
    name: center.name || 'Unnamed center',
    type: center.type || 'NGO',
    district: center.district || 'Unknown district',
    state: center.state || center.stateName || center.stateCode || 'Unknown state',
    stateName: center.stateName || '',
    stateCode: center.stateCode || '',
    city: center.city || '',
    address: center.address || 'Address not available',
    contact: center.contact || center.phone || '',
    verified: center.verified === true,
    active: center.active !== false,
    lat,
    lng,
  };
}

function getDistanceKm(a, b) {
  if (!a || !b) return null;

  const toRad = (d) => (d * Math.PI) / 180;
  const R = 6371;
  const dLat = toRad(b.lat - a.lat);
  const dLng = toRad(b.lng - a.lng);
  const lat1 = toRad(a.lat);
  const lat2 = toRad(b.lat);

  const x =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.sin(dLng / 2) * Math.sin(dLng / 2) * Math.cos(lat1) * Math.cos(lat2);

  const y = 2 * Math.atan2(Math.sqrt(x), Math.sqrt(1 - x));
  return R * y;
}

export function MapRadar() {
  const {
    coords,
    loading: geoLoading,
    error: geoError,
    accuracy,
    bestAccuracy,
    refetch,
  } = useGeoLocation();

  const [typeFilter, setTypeFilter] = useState('all');
  const [searchRadius, setSearchRadius] = useState(20);
  const [allCenters, setAllCenters] = useState([]);
  const [allLoading, setAllLoading] = useState(false);
  const [allError, setAllError] = useState(null);
  const [favoritesOnly, setFavoritesOnly] = useState(false);
  const [favIds, setFavIds] = useState(() => new Set(safeReadFavs().map((item) => item.id)));
  const [copiedId, setCopiedId] = useState('');

  const userLocation = useMemo(() => {
    if (!coords) return null;
    return { lat: coords.latitude, lng: coords.longitude };
  }, [coords]);

  const {
    results: nearbyCenters,
    loading: nearbyLoading,
    error: nearbyError,
  } = useNearbyRescueCenters(
    userLocation,
    searchRadius,
    typeFilter === 'all' ? null : typeFilter
  );

  useEffect(() => {
    if (userLocation) return;

    const loadAllCenters = async () => {
      setAllLoading(true);
      setAllError(null);

      try {
        const q = query(collection(db, 'rescueCenters'), orderBy('state'), limit(250));
        const snap = await getDocs(q);

        const data = snap.docs
          .map((d) => normalizeCenter({ id: d.id, ...d.data() }))
          .filter(Boolean)
          .filter((c) => c.active);

        const filtered =
          typeFilter === 'all' ? data : data.filter((c) => c.type === typeFilter);

        setAllCenters(filtered);
      } catch (err) {
        console.error(err);
        setAllError('Failed to load centers.');
      } finally {
        setAllLoading(false);
      }
    };

    loadAllCenters();
  }, [userLocation, typeFilter]);

  const rawCenters = userLocation ? nearbyCenters : allCenters;
  const loading = userLocation ? nearbyLoading : allLoading;
  const error = userLocation ? nearbyError : allError;

  const centers = useMemo(() => {
    let normalized = rawCenters
      .map((center) => normalizeCenter(center))
      .filter(Boolean)
      .filter((center) => center.active);

    if (typeFilter !== 'all') {
      normalized = normalized.filter((center) => center.type === typeFilter);
    }

    if (favoritesOnly) {
      normalized = normalized.filter((center) => favIds.has(center.id));
    }

    return normalized
      .map((center) => ({
        ...center,
        distanceKm: userLocation ? getDistanceKm(userLocation, center) : null,
      }))
      .sort((a, b) => {
        if (a.distanceKm == null && b.distanceKm == null) return a.name.localeCompare(b.name);
        if (a.distanceKm == null) return 1;
        if (b.distanceKm == null) return -1;
        return a.distanceKm - b.distanceKm;
      });
  }, [rawCenters, typeFilter, favoritesOnly, favIds, userLocation]);

  const updateFavs = useCallback((center) => {
    const current = safeReadFavs();
    const exists = current.some((item) => item.id === center.id);

    const updated = exists
      ? current.filter((item) => item.id !== center.id)
      : [center, ...current].slice(0, 100);

    safeWriteFavs(updated);
    setFavIds(new Set(updated.map((item) => item.id)));
  }, []);

  const getIcon = (type) => {
    if (type === 'Hospital') return hospitalIcon;
    if (type === 'Shelter') return shelterIcon;
    if (type === 'Rescue') return rescueIcon;
    return ngoIcon;
  };

  const handleCopyAddress = async (center) => {
    try {
      await navigator.clipboard.writeText(
        `${center.name}, ${center.address}, ${center.district}, ${center.state}`
      );
      setCopiedId(center.id);
      setTimeout(() => setCopiedId(''), 1800);
    } catch (err) {
      console.error('Copy failed', err);
      alert('Could not copy address');
    }
  };

  const locationQuality =
    typeof (bestAccuracy || accuracy) === 'number'
      ? bestAccuracy || accuracy
      : null;

  const isApproximate = locationQuality != null && locationQuality > 1000;

  return (
    <main
      style={{
        minHeight: '100vh',
        background:
          'linear-gradient(180deg, #f8f5ef 0%, #fcfbf7 45%, #eef6ef 100%)',
      }}
    >
      <section
        style={{
          background:
            'linear-gradient(135deg, #0f4f3f 0%, #1f6b55 55%, #2a7a5f 100%)',
          color: '#fffaf2',
          padding: '2.5rem 0 2rem',
          borderBottomLeftRadius: '24px',
          borderBottomRightRadius: '24px',
          boxShadow: '0 10px 30px rgba(16, 52, 40, 0.18)',
        }}
      >
        <div className="container" style={{ display: 'grid', gap: '1rem' }}>
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.5rem',
              background: 'rgba(255,255,255,0.12)',
              padding: '0.45rem 0.8rem',
              borderRadius: '999px',
              width: 'fit-content',
              fontSize: '0.88rem',
              fontWeight: 700,
            }}
          >
            🐾 Rescue Map • Real help nearby
          </div>

          <div>
            <h1
              style={{
                fontSize: 'clamp(1.8rem, 4vw, 2.9rem)',
                lineHeight: 1.1,
                fontWeight: 800,
                marginBottom: '0.75rem',
              }}
            >
              Find nearby NGOs, shelters, hospitals, and rescue teams
            </h1>
            <p
              style={{
                color: 'rgba(255,250,242,0.85)',
                maxWidth: '760px',
                fontSize: '1rem',
              }}
            >
              Injury, abandonment, accident, emergency rescue — yahan se nearest verified help
              center jaldi dekho, call karo, directions kholo, aur animal ko time par support do.
            </p>
          </div>

          <div
            style={{
              display: 'flex',
              flexWrap: 'wrap',
              gap: '0.75rem',
            }}
          >
            <button
              type="button"
              onClick={() => refetch?.()}
              style={primaryBtn}
            >
              📍 Refresh exact location
            </button>

            <button
              type="button"
              onClick={() => setFavoritesOnly((v) => !v)}
              style={secondaryBtn}
            >
              {favoritesOnly ? '❤️ Showing favorites' : '🤍 Favorites only'}
            </button>
          </div>
        </div>
      </section>

      <section style={{ padding: '1rem 0' }}>
        <div
          className="container"
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(210px, 1fr))',
            gap: '1rem',
          }}
        >
          <div style={infoCard}>
            <div style={labelStyle}>Location status</div>
            <div style={valueStyle}>
              {geoLoading
                ? 'Locating you...'
                : geoError
                ? 'Location blocked'
                : userLocation
                ? 'Active'
                : 'Waiting'}
            </div>
            <div style={subtleText}>
              {geoError
                ? 'Permission denied or browser could not detect location.'
                : userLocation
                ? `${userLocation.lat.toFixed(5)}, ${userLocation.lng.toFixed(5)}`
                : 'Map will show all India if location is unavailable.'}
            </div>
          </div>

          <div style={infoCard}>
            <div style={labelStyle}>Accuracy</div>
            <div style={valueStyle}>
              {locationQuality != null ? `${Math.round(locationQuality)} m` : 'Not available'}
            </div>
            <div style={subtleText}>
              {isApproximate
                ? 'Approximate location. Refresh for better precision.'
                : 'Better accuracy means better nearby results.'}
            </div>
          </div>

          <div style={infoCard}>
            <div style={labelStyle}>Search radius</div>
            <div style={valueStyle}>{searchRadius} km</div>
            <div style={subtleText}>Adjust range to find more rescue support.</div>
          </div>

          <div style={infoCard}>
            <div style={labelStyle}>Visible centers</div>
            <div style={valueStyle}>{centers.length}</div>
            <div style={subtleText}>
              {favoritesOnly ? 'Filtered to favorites only.' : 'Includes active mapped centers.'}
            </div>
          </div>
        </div>
      </section>

      <section style={{ padding: '0 0 1rem' }}>
        <div
          className="container"
          style={{
            background: '#fffdf8',
            border: '1px solid rgba(16, 52, 40, 0.08)',
            borderRadius: '18px',
            padding: '1rem',
            boxShadow: '0 10px 30px rgba(18, 32, 24, 0.06)',
            display: 'grid',
            gap: '1rem',
          }}
        >
          <div
            style={{
              display: 'flex',
              flexWrap: 'wrap',
              gap: '0.75rem',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}
          >
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
              {['all', 'NGO', 'Hospital', 'Shelter', 'Rescue'].map((type) => (
                <button
                  key={type}
                  type="button"
                  onClick={() => setTypeFilter(type)}
                  style={{
                    padding: '0.7rem 1rem',
                    borderRadius: '999px',
                    cursor: 'pointer',
                    fontWeight: 700,
                    fontSize: '0.92rem',
                    backgroundColor: typeFilter === type ? '#d95d39' : '#ffffff',
                    color: typeFilter === type ? '#fff' : '#264235',
                    border:
                      typeFilter === type
                        ? '1px solid #d95d39'
                        : '1px solid rgba(38, 66, 53, 0.14)',
                    boxShadow:
                      typeFilter === type
                        ? '0 10px 20px rgba(217, 93, 57, 0.18)'
                        : 'none',
                  }}
                >
                  {type === 'all' ? 'All centers' : type}
                </button>
              ))}
            </div>

            <div style={{ minWidth: '220px' }}>
              <label
                htmlFor="radius"
                style={{
                  display: 'block',
                  marginBottom: '0.35rem',
                  fontSize: '0.9rem',
                  fontWeight: 700,
                  color: '#264235',
                }}
              >
                Radius: {searchRadius} km
              </label>
              <input
                id="radius"
                type="range"
                min="5"
                max="200"
                step="5"
                value={searchRadius}
                onChange={(event) => setSearchRadius(Number(event.target.value))}
                style={{ width: '100%' }}
              />
            </div>
          </div>

          {geoError && (
            <div style={warningCard}>
              ⚠️ Location permission off hai. Abhi all-India mapped centers dikh rahe hain.
            </div>
          )}

          {isApproximate && (
            <div style={warningCard}>
              📡 Current location approximate lag rahi hai. Nearby results exact na ho sakte.
            </div>
          )}
        </div>
      </section>

      <section style={{ padding: '0 0 1rem' }}>
        {loading && (
          <div className="container" style={stateCard}>
            Loading rescue centers...
          </div>
        )}

        {error && (
          <div className="container" style={{ ...stateCard, color: '#b42318' }}>
            {error}
          </div>
        )}

        {!loading && !error && (
          <div className="container">
            <div
              style={{
                borderRadius: '22px',
                overflow: 'hidden',
                border: '1px solid rgba(16, 52, 40, 0.08)',
                boxShadow: '0 20px 40px rgba(18, 32, 24, 0.09)',
              }}
            >
              <MapContainer
                center={userLocation ? [userLocation.lat, userLocation.lng] : [INDIA_CENTER.lat, INDIA_CENTER.lng]}
                zoom={userLocation ? 12 : 5}
                minZoom={4}
                maxZoom={18}
                style={{ height: '72vh', width: '100%' }}
              >
                <TileLayer
                  attribution='&copy; <a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noopener noreferrer">OpenStreetMap</a>'
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />

                {userLocation && (
                  <Marker
                    position={[userLocation.lat, userLocation.lng]}
                    icon={userIcon}
                    title="Your current location"
                    alt="Your current location"
                  >
                    <Popup>
                      <div tabIndex={0}>
                        <strong>You are here</strong>
                        <div style={{ marginTop: '0.4rem', fontSize: '0.9rem' }}>
                          {locationQuality != null
                            ? `Accuracy: ${Math.round(locationQuality)} meters`
                            : 'Accuracy unavailable'}
                        </div>
                      </div>
                    </Popup>
                  </Marker>
                )}

                {centers.map((center) => {
                  const isFav = favIds.has(center.id);
                  const mapsUrl = `https://www.google.com/maps/dir/?api=1&destination=${center.lat},${center.lng}`;
                  const telHref = center.contact ? `tel:${center.contact}` : null;

                  return (
                    <Marker
                      key={center.id}
                      position={[center.lat, center.lng]}
                      icon={getIcon(center.type)}
                      title={`${center.name} ${center.type}`}
                      alt={`${center.name} ${center.type}`}
                    >
                      <Popup maxWidth={280}>
                        <div tabIndex={0} style={{ minWidth: '220px' }}>
                          <div
                            style={{
                              display: 'flex',
                              alignItems: 'start',
                              justifyContent: 'space-between',
                              gap: '0.75rem',
                            }}
                          >
                            <div>
                              <h3
                                style={{
                                  margin: '0 0 0.35rem',
                                  fontSize: '1rem',
                                  fontWeight: 800,
                                  color: '#1f3a2d',
                                }}
                              >
                                {center.name}
                              </h3>
                              <div
                                style={{
                                  display: 'flex',
                                  flexWrap: 'wrap',
                                  gap: '0.4rem',
                                  marginBottom: '0.45rem',
                                }}
                              >
                                <span style={chipStyle(center.type)}>
                                  {center.type}
                                </span>
                                {center.verified && (
                                  <span style={verifiedChip}>Verified</span>
                                )}
                              </div>
                            </div>

                            <button
                              type="button"
                              onClick={() => updateFavs(center)}
                              style={{
                                border: 'none',
                                background: isFav ? '#ffe2df' : '#f3f4f6',
                                color: isFav ? '#d95d39' : '#445',
                                borderRadius: '999px',
                                padding: '0.45rem 0.6rem',
                                cursor: 'pointer',
                                fontWeight: 700,
                              }}
                            >
                              {isFav ? '❤️' : '🤍'}
                            </button>
                          </div>

                          <p
                            style={{
                              margin: '0 0 0.45rem',
                              fontSize: '0.9rem',
                              color: '#5b665f',
                            }}
                          >
                            {center.district}, {center.state}
                          </p>

                          {center.distanceKm != null && (
                            <p
                              style={{
                                margin: '0 0 0.45rem',
                                fontSize: '0.88rem',
                                color: '#1f6b55',
                                fontWeight: 700,
                              }}
                            >
                              Approx. {center.distanceKm.toFixed(1)} km away
                            </p>
                          )}

                          <p
                            style={{
                              margin: '0 0 0.7rem',
                              fontSize: '0.88rem',
                              color: '#55615a',
                              lineHeight: 1.5,
                            }}
                          >
                            {center.address}
                          </p>

                          <div
                            style={{
                              display: 'flex',
                              flexWrap: 'wrap',
                              gap: '0.5rem',
                            }}
                          >
                            {telHref && (
                              <a
                                href={telHref}
                                style={popupLinkPrimary}
                              >
                                📞 Call
                              </a>
                            )}

                            <a
                              href={mapsUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              style={popupLinkSecondary}
                            >
                              🧭 Directions
                            </a>

                            <button
                              type="button"
                              onClick={() => handleCopyAddress(center)}
                              style={popupBtn}
                            >
                              {copiedId === center.id ? 'Copied' : 'Copy address'}
                            </button>
                          </div>
                        </div>
                      </Popup>
                    </Marker>
                  );
                })}

                <FitMapToMarkers centers={centers} userLocation={userLocation} />
              </MapContainer>
            </div>
          </div>
        )}
      </section>

      {!loading && !error && (
        <section style={{ padding: '0 0 2rem' }}>
          <div
            className="container"
            style={{
              display: 'grid',
              gap: '1rem',
              gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
            }}
          >
            {centers.length === 0 ? (
              <div style={{ ...stateCard, gridColumn: '1 / -1' }}>
                No centers found in this radius. Increase radius or switch filters.
              </div>
            ) : (
              centers.slice(0, 6).map((center) => (
                <div
                  key={center.id}
                  style={{
                    background: '#fffdf8',
                    borderRadius: '18px',
                    padding: '1rem',
                    border: '1px solid rgba(16, 52, 40, 0.08)',
                    boxShadow: '0 12px 26px rgba(18, 32, 24, 0.06)',
                  }}
                >
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'start',
                      justifyContent: 'space-between',
                      gap: '0.75rem',
                      marginBottom: '0.65rem',
                    }}
                  >
                    <div>
                      <h3
                        style={{
                          margin: 0,
                          fontSize: '1rem',
                          color: '#1f3a2d',
                          fontWeight: 800,
                        }}
                      >
                        {center.name}
                      </h3>
                      <p
                        style={{
                          margin: '0.3rem 0 0',
                          fontSize: '0.88rem',
                          color: '#5d675f',
                        }}
                      >
                        {center.district}, {center.state}
                      </p>
                    </div>
                    <span style={chipStyle(center.type)}>{center.type}</span>
                  </div>

                  <p
                    style={{
                      margin: '0 0 0.75rem',
                      fontSize: '0.9rem',
                      color: '#55615a',
                      lineHeight: 1.5,
                    }}
                  >
                    {center.address}
                  </p>

                  <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                    {center.contact && (
                      <a href={`tel:${center.contact}`} style={popupLinkPrimary}>
                        Call
                      </a>
                    )}
                    <a
                      href={`https://www.google.com/maps/dir/?api=1&destination=${center.lat},${center.lng}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      style={popupLinkSecondary}
                    >
                      Directions
                    </a>
                  </div>
                </div>
              ))
            )}
          </div>
        </section>
      )}
    </main>
  );
}

const primaryBtn = {
  padding: '0.85rem 1.15rem',
  borderRadius: '999px',
  border: '1px solid rgba(255,255,255,0.16)',
  background: '#fff7ef',
  color: '#1f3a2d',
  fontWeight: 800,
  cursor: 'pointer',
};

const secondaryBtn = {
  padding: '0.85rem 1.15rem',
  borderRadius: '999px',
  border: '1px solid rgba(255,255,255,0.18)',
  background: 'rgba(255,255,255,0.1)',
  color: '#fffaf2',
  fontWeight: 700,
  cursor: 'pointer',
};

const infoCard = {
  background: '#fffdf8',
  borderRadius: '18px',
  padding: '1rem',
  border: '1px solid rgba(16, 52, 40, 0.08)',
  boxShadow: '0 12px 26px rgba(18, 32, 24, 0.06)',
};

const warningCard = {
  background: '#fff6e9',
  color: '#8a4b12',
  border: '1px solid #f5d7a8',
  borderRadius: '14px',
  padding: '0.95rem 1rem',
  fontWeight: 600,
};

const stateCard = {
  background: '#fffdf8',
  borderRadius: '18px',
  padding: '1.4rem',
  border: '1px solid rgba(16, 52, 40, 0.08)',
  boxShadow: '0 12px 26px rgba(18, 32, 24, 0.06)',
  textAlign: 'center',
  color: '#44554b',
  fontWeight: 600,
};

const labelStyle = {
  fontSize: '0.82rem',
  textTransform: 'uppercase',
  letterSpacing: '0.08em',
  color: '#6a756d',
  marginBottom: '0.45rem',
  fontWeight: 800,
};

const valueStyle = {
  fontSize: '1.3rem',
  color: '#1f3a2d',
  fontWeight: 800,
  marginBottom: '0.3rem',
};

const subtleText = {
  fontSize: '0.9rem',
  color: '#5b665f',
  lineHeight: 1.45,
};

const verifiedChip = {
  display: 'inline-flex',
  alignItems: 'center',
  padding: '0.28rem 0.55rem',
  borderRadius: '999px',
  fontSize: '0.76rem',
  fontWeight: 800,
  background: '#e9f8ef',
  color: '#177245',
};

const chipStyle = (type) => ({
  display: 'inline-flex',
  alignItems: 'center',
  padding: '0.28rem 0.55rem',
  borderRadius: '999px',
  fontSize: '0.76rem',
  fontWeight: 800,
  background:
    type === 'Hospital'
      ? '#e8f1ff'
      : type === 'Shelter'
      ? '#fff1dc'
      : type === 'Rescue'
      ? '#ffe8ea'
      : '#eef7f1',
  color:
    type === 'Hospital'
      ? '#2457a6'
      : type === 'Shelter'
      ? '#9b5b11'
      : type === 'Rescue'
      ? '#b42318'
      : '#1f6b55',
});

const popupLinkPrimary = {
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
  padding: '0.55rem 0.8rem',
  borderRadius: '10px',
  background: '#d95d39',
  color: '#fff',
  textDecoration: 'none',
  fontWeight: 700,
  border: 'none',
};

const popupLinkSecondary = {
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
  padding: '0.55rem 0.8rem',
  borderRadius: '10px',
  background: '#eef7f1',
  color: '#1f6b55',
  textDecoration: 'none',
  fontWeight: 700,
  border: '1px solid rgba(31, 107, 85, 0.12)',
};

const popupBtn = {
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
  padding: '0.55rem 0.8rem',
  borderRadius: '10px',
  background: '#fff',
  color: '#264235',
  textDecoration: 'none',
  fontWeight: 700,
  border: '1px solid rgba(38, 66, 53, 0.12)',
  cursor: 'pointer',
};