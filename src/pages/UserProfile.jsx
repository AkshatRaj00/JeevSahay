import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';

const BANNER_PHOTO =
  'https://images.pexels.com/photos/2253275/pexels-photo-2253275.jpeg?auto=compress&cs=tinysrgb&w=1600';

const ANIMAL_ICONS = {
  Dog: '🐕',
  Cat: '🐈',
  Cow: '🐄',
  Bird: '🐦',
  Other: '🐾',
};

function safeJsonParse(value, fallback) {
  try {
    const parsed = JSON.parse(value ?? '');
    return Array.isArray(parsed) ? parsed : fallback;
  } catch {
    return fallback;
  }
}

function loadRescueHistory() {
  if (typeof window === 'undefined') return [];
  try {
    return safeJsonParse(window.localStorage.getItem('rescueHistory'), []);
  } catch {
    return [];
  }
}

function loadFavNGOs() {
  if (typeof window === 'undefined') return [];
  try {
    return safeJsonParse(window.localStorage.getItem('favNGOs'), []);
  } catch {
    return [];
  }
}

function saveStorage(key, value) {
  try {
    window.localStorage.setItem(key, JSON.stringify(value));
    return true;
  } catch {
    return false;
  }
}

function formatTime(ts) {
  if (!ts) return 'Unknown time';
  const date = new Date(ts);
  if (Number.isNaN(date.getTime())) return 'Unknown time';

  return date.toLocaleString('en-IN', {
    dateStyle: 'medium',
    timeStyle: 'short',
  });
}

function normalizeRescue(item) {
  return {
    ...item,
    animalType: item.animalType || 'Other',
    severity: item.severity || 'Medium',
    description: item.description || 'No description available.',
    createdAt: item.createdAt || item.timestamp || null,
    status: item.status || 'Recorded',
    district: item.district || '',
    location: item.location || item.address || '',
  };
}

function normalizeNGO(item) {
  return {
    ...item,
    type: item.type || 'NGO',
    district: item.district || '',
    state: item.state || '',
    contact: item.contact || item.phone || '',
    verified: item.verified === true,
  };
}

function StatCard({ label, value, hint }) {
  return (
    <div style={statCard}>
      <div style={statLabel}>{label}</div>
      <div style={statValue}>{value}</div>
      {hint ? <div style={statHint}>{hint}</div> : null}
    </div>
  );
}

export function UserProfile() {
  const [rescueHistory, setRescueHistory] = useState(() =>
    loadRescueHistory().map(normalizeRescue).sort((a, b) => {
      const at = new Date(b.createdAt || 0).getTime();
      const bt = new Date(a.createdAt || 0).getTime();
      return at - bt;
    })
  );

  const [favNGOs, setFavNGOs] = useState(() =>
    loadFavNGOs().map(normalizeNGO).sort((a, b) => (a.name || '').localeCompare(b.name || ''))
  );

  const [activeTab, setActiveTab] = useState('rescues');

  const stats = useMemo(() => {
    const critical = rescueHistory.filter((r) => r.severity === 'Critical').length;
    const high = rescueHistory.filter((r) => r.severity === 'High').length;
    const verified = favNGOs.filter((n) => n.verified).length;

    return {
      rescues: rescueHistory.length,
      critical,
      high,
      favorites: favNGOs.length,
      verified,
    };
  }, [rescueHistory, favNGOs]);

  const handleClearHistory = () => {
    if (window.confirm('Delete all your rescue history? This cannot be undone.')) {
      saveStorage('rescueHistory', []);
      setRescueHistory([]);
    }
  };

  const handleRemoveRescue = (id) => {
    const updated = rescueHistory.filter((r) => r.id !== id);
    saveStorage('rescueHistory', updated);
    setRescueHistory(updated);
  };

  const handleRemoveFav = (ngoId) => {
    const updated = favNGOs.filter((n) => n.id !== ngoId);
    saveStorage('favNGOs', updated);
    setFavNGOs(updated);
  };

  const tabButtonStyle = (active) => ({
    ...tabButtonBase,
    backgroundColor: active ? '#d96b3b' : '#ffffff',
    color: active ? '#fffaf1' : '#274236',
    border: active ? '1px solid #d96b3b' : '1px solid rgba(39,66,54,0.14)',
    boxShadow: active ? '0 10px 24px rgba(217,107,59,0.15)' : 'none',
  });

  return (
    <main style={pageRoot}>
      <section
        style={{
          ...heroStyle,
          backgroundImage: `linear-gradient(180deg, rgba(15, 52, 39, 0.22), rgba(15, 52, 39, 0.72)), url(${BANNER_PHOTO})`,
        }}
      >
        <div className="container" style={heroInner}>
          <div style={heroCard}>
            <div style={pill}>🐾 Rescue dashboard</div>
            <h1 style={heroTitle}>My Profile</h1>
            <p style={heroText}>
              Your rescue history and favourite NGOs, hospitals, and shelter centers — saved on this device.
            </p>

            <div style={heroActions}>
              <Link to="/report" style={primaryBtn}>
                🆘 Report SOS
              </Link>
              <Link to="/map" style={secondaryBtn}>
                📍 Open map
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section style={summaryWrap}>
        <div className="container" style={summaryGrid}>
          <StatCard
            label="Total rescues"
            value={stats.rescues}
            hint="All saved reports on this device."
          />
          <StatCard
            label="Critical cases"
            value={stats.critical}
            hint="Needs immediate attention."
          />
          <StatCard
            label="High priority"
            value={stats.high}
            hint="Marked as urgent."
          />
          <StatCard
            label="Favourite centers"
            value={stats.favorites}
            hint={`${stats.verified} verified favorites`}
          />
        </div>
      </section>

      <section style={tabsWrap}>
        <div className="container">
          <div role="tablist" aria-label="Profile sections" style={tabList}>
            <button
              type="button"
              role="tab"
              aria-selected={activeTab === 'rescues'}
              aria-controls="rescues-panel"
              id="rescues-tab"
              onClick={() => setActiveTab('rescues')}
              style={tabButtonStyle(activeTab === 'rescues')}
            >
              🆘 My Rescues ({rescueHistory.length})
            </button>

            <button
              type="button"
              role="tab"
              aria-selected={activeTab === 'favourites'}
              aria-controls="favourites-panel"
              id="favourites-tab"
              onClick={() => setActiveTab('favourites')}
              style={tabButtonStyle(activeTab === 'favourites')}
            >
              ❤️ Favourite Centers ({favNGOs.length})
            </button>
          </div>
        </div>
      </section>

      {activeTab === 'rescues' && (
        <section
          id="rescues-panel"
          role="tabpanel"
          aria-labelledby="rescues-tab"
          style={panelWrap}
        >
          <div className="container" style={panelInner}>
            <div style={sectionHead}>
              <div>
                <h2 style={sectionTitle}>Your Rescue History</h2>
                <p style={sectionSub}>
                  Recent rescue reports, priority tags, and follow-up notes.
                </p>
              </div>

              {rescueHistory.length > 0 && (
                <button type="button" onClick={handleClearHistory} style={dangerBtn}>
                  🗑️ Clear all
                </button>
              )}
            </div>

            {rescueHistory.length === 0 ? (
              <div style={emptyState}>
                <div style={emptyIcon}>🐾</div>
                <h3 style={emptyTitle}>No rescues yet</h3>
                <p style={emptyText}>
                  Your first SOS report will show up here with date, severity, and notes.
                </p>
                <Link to="/report" style={primaryBtn}>
                  Create first SOS
                </Link>
              </div>
            ) : (
              <ul style={cardList}>
                {rescueHistory.map((rescue) => (
                  <li key={rescue.id} style={rescueCard}>
                    <div style={rescueThumbWrap}>
                      {rescue.photoUrl ? (
                        <img
                          src={rescue.photoUrl}
                          alt={rescue.animalType || 'Animal rescue'}
                          style={rescueThumb}
                          loading="lazy"
                          decoding="async"
                        />
                      ) : (
                        <div style={rescueFallback}>
                          {ANIMAL_ICONS[rescue.animalType] || ANIMAL_ICONS.Other}
                        </div>
                      )}
                    </div>

                    <div style={rescueBody}>
                      <div style={rescueTopRow}>
                        <div>
                          <div style={rescueMetaRow}>
                            <span style={animalTag}>{ANIMAL_ICONS[rescue.animalType] || '🐾'} {rescue.animalType}</span>
                            <span style={severityTag(rescue.severity)}>{rescue.severity}</span>
                            <span style={statusTag}>{rescue.status}</span>
                          </div>
                          <h3 style={rescueTitle}>{rescue.description}</h3>
                        </div>

                        <button
                          type="button"
                          onClick={() => handleRemoveRescue(rescue.id)}
                          style={iconDangerBtn}
                          title="Delete rescue"
                          aria-label="Delete rescue"
                        >
                          🗑️
                        </button>
                      </div>

                      <div style={rescueInfoGrid}>
                        <div><span style={infoLabel}>Time</span><div style={infoValue}>{formatTime(rescue.createdAt)}</div></div>
                        <div><span style={infoLabel}>District</span><div style={infoValue}>{rescue.district || '—'}</div></div>
                        <div><span style={infoLabel}>Location</span><div style={infoValue}>{rescue.location || '—'}</div></div>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </section>
      )}

      {activeTab === 'favourites' && (
        <section
          id="favourites-panel"
          role="tabpanel"
          aria-labelledby="favourites-tab"
          style={panelWrap}
        >
          <div className="container" style={panelInner}>
            <div style={sectionHead}>
              <div>
                <h2 style={sectionTitle}>Favourite NGOs & Hospitals</h2>
                <p style={sectionSub}>
                  Centers you saved for quick contact and directions during emergencies.
                </p>
              </div>
            </div>

            {favNGOs.length === 0 ? (
              <div style={emptyState}>
                <div style={emptyIcon}>❤️</div>
                <h3 style={emptyTitle}>No favourites yet</h3>
                <p style={emptyText}>
                  Save trusted NGOs, shelters, and hospitals from the map to access them faster later.
                </p>
                <Link to="/map" style={primaryBtn}>
                  Find centers on map
                </Link>
              </div>
            ) : (
              <ul style={favoriteList}>
                {favNGOs.map((ngo) => (
                  <li key={ngo.id} style={favCard}>
                    <div style={{ flex: 1 }}>
                      <div style={favHeaderRow}>
                        <h3 style={favName}>{ngo.name || 'Unnamed center'}</h3>
                        {ngo.verified && <span style={verifiedChip}>Verified</span>}
                      </div>

                      <p style={favMeta}>
                        {ngo.type || 'Center'} • {ngo.district || 'Unknown district'}
                        {ngo.state ? `, ${ngo.state}` : ''}
                      </p>

                      {ngo.contact ? (
                        <a href={`tel:${ngo.contact}`} style={contactLink}>
                          📞 {ngo.contact}
                        </a>
                      ) : (
                        <div style={mutedLine}>No contact number saved</div>
                      )}
                    </div>

                    <div style={favActions}>
                      {ngo.lat != null && ngo.lng != null && (
                        <a
                          href={`https://www.google.com/maps/dir/?api=1&destination=${ngo.lat},${ngo.lng}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          style={secondaryBtnSmall}
                        >
                          🧭 Directions
                        </a>
                      )}
                      <button
                        type="button"
                        onClick={() => handleRemoveFav(ngo.id)}
                        style={dangerBtnSmall}
                      >
                        Remove
                      </button>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </section>
      )}

      <section style={footerNoteWrap}>
        <div className="container">
          <p style={footerNote}>
            🔒 Data stays on this device only. Browser data clear karoge to history aur favourites bhi clear ho jayenge.
          </p>
        </div>
      </section>
    </main>
  );
}

const pageRoot = {
  minHeight: '100vh',
  background: 'linear-gradient(180deg, #f7f3eb 0%, #fffdf8 48%, #eef6ef 100%)',
};

const heroStyle = {
  position: 'relative',
  minHeight: '38vh',
  backgroundSize: 'cover',
  backgroundPosition: 'center',
  borderBottomLeftRadius: '28px',
  borderBottomRightRadius: '28px',
  overflow: 'hidden',
};

const heroInner = {
  position: 'relative',
  minHeight: '38vh',
  display: 'flex',
  alignItems: 'center',
  paddingTop: '2rem',
  paddingBottom: '2rem',
};

const heroCard = {
  maxWidth: '720px',
  background: 'rgba(12, 26, 20, 0.45)',
  backdropFilter: 'blur(10px)',
  border: '1px solid rgba(255,255,255,0.16)',
  borderRadius: '22px',
  padding: '1.25rem',
  color: '#fffdf8',
  boxShadow: '0 20px 40px rgba(0,0,0,0.18)',
};

const pill = {
  display: 'inline-flex',
  alignItems: 'center',
  padding: '0.38rem 0.75rem',
  borderRadius: '999px',
  background: 'rgba(255,255,255,0.12)',
  color: '#fff8ee',
  fontSize: '0.82rem',
  fontWeight: 800,
  marginBottom: '0.85rem',
};

const heroTitle = {
  margin: 0,
  fontSize: 'clamp(2rem, 5vw, 3.2rem)',
  lineHeight: 1.05,
  fontWeight: 900,
};

const heroText = {
  margin: '0.8rem 0 0',
  fontSize: '1rem',
  lineHeight: 1.65,
  color: 'rgba(255,255,255,0.88)',
  maxWidth: '62ch',
};

const heroActions = {
  display: 'flex',
  flexWrap: 'wrap',
  gap: '0.75rem',
  marginTop: '1rem',
};

const primaryBtn = {
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
  padding: '0.88rem 1.15rem',
  borderRadius: '999px',
  background: '#d96b3b',
  color: '#fffaf1',
  textDecoration: 'none',
  border: '1px solid #d96b3b',
  fontWeight: 800,
};

const secondaryBtn = {
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
  padding: '0.88rem 1.15rem',
  borderRadius: '999px',
  background: 'rgba(255,255,255,0.1)',
  color: '#fffaf1',
  textDecoration: 'none',
  border: '1px solid rgba(255,255,255,0.18)',
  fontWeight: 800,
};

const summaryWrap = {
  padding: '1rem 0 0.4rem',
};

const summaryGrid = {
  display: 'grid',
  gridTemplateColumns: 'repeat(auto-fit, minmax(190px, 1fr))',
  gap: '1rem',
};

const statCard = {
  background: '#fffdf8',
  border: '1px solid rgba(39, 66, 54, 0.08)',
  borderRadius: '18px',
  padding: '1rem',
  boxShadow: '0 12px 26px rgba(18, 32, 24, 0.06)',
};

const statLabel = {
  fontSize: '0.78rem',
  textTransform: 'uppercase',
  letterSpacing: '0.08em',
  color: '#6b756d',
  fontWeight: 800,
  marginBottom: '0.4rem',
};

const statValue = {
  fontSize: '1.6rem',
  fontWeight: 900,
  color: '#1f3a2d',
  lineHeight: 1,
};

const statHint = {
  marginTop: '0.45rem',
  fontSize: '0.9rem',
  color: '#5a655e',
  lineHeight: 1.45,
};

const tabsWrap = {
  padding: '1rem 0 0',
};

const tabList = {
  display: 'flex',
  flexWrap: 'wrap',
  gap: '0.7rem',
  alignItems: 'center',
};

const tabButtonBase = {
  padding: '0.82rem 1.1rem',
  borderRadius: '999px',
  cursor: 'pointer',
  fontWeight: 800,
  fontSize: '0.95rem',
  transition: 'all 180ms ease',
};

const panelWrap = {
  padding: '1.2rem 0 2rem',
};

const panelInner = {
  background: '#fffdf8',
  border: '1px solid rgba(39, 66, 54, 0.08)',
  borderRadius: '22px',
  padding: '1.1rem',
  boxShadow: '0 14px 30px rgba(18, 32, 24, 0.06)',
};

const sectionHead = {
  display: 'flex',
  justifyContent: 'space-between',
  gap: '1rem',
  alignItems: 'start',
  marginBottom: '1rem',
  flexWrap: 'wrap',
};

const sectionTitle = {
  margin: 0,
  fontSize: '1.35rem',
  fontWeight: 900,
  color: '#1f3a2d',
};

const sectionSub = {
  margin: '0.35rem 0 0',
  color: '#5b665f',
  lineHeight: 1.5,
};

const dangerBtn = {
  padding: '0.8rem 1rem',
  borderRadius: '999px',
  border: '1px solid #e2a1a1',
  background: '#fff',
  color: '#b42318',
  fontWeight: 800,
  cursor: 'pointer',
};

const emptyState = {
  padding: '3rem 1rem',
  textAlign: 'center',
  display: 'grid',
  justifyItems: 'center',
  gap: '0.75rem',
};

const emptyIcon = {
  width: '64px',
  height: '64px',
  borderRadius: '999px',
  display: 'grid',
  placeItems: 'center',
  background: '#edf6ef',
  fontSize: '1.7rem',
};

const emptyTitle = {
  margin: 0,
  fontSize: '1.2rem',
  fontWeight: 900,
  color: '#1f3a2d',
};

const emptyText = {
  margin: 0,
  maxWidth: '46ch',
  color: '#5b665f',
  lineHeight: 1.6,
};

const cardList = {
  listStyle: 'none',
  padding: 0,
  margin: 0,
  display: 'grid',
  gap: '1rem',
};

const rescueCard = {
  display: 'grid',
  gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
  gap: '1rem',
  padding: '1rem',
  borderRadius: '18px',
  border: '1px solid rgba(39, 66, 54, 0.08)',
  background: '#fff',
  boxShadow: '0 10px 20px rgba(18, 32, 24, 0.05)',
};

const rescueThumbWrap = {
  width: '96px',
  height: '96px',
  borderRadius: '14px',
  overflow: 'hidden',
  background: '#eff2ef',
  flexShrink: 0,
};

const rescueThumb = {
  width: '100%',
  height: '100%',
  objectFit: 'cover',
};

const rescueFallback = {
  width: '100%',
  height: '100%',
  display: 'grid',
  placeItems: 'center',
  fontSize: '2rem',
};

const rescueBody = {
  minWidth: 0,
};

const rescueTopRow = {
  display: 'flex',
  justifyContent: 'space-between',
  gap: '0.75rem',
  alignItems: 'start',
};

const rescueMetaRow = {
  display: 'flex',
  flexWrap: 'wrap',
  gap: '0.45rem',
  marginBottom: '0.5rem',
};

const animalTag = {
  display: 'inline-flex',
  alignItems: 'center',
  gap: '0.25rem',
  padding: '0.3rem 0.55rem',
  borderRadius: '999px',
  background: '#eef7f1',
  color: '#1f6b55',
  fontSize: '0.77rem',
  fontWeight: 800,
};

const severityTag = (severity) => ({
  display: 'inline-flex',
  alignItems: 'center',
  padding: '0.3rem 0.55rem',
  borderRadius: '999px',
  fontSize: '0.77rem',
  fontWeight: 800,
  background:
    severity === 'Critical'
      ? '#ffe4e2'
      : severity === 'High'
      ? '#fff0d8'
      : '#eaf6ee',
  color:
    severity === 'Critical'
      ? '#b42318'
      : severity === 'High'
      ? '#8a4b12'
      : '#177245',
});

const statusTag = {
  display: 'inline-flex',
  alignItems: 'center',
  padding: '0.3rem 0.55rem',
  borderRadius: '999px',
  fontSize: '0.77rem',
  fontWeight: 800,
  background: '#f1f3f5',
  color: '#44554b',
};

const rescueTitle = {
  margin: 0,
  fontSize: '1.03rem',
  fontWeight: 850,
  color: '#1f3a2d',
  lineHeight: 1.35,
};

const iconDangerBtn = {
  width: '40px',
  height: '40px',
  borderRadius: '999px',
  border: '1px solid rgba(180, 35, 24, 0.18)',
  background: '#fff',
  color: '#b42318',
  cursor: 'pointer',
  flexShrink: 0,
};

const rescueInfoGrid = {
  display: 'grid',
  gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))',
  gap: '0.7rem',
  marginTop: '0.85rem',
};

const infoLabel = {
  display: 'block',
  fontSize: '0.76rem',
  textTransform: 'uppercase',
  letterSpacing: '0.08em',
  color: '#6a756d',
  fontWeight: 800,
  marginBottom: '0.2rem',
};

const infoValue = {
  color: '#33463b',
  fontWeight: 700,
  lineHeight: 1.45,
};

const favoriteList = {
  listStyle: 'none',
  padding: 0,
  margin: 0,
  display: 'grid',
  gap: '1rem',
};

const favCard = {
  display: 'flex',
  gap: '1rem',
  alignItems: 'start',
  justifyContent: 'space-between',
  padding: '1rem',
  borderRadius: '18px',
  border: '1px solid rgba(39, 66, 54, 0.08)',
  background: '#fff',
  boxShadow: '0 10px 20px rgba(18, 32, 24, 0.05)',
  flexWrap: 'wrap',
};

const favHeaderRow = {
  display: 'flex',
  gap: '0.6rem',
  alignItems: 'center',
  flexWrap: 'wrap',
};

const favName = {
  margin: 0,
  fontSize: '1.05rem',
  fontWeight: 900,
  color: '#1f3a2d',
};

const verifiedChip = {
  display: 'inline-flex',
  alignItems: 'center',
  padding: '0.3rem 0.55rem',
  borderRadius: '999px',
  fontSize: '0.76rem',
  fontWeight: 800,
  background: '#eaf6ee',
  color: '#177245',
};

const favMeta = {
  margin: '0.3rem 0 0',
  color: '#5b665f',
  lineHeight: 1.5,
};

const contactLink = {
  display: 'inline-flex',
  marginTop: '0.55rem',
  color: '#d96b3b',
  fontWeight: 800,
  textDecoration: 'none',
};

const mutedLine = {
  marginTop: '0.55rem',
  color: '#6b756d',
  fontSize: '0.92rem',
};

const favActions = {
  display: 'flex',
  gap: '0.6rem',
  flexWrap: 'wrap',
};

const secondaryBtnSmall = {
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
  padding: '0.7rem 0.95rem',
  borderRadius: '999px',
  background: '#eef7f1',
  color: '#1f6b55',
  textDecoration: 'none',
  border: '1px solid rgba(31, 107, 85, 0.12)',
  fontWeight: 800,
};

const dangerBtnSmall = {
  padding: '0.7rem 0.95rem',
  borderRadius: '999px',
  border: '1px solid rgba(180, 35, 24, 0.18)',
  background: '#fff',
  color: '#b42318',
  fontWeight: 800,
  cursor: 'pointer',
};

const footerNoteWrap = {
  padding: '0.5rem 0 2rem',
};

const footerNote = {
  margin: 0,
  textAlign: 'center',
  color: '#66706a',
  lineHeight: 1.6,
  fontSize: '0.92rem',
};