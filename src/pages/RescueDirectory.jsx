import { useMemo, useState } from 'react';
import { awbiDirectoryData } from '../data/awbiDirectoryData';

const HERO_BG =
  'https://images.pexels.com/photos/422218/pexels-photo-422218.jpeg?auto=compress&cs=tinysrgb&w=1600';

const CATEGORY_LABELS = {
  all: 'All',
  ngo: 'NGO',
  hospital: 'Hospital',
  shelter: 'Shelter',
  rescue_team: 'Rescue Team',
};

function normalize(value) {
  return (value || '').toLowerCase().trim();
}

function buildGoogleMapsLink(item) {
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
    `${item.name}, ${item.address}`
  )}`;
}

export function RescueDirectory() {
  const [search, setSearch] = useState('');
  const [selectedState, setSelectedState] = useState('All');
  const [selectedDistrict, setSelectedDistrict] = useState('All');
  const [selectedCategory, setSelectedCategory] = useState('all');

  const states = useMemo(() => {
    return ['All', ...new Set(awbiDirectoryData.map((item) => item.state).filter(Boolean))];
  }, []);

  const districts = useMemo(() => {
    const base = awbiDirectoryData.filter((item) =>
      selectedState === 'All' ? true : item.state === selectedState
    );
    return ['All', ...new Set(base.map((item) => item.district || item.place).filter(Boolean))];
  }, [selectedState]);

  const filteredData = useMemo(() => {
    return awbiDirectoryData.filter((item) => {
      const matchesSearch =
        !search ||
        normalize(item.name).includes(normalize(search)) ||
        normalize(item.address).includes(normalize(search)) ||
        normalize(item.place).includes(normalize(search));

      const matchesState = selectedState === 'All' || item.state === selectedState;
      const matchesDistrict =
        selectedDistrict === 'All' ||
        item.district === selectedDistrict ||
        item.place === selectedDistrict;

      const matchesCategory =
        selectedCategory === 'all' || item.category === selectedCategory;

      return matchesSearch && matchesState && matchesDistrict && matchesCategory;
    });
  }, [search, selectedState, selectedDistrict, selectedCategory]);

  return (
    <main
      style={{
        minHeight: '100vh',
        background: 'linear-gradient(180deg, #f8f5ed 0%, #fffdf9 44%, #eef6f0 100%)',
      }}
    >
      <section
        style={{
          position: 'relative',
          minHeight: '34vh',
          backgroundImage: `linear-gradient(180deg, rgba(14,45,33,0.28), rgba(14,45,33,0.78)), url(${HERO_BG})`,
          backgroundPosition: 'center',
          backgroundSize: 'cover',
          borderBottomLeftRadius: '22px',
          borderBottomRightRadius: '22px',
          overflow: 'hidden',
        }}
      >
        <div
          className="container"
          style={{
            minHeight: '34vh',
            display: 'flex',
            alignItems: 'center',
            padding: '1.6rem 0',
          }}
        >
          <div
            style={{
              maxWidth: '760px',
              background: 'rgba(10, 28, 20, 0.34)',
              border: '1px solid rgba(255,255,255,0.14)',
              borderRadius: '20px',
              backdropFilter: 'blur(10px)',
              padding: '1.1rem',
            }}
          >
            <div style={eyebrow}>🐾 Verified directory starter</div>
            <h1 style={heroTitle}>State & District Rescue Directory</h1>
            <p style={heroText}>
              AWBI-recognized organizations ko state, district, aur category ke hisaab se filter karo.
              Ye directory official-recognition-based starter version hai.
            </p>
          </div>
        </div>
      </section>

      <section style={{ padding: '1.2rem 0 0.7rem' }}>
        <div
          className="container"
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
            gap: '0.85rem',
          }}
        >
          <input
            type="text"
            placeholder="Search by name, place, address..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={inputStyle}
          />

          <select
            value={selectedState}
            onChange={(e) => {
              setSelectedState(e.target.value);
              setSelectedDistrict('All');
            }}
            style={inputStyle}
          >
            {states.map((state) => (
              <option key={state} value={state}>
                {state}
              </option>
            ))}
          </select>

          <select
            value={selectedDistrict}
            onChange={(e) => setSelectedDistrict(e.target.value)}
            style={inputStyle}
          >
            {districts.map((district) => (
              <option key={district} value={district}>
                {district}
              </option>
            ))}
          </select>

          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            style={inputStyle}
          >
            {Object.entries(CATEGORY_LABELS).map(([value, label]) => (
              <option key={value} value={value}>
                {label}
              </option>
            ))}
          </select>
        </div>
      </section>

      <section style={{ padding: '0.4rem 0 2rem' }}>
        <div className="container">
          <div style={metaRow}>
            <div style={resultPill}>Results: {filteredData.length}</div>
            <div style={sourceText}>Source base: AWBI recognized organizations</div>
          </div>

          {filteredData.length === 0 ? (
            <div style={emptyState}>
              <div style={emptyIcon}>🐄</div>
              <h2 style={emptyTitle}>No matching organizations found</h2>
              <p style={emptyText}>
                Filters change karke dekho, ya state aur district selection reset karo.
              </p>
            </div>
          ) : (
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
                gap: '1rem',
              }}
            >
              {filteredData.map((item) => (
                <article key={item.id} style={cardStyle}>
                  <div style={topBadges}>
                    <span style={verifiedBadge}>Verified Base</span>
                    <span style={categoryBadge}>{CATEGORY_LABELS[item.category]}</span>
                  </div>

                  <h2 style={cardTitle}>{item.name}</h2>

                  <div style={codeText}>Code: {item.code}</div>

                  <div style={infoBlock}>
                    <div><strong>State:</strong> {item.state}</div>
                    <div><strong>District:</strong> {item.district || item.place || '—'}</div>
                    <div><strong>Place:</strong> {item.place || '—'}</div>
                  </div>

                  <p style={addressText}>{item.address}</p>

                  <div style={dateGrid}>
                    <div style={miniPanel}>
                      <span style={miniLabel}>Recognition</span>
                      <span style={miniValue}>{item.recognitionDate}</span>
                    </div>
                    <div style={miniPanel}>
                      <span style={miniLabel}>Valid upto</span>
                      <span style={miniValue}>{item.validUpto}</span>
                    </div>
                  </div>

                  <div style={cardFooter}>
                    <a
                      href={buildGoogleMapsLink(item)}
                      target="_blank"
                      rel="noopener noreferrer"
                      style={mapBtn}
                    >
                      📍 Open map
                    </a>
                  </div>
                </article>
              ))}
            </div>
          )}
        </div>
      </section>
    </main>
  );
}

const eyebrow = {
  display: 'inline-flex',
  alignItems: 'center',
  gap: '0.4rem',
  padding: '0.42rem 0.72rem',
  borderRadius: '999px',
  background: 'rgba(255,255,255,0.12)',
  color: '#fffaf1',
  fontSize: '0.8rem',
  fontWeight: 800,
  marginBottom: '0.8rem',
};

const heroTitle = {
  margin: 0,
  color: '#fffaf1',
  fontSize: 'clamp(1.9rem, 4vw, 3rem)',
  fontWeight: 900,
  lineHeight: 1.08,
};

const heroText = {
  margin: '0.8rem 0 0',
  color: 'rgba(255,250,241,0.88)',
  lineHeight: 1.7,
  maxWidth: '64ch',
};

const inputStyle = {
  width: '100%',
  padding: '0.85rem 0.95rem',
  borderRadius: '14px',
  border: '1px solid rgba(39, 66, 54, 0.12)',
  background: '#fffdf8',
  color: '#20372c',
  fontSize: '0.97rem',
};

const metaRow = {
  display: 'flex',
  justifyContent: 'space-between',
  gap: '0.8rem',
  alignItems: 'center',
  flexWrap: 'wrap',
  marginBottom: '1rem',
};

const resultPill = {
  display: 'inline-flex',
  alignItems: 'center',
  padding: '0.45rem 0.8rem',
  borderRadius: '999px',
  background: '#eef7f1',
  color: '#1f6b55',
  fontWeight: 800,
};

const sourceText = {
  color: '#5c675f',
  fontSize: '0.92rem',
};

const cardStyle = {
  background: '#fffdf8',
  borderRadius: '20px',
  border: '1px solid rgba(39, 66, 54, 0.08)',
  boxShadow: '0 12px 30px rgba(18, 32, 24, 0.06)',
  padding: '1rem',
  display: 'flex',
  flexDirection: 'column',
  gap: '0.8rem',
};

const topBadges = {
  display: 'flex',
  flexWrap: 'wrap',
  gap: '0.5rem',
};

const verifiedBadge = {
  display: 'inline-flex',
  alignItems: 'center',
  padding: '0.32rem 0.64rem',
  borderRadius: '999px',
  background: '#e9f7ef',
  color: '#18794e',
  fontWeight: 800,
  fontSize: '0.76rem',
};

const categoryBadge = {
  display: 'inline-flex',
  alignItems: 'center',
  padding: '0.32rem 0.64rem',
  borderRadius: '999px',
  background: '#fff1e8',
  color: '#c25624',
  fontWeight: 800,
  fontSize: '0.76rem',
};

const cardTitle = {
  margin: 0,
  fontSize: '1.08rem',
  lineHeight: 1.35,
  color: '#1f3a2d',
  fontWeight: 900,
};

const codeText = {
  fontSize: '0.84rem',
  color: '#6b756d',
  fontWeight: 700,
};

const infoBlock = {
  display: 'grid',
  gap: '0.35rem',
  color: '#31453a',
  lineHeight: 1.55,
};

const addressText = {
  margin: 0,
  color: '#56625b',
  lineHeight: 1.65,
};

const dateGrid = {
  display: 'grid',
  gridTemplateColumns: '1fr 1fr',
  gap: '0.75rem',
};

const miniPanel = {
  background: '#f6f8f4',
  borderRadius: '14px',
  padding: '0.8rem',
  display: 'grid',
  gap: '0.28rem',
};

const miniLabel = {
  fontSize: '0.76rem',
  fontWeight: 800,
  color: '#708078',
  textTransform: 'uppercase',
  letterSpacing: '0.05em',
};

const miniValue = {
  fontSize: '0.92rem',
  fontWeight: 800,
  color: '#223b30',
};

const cardFooter = {
  display: 'flex',
  gap: '0.6rem',
  flexWrap: 'wrap',
  marginTop: '0.2rem',
};

const mapBtn = {
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
  padding: '0.78rem 0.95rem',
  borderRadius: '999px',
  background: '#d96b3b',
  color: '#fffaf1',
  textDecoration: 'none',
  fontWeight: 800,
};

const emptyState = {
  background: '#fffdf8',
  borderRadius: '22px',
  border: '1px solid rgba(39, 66, 54, 0.08)',
  padding: '2rem 1rem',
  textAlign: 'center',
};

const emptyIcon = {
  fontSize: '2rem',
  marginBottom: '0.8rem',
};

const emptyTitle = {
  margin: 0,
  color: '#1f3a2d',
  fontSize: '1.3rem',
  fontWeight: 900,
};

const emptyText = {
  margin: '0.6rem auto 0',
  maxWidth: '46ch',
  color: '#5b665f',
  lineHeight: 1.7,
};