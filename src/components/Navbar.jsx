import { Link, useLocation } from 'react-router-dom';

const supportPhone = '9142341588';

const navItems = [
  { to: '/', label: 'Home' },
  { to: '/report', label: 'Report SOS' },
  { to: '/map', label: 'Rescue Map' },
  { to: '/directory', label: 'Directory' },
  { to: '/user', label: 'Profile' },
  { to: '/contact', label: 'Contact' },
];

export function Navbar() {
  const location = useLocation();

  const isActive = (to) => {
    if (to === '/') return location.pathname === '/';
    return location.pathname.startsWith(to);
  };

  return (
    <header
      style={{
        position: 'sticky',
        top: 0,
        zIndex: 100,
        backdropFilter: 'blur(12px)',
        background: 'rgba(14, 45, 33, 0.92)',
        borderBottom: '1px solid rgba(255,255,255,0.08)',
        boxShadow: '0 8px 24px rgba(10, 28, 20, 0.12)',
      }}
    >
      <nav
        aria-label="Primary"
        style={{
          color: '#fffaf1',
        }}
      >
        <div
          className="container"
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '0.85rem',
            padding: '0.85rem 0',
          }}
        >
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: '0.75rem',
              flexWrap: 'wrap',
            }}
          >
            <Link
              to="/"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.7rem',
                textDecoration: 'none',
                color: '#fffaf1',
                minWidth: 0,
              }}
            >
              <div
                style={{
                  width: '42px',
                  height: '42px',
                  borderRadius: '12px',
                  background: 'rgba(255,255,255,0.08)',
                  display: 'grid',
                  placeItems: 'center',
                  fontSize: '1.25rem',
                  flexShrink: 0,
                }}
              >
                🐄
              </div>

              <div style={{ minWidth: 0 }}>
                <div
                  style={{
                    fontWeight: 900,
                    fontSize: '1rem',
                    lineHeight: 1.1,
                    letterSpacing: '0.01em',
                  }}
                >
                  JeevSahay
                </div>
                <div
                  style={{
                    fontSize: '0.75rem',
                    color: 'rgba(255,250,241,0.66)',
                    whiteSpace: 'nowrap',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    maxWidth: '180px',
                  }}
                >
                  Rescue • Shelter • Support
                </div>
              </div>
            </Link>

            <a href={`tel:${supportPhone}`} style={callBtn}>
              📞 Call
            </a>
          </div>

          <div
            style={{
              display: 'flex',
              gap: '0.65rem',
              overflowX: 'auto',
              paddingBottom: '0.15rem',
              scrollbarWidth: 'none',
              msOverflowStyle: 'none',
            }}
          >
            {navItems.map((item) => {
              const active = isActive(item.to);

              return (
                <Link
                  key={item.to}
                  to={item.to}
                  aria-current={active ? 'page' : undefined}
                  style={{
                    textDecoration: 'none',
                    color: active ? '#fffaf1' : 'rgba(255,250,241,0.82)',
                    background: active ? '#d96b3b' : 'rgba(255,255,255,0.08)',
                    border: active
                      ? '1px solid #d96b3b'
                      : '1px solid rgba(255,255,255,0.08)',
                    padding: '0.72rem 0.95rem',
                    borderRadius: '999px',
                    fontWeight: active ? 800 : 700,
                    fontSize: '0.9rem',
                    whiteSpace: 'nowrap',
                    flexShrink: 0,
                    boxShadow: active ? '0 8px 18px rgba(217,107,59,0.22)' : 'none',
                  }}
                >
                  {item.label}
                </Link>
              );
            })}
          </div>
        </div>
      </nav>
    </header>
  );
}

const callBtn = {
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
  textDecoration: 'none',
  color: '#fffaf1',
  background: '#d96b3b',
  border: '1px solid #d96b3b',
  borderRadius: '999px',
  padding: '0.72rem 1rem',
  fontWeight: 800,
  fontSize: '0.9rem',
  boxShadow: '0 8px 18px rgba(217,107,59,0.2)',
};