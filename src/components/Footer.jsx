import { Link } from 'react-router-dom';
import { Phone, Mail, Heart, MapPin, ArrowUpRight, ShieldCheck } from 'lucide-react';

const supportPhone = '9142341588';
const supportEmail = 'akshatgyan2004@gmail.com';
const cowBg =
  'https://images.pexels.com/photos/422218/pexels-photo-422218.jpeg?auto=compress&cs=tinysrgb&w=1200';

export function Footer() {
  return (
    <footer className="js-footer">
      {/* Top Emergency CTA Strip */}
      <div className="js-footer-top-strip">
        <div className="container js-footer-strip-inner">
          <div className="js-footer-badge">
            <span className="js-badge-dot"></span>
            <span>🐄 JeevSahay Emergency Response Network</span>
          </div>
          
          <div className="js-footer-quick-actions">
            <a href={`tel:${supportPhone}`} className="js-btn-emergency">
              <Phone size={15} /> 24/7 Hotline
            </a>
            <a href={`mailto:${supportEmail}`} className="js-btn-ghost">
              <Mail size={15} /> Support Email
            </a>
          </div>
        </div>
      </div>

      {/* Main Footer Links & Info Grid */}
      <div className="container js-footer-main">
        <div className="js-footer-grid">
          
          {/* Brand Column */}
          <div className="js-footer-brand-col">
            <div className="js-footer-logo">
              Jeev<span>Sahay</span>
            </div>
            <p className="js-footer-tagline">
              Injured, abandoned, aur emergency animal rescue cases ke liye fast local support network.
            </p>
            <div className="js-footer-trust-chip">
              <ShieldCheck size={16} className="js-trust-icon" />
              <span>Verified Local NGO Base • Raipur & Pan-India</span>
            </div>
          </div>

          {/* Quick Links Column */}
          <div className="js-footer-col">
            <h4 className="js-footer-heading">Navigation</h4>
            <nav className="js-footer-nav">
              <Link to="/"><ArrowUpRight size={14} /> Home</Link>
              <Link to="/report"><ArrowUpRight size={14} /> Report SOS</Link>
              <Link to="/map"><ArrowUpRight size={14} /> Rescue Map</Link>
              <Link to="/directory"><ArrowUpRight size={14} /> AWBI Directory</Link>
            </nav>
          </div>

          {/* Support Column */}
          <div className="js-footer-col">
            <h4 className="js-footer-heading">User & Support</h4>
            <nav className="js-footer-nav">
              <Link to="/user">My Profile & Rescues</Link>
              <Link to="/contact">Partnership Inquiry</Link>
              <a href={`tel:${supportPhone}`}>Direct Call</a>
              <a href={`mailto:${supportEmail}`}>Helpdesk Email</a>
            </nav>
          </div>

          {/* Partners Column */}
          <div className="js-footer-col js-footer-partner-card">
            <div className="js-partner-inner">
              <Heart size={20} className="js-heart-icon" />
              <h4 className="js-footer-heading" style={{ margin: '0.4rem 0 0.2rem' }}>Are you an NGO?</h4>
              <p className="js-footer-subtext">
                Rescue teams & shelters: Join JeevSahay map for direct local case assignments.
              </p>
              <Link to="/contact" className="js-btn-partner">
                🤝 Partner Onboarding
              </Link>
            </div>
          </div>

        </div>
      </div>

      {/* Bottom Copyright Strip */}
      <div className="js-footer-bottom">
        <div className="container js-footer-bottom-inner">
          <p>© {new Date().getFullYear()} JeevSahay. Har Bezubaan Ki Awaaz.</p>
          <p className="js-footer-subline">Crafted with onepersonai care for animal welfare & rapid rescue dispatch.</p>
        </div>
      </div>

      {/* Embedded CSS for guaranteed styling without breaking global rules */}
      <style>{`
        .js-footer {
          margin-top: auto;
          position: relative;
          background: linear-gradient(180deg, rgba(8, 28, 19, 0.94) 0%, rgba(5, 18, 12, 0.98) 100%), 
                      url(${cowBg}) center/cover no-repeat;
          color: rgba(255, 250, 241, 0.88);
          border-top-left-radius: 24px;
          border-top-right-radius: 24px;
          overflow: hidden;
          box-shadow: 0 -10px 40px rgba(0,0,0,0.15);
        }

        .js-footer-top-strip {
          border-bottom: 1px solid rgba(255, 255, 255, 0.08);
          background: rgba(255, 255, 255, 0.03);
          backdrop-filter: blur(10px);
          padding: 0.9rem 0;
        }

        .js-footer-strip-inner {
          display: flex;
          align-items: center;
          justify-content: space-between;
          flex-wrap: wrap;
          gap: 1rem;
        }

        .js-footer-badge {
          display: inline-flex;
          align-items: center;
          gap: 0.6rem;
          padding: 0.45rem 0.9rem;
          border-radius: 999px;
          background: rgba(255, 255, 255, 0.08);
          border: 1px solid rgba(255, 255, 255, 0.12);
          color: #fff9f1;
          font-size: 0.82rem;
          font-weight: 800;
        }

        .js-badge-dot {
          width: 8px;
          height: 8px;
          border-radius: 50%;
          background: #10b981;
          box-shadow: 0 0 10px #10b981;
        }

        .js-footer-quick-actions {
          display: flex;
          align-items: center;
          gap: 0.75rem;
        }

        .js-btn-emergency {
          display: inline-flex;
          align-items: center;
          gap: 0.45rem;
          padding: 0.55rem 1.1rem;
          border-radius: 999px;
          background: #d96b3b;
          color: #ffffff;
          text-decoration: none;
          font-weight: 800;
          font-size: 0.85rem;
          box-shadow: 0 4px 14px rgba(217, 107, 59, 0.3);
          transition: transform 0.2s ease, background 0.2s ease;
        }

        .js-btn-emergency:hover {
          background: #c25624;
          transform: translateY(-2px);
        }

        .js-btn-ghost {
          display: inline-flex;
          align-items: center;
          gap: 0.45rem;
          padding: 0.55rem 1.1rem;
          border-radius: 999px;
          background: rgba(255,255,255,0.08);
          color: #fffaf1;
          text-decoration: none;
          font-weight: 700;
          font-size: 0.85rem;
          border: 1px solid rgba(255,255,255,0.14);
          transition: background 0.2s ease;
        }

        .js-btn-ghost:hover {
          background: rgba(255,255,255,0.16);
        }

        .js-footer-main {
          padding: 2.5rem 0 1.5rem;
        }

        .js-footer-grid {
          display: grid;
          grid-template-columns: 1.4fr 0.8fr 0.8fr 1.1fr;
          gap: 2rem;
        }

        .js-footer-logo {
          font-size: 1.6rem;
          font-weight: 900;
          color: #ffffff;
          letter-spacing: -0.02em;
        }

        .js-footer-logo span {
          color: #d96b3b;
        }

        .js-footer-tagline {
          margin: 0.75rem 0 1.2rem;
          color: rgba(255, 250, 241, 0.75);
          font-size: 0.92rem;
          line-height: 1.65;
          max-width: 32ch;
        }

        .js-footer-trust-chip {
          display: inline-flex;
          align-items: center;
          gap: 0.5rem;
          color: #34d399;
          font-size: 0.82rem;
          font-weight: 700;
          background: rgba(16, 185, 129, 0.08);
          padding: 0.5rem 0.8rem;
          border-radius: 12px;
          border: 1px solid rgba(16, 185, 129, 0.16);
        }

        .js-footer-heading {
          color: #ffffff;
          font-size: 0.95rem;
          font-weight: 900;
          text-transform: uppercase;
          letter-spacing: 0.06em;
          margin-bottom: 1.1rem;
        }

        .js-footer-nav {
          display: flex;
          flex-direction: column;
          gap: 0.65rem;
        }

        .js-footer-nav a {
          display: inline-flex;
          align-items: center;
          gap: 0.35rem;
          color: rgba(255, 250, 241, 0.72);
          text-decoration: none;
          font-size: 0.9rem;
          font-weight: 600;
          transition: color 0.2s ease, transform 0.2s ease;
        }

        .js-footer-nav a:hover {
          color: #ffffff;
          transform: translateX(3px);
        }

        .js-footer-partner-card {
          background: rgba(255, 255, 255, 0.05);
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 20px;
          padding: 1.2rem;
          backdrop-filter: blur(10px);
        }

        .js-heart-icon {
          color: #d96b3b;
        }

        .js-footer-subtext {
          font-size: 0.85rem;
          color: rgba(255, 250, 241, 0.7);
          line-height: 1.5;
          margin-bottom: 1rem;
        }

        .js-btn-partner {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          width: 100%;
          padding: 0.7rem;
          border-radius: 12px;
          background: #d96b3b;
          color: #fff;
          text-decoration: none;
          font-weight: 800;
          font-size: 0.88rem;
          transition: transform 0.2s ease;
        }

        .js-btn-partner:hover {
          transform: translateY(-2px);
        }

        .js-footer-bottom {
          border-top: 1px solid rgba(255, 255, 255, 0.08);
          padding: 1.25rem 0;
          background: rgba(0, 0, 0, 0.2);
          text-align: center;
        }

        .js-footer-bottom-inner {
          display: flex;
          flex-direction: column;
          gap: 0.3rem;
          align-items: center;
        }

        .js-footer-bottom p {
          margin: 0;
          font-size: 0.85rem;
          color: rgba(255, 250, 241, 0.7);
        }

        .js-footer-subline {
          font-size: 0.78rem !important;
          color: rgba(255, 250, 241, 0.48) !important;
        }

        /* Mobile and Tablet Responsiveness */
        @media (max-width: 960px) {
          .js-footer-grid {
            grid-template-columns: 1fr 1fr;
            gap: 1.8rem;
          }
          .js-footer-brand-col {
            grid-column: span 2;
          }
        }

        @media (max-width: 580px) {
          .js-footer-grid {
            grid-template-columns: 1fr;
          }
          .js-footer-brand-col {
            grid-column: span 1;
          }
          .js-footer-strip-inner {
            flex-direction: column;
            align-items: stretch;
          }
          .js-footer-quick-actions {
            flex-direction: column;
            width: 100%;
          }
          .js-btn-emergency, .js-btn-ghost {
            justify-content: center;
            width: 100%;
          }
        }
      `}</style>
    </footer>
  );
}