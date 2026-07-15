import { Link } from 'react-router-dom';

const supportPhone = '9142341588';
const supportEmail = 'akshatgyan2004@gmail.com';
const cowBg =
  'https://images.pexels.com/photos/422218/pexels-photo-422218.jpeg?auto=compress&cs=tinysrgb&w=1200';

export function Footer() {
  return (
    <footer
      style={{
        marginTop: 'auto',
        position: 'relative',
        background:
          `linear-gradient(rgba(14, 45, 33, 0.94), rgba(14, 45, 33, 0.97)), url(${cowBg}) center/cover no-repeat`,
        color: 'rgba(255, 250, 241, 0.84)',
        borderTopLeftRadius: '18px',
        borderTopRightRadius: '18px',
        overflow: 'hidden',
      }}
    >
      <div
        className="container"
        style={{
          padding: '1rem 0 0.75rem',
        }}
      >
        <div
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '0.75rem',
            paddingBottom: '0.9rem',
            borderBottom: '1px solid rgba(255,255,255,0.08)',
          }}
        >
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.5rem',
              padding: '0.42rem 0.75rem',
              borderRadius: '999px',
              background: 'rgba(255,255,255,0.08)',
              color: '#fff9f1',
              fontSize: '0.78rem',
              fontWeight: 800,
              maxWidth: '100%',
            }}
          >
            🐄 JeevSahay • rescue support
          </div>

          <a href={`tel:${supportPhone}`} style={topBtn}>
            📞 Call now
          </a>
        </div>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(170px, 1fr))',
            gap: '1rem',
            padding: '1rem 0',
          }}
        >
          <div>
            <h3 style={headingStyle}>JeevSahay</h3>
            <p style={textStyle}>
              Injured, abandoned, aur emergency animal cases ke liye fast local help connect karna hamara goal hai.
            </p>

            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                gap: '0.55rem',
                marginTop: '0.85rem',
              }}
            >
              <a href={`tel:${supportPhone}`} style={pillLink}>
                📞 {supportPhone}
              </a>
              <a href={`mailto:${supportEmail}`} style={pillLink}>
                📧 Email support
              </a>
            </div>
          </div>

          <div>
            <h3 style={headingStyle}>Quick links</h3>
            <nav
              aria-label="Footer quick links"
              style={{ display: 'grid', gap: '0.6rem' }}
            >
              <Link to="/" style={footerLink}>Home</Link>
              <Link to="/report" style={footerLink}>Report SOS</Link>
              <Link to="/map" style={footerLink}>Rescue Map</Link>
              <Link to="/contact" style={footerLink}>Contact</Link>
            </nav>
          </div>

          <div>
            <h3 style={headingStyle}>Support</h3>
            <div style={{ display: 'grid', gap: '0.6rem' }}>
              <a href={`tel:${supportPhone}`} style={footerLink}>Call support</a>
              <a href={`mailto:${supportEmail}`} style={footerLink}>Email support</a>
              <Link to="/user-profile" style={footerLink}>My profile</Link>
              <Link to="/map" style={footerLink}>Saved NGOs</Link>
            </div>
          </div>

          <div>
            <h3 style={headingStyle}>Partners</h3>
            <p style={textStyle}>
              NGO, shelter, hospital, ya rescue team ho? Contact karke onboarding aur listing karao.
            </p>

            <Link to="/contact" style={ctaBtn}>
              🤝 Register now
            </Link>
          </div>
        </div>

        <div
          style={{
            borderTop: '1px solid rgba(255,255,255,0.08)',
            paddingTop: '0.85rem',
            paddingBottom: '1rem',
            display: 'flex',
            flexDirection: 'column',
            gap: '0.45rem',
            textAlign: 'center',
          }}
        >
          <p
            style={{
              margin: 0,
              color: 'rgba(255,250,241,0.7)',
              fontSize: '0.84rem',
              lineHeight: 1.5,
            }}
          >
            © 2026 JeevSahay — har bezubaan ki awaaz.
          </p>

          <p
            style={{
              margin: 0,
              color: 'rgba(255,250,241,0.54)',
              fontSize: '0.8rem',
              lineHeight: 1.5,
            }}
          >
            Built for rescue speed, trust, and real support.
          </p>
        </div>
      </div>
    </footer>
  );
}

const headingStyle = {
  margin: '0 0 0.7rem',
  fontSize: '0.92rem',
  fontWeight: 900,
  color: '#fffaf1',
};

const textStyle = {
  margin: 0,
  color: 'rgba(255,250,241,0.76)',
  lineHeight: 1.6,
  fontSize: '0.88rem',
  maxWidth: '30ch',
};

const footerLink = {
  color: 'rgba(255,250,241,0.8)',
  textDecoration: 'none',
  fontWeight: 600,
  fontSize: '0.9rem',
  lineHeight: 1.45,
};

const pillLink = {
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
  width: 'fit-content',
  maxWidth: '100%',
  padding: '0.68rem 0.9rem',
  borderRadius: '999px',
  background: 'rgba(255,255,255,0.08)',
  color: '#fffaf1',
  textDecoration: 'none',
  border: '1px solid rgba(255,255,255,0.1)',
  fontWeight: 700,
  fontSize: '0.88rem',
};

const ctaBtn = {
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
  marginTop: '0.7rem',
  width: 'fit-content',
  padding: '0.75rem 1rem',
  borderRadius: '999px',
  background: '#d96b3b',
  color: '#fffaf1',
  textDecoration: 'none',
  fontWeight: 800,
  fontSize: '0.9rem',
  border: '1px solid #d96b3b',
};

const topBtn = {
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
  padding: '0.65rem 0.95rem',
  borderRadius: '999px',
  background: '#d96b3b',
  color: '#fffaf1',
  textDecoration: 'none',
  fontWeight: 800,
  fontSize: '0.86rem',
  border: '1px solid #d96b3b',
};