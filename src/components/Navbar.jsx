import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Phone, Menu, X, ShieldAlert, Heart, MapPin, BookOpen, User, Mail } from 'lucide-react';

const supportPhone = '9142341588';

const navItems = [
  { to: '/', label: 'Home', icon: Heart },
  { to: '/report', label: 'Report SOS', icon: ShieldAlert },
  { to: '/map', label: 'Rescue Map', icon: MapPin },
  { to: '/directory', label: 'Directory', icon: BookOpen },
  { to: '/user', label: 'Profile', icon: User },
  { to: '/contact', label: 'Contact', icon: Mail },
];

export function Navbar() {
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Route change hone par mobile drawer auto-close ho jayega
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location.pathname]);

  const isActive = (to) => {
    if (to === '/') return location.pathname === '/';
    return location.pathname.startsWith(to);
  };

  return (
    <header className="js-navbar-header">
      <nav aria-label="Primary" className="js-nav-wrap">
        <div className="container js-nav-container">
          
          {/* Brand Logo & Tagline */}
          <Link to="/" className="js-brand-link">
            <div className="js-logo-badge">
              🐄
            </div>
            <div className="js-brand-text">
              <span className="js-brand-title">
                Jeev<span>Sahay</span>
              </span>
              <span className="js-brand-subtitle">
                Rescue • Shelter • Care
              </span>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <div className="js-desktop-nav">
            {navItems.map((item) => {
              const active = isActive(item.to);
              const Icon = item.icon;

              return (
                <Link
                  key={item.to}
                  to={item.to}
                  className={`js-nav-pill ${active ? 'is-active' : ''}`}
                >
                  <Icon size={16} className="js-nav-icon" />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </div>

          {/* Right Action Area */}
          <div className="js-nav-actions">
            <a href={`tel:${supportPhone}`} className="js-call-btn">
              <span className="js-pulse-dot"></span>
              <Phone size={15} />
              <span className="js-call-text">24/7 Call</span>
            </a>

            {/* Mobile Menu Toggle Button */}
            <button
              type="button"
              className="js-mobile-toggle"
              onClick={() => setIsMobileMenuOpen((prev) => !prev)}
              aria-label="Toggle Navigation Menu"
            >
              {isMobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
            </button>
          </div>

        </div>

        {/* Mobile Slide-down Navigation Drawer */}
        {isMobileMenuOpen && (
          <div className="js-mobile-drawer">
            <div className="container js-mobile-drawer-inner">
              {navItems.map((item) => {
                const active = isActive(item.to);
                const Icon = item.icon;

                return (
                  <Link
                    key={item.to}
                    to={item.to}
                    className={`js-mobile-nav-item ${active ? 'is-active' : ''}`}
                  >
                    <Icon size={18} />
                    <span>{item.label}</span>
                  </Link>
                );
              })}
            </div>
          </div>
        )}
      </nav>

      {/* Complete Responsive Navbar CSS + Keyframe Animations */}
      <style>{`
        .js-navbar-header {
          position: sticky;
          top: 0;
          z-index: 1000;
          background: rgba(8, 28, 19, 0.88);
          backdrop-filter: blur(16px);
          -webkit-backdrop-filter: blur(16px);
          border-bottom: 1px solid rgba(255, 255, 255, 0.1);
          box-shadow: 0 10px 30px rgba(0, 0, 0, 0.18);
          transition: all 0.3s ease;
        }

        .js-nav-wrap {
          width: 100%;
        }

        .js-nav-container {
          display: flex;
          align-items: center;
          justify-content: space-between;
          height: 72px;
          gap: 1rem;
        }

        /* Logo Styling */
        .js-brand-link {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          text-decoration: none;
          color: #ffffff;
        }

        .js-logo-badge {
          width: 42px;
          height: 42px;
          border-radius: 14px;
          background: rgba(255, 255, 255, 0.08);
          border: 1px solid rgba(255, 255, 255, 0.14);
          display: grid;
          place-items: center;
          font-size: 1.35rem;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.12);
          transition: transform 0.25s ease;
        }

        .js-brand-link:hover .js-logo-badge {
          transform: scale(1.06) rotate(-4deg);
        }

        .js-brand-text {
          display: flex;
          flex-direction: column;
        }

        .js-brand-title {
          font-weight: 900;
          font-size: 1.15rem;
          line-height: 1.1;
          color: #ffffff;
          letter-spacing: -0.01em;
        }

        .js-brand-title span {
          color: #d96b3b;
        }

        .js-brand-subtitle {
          font-size: 0.73rem;
          color: rgba(255, 250, 241, 0.65);
          font-weight: 600;
          margin-top: 0.15rem;
        }

        /* Desktop Nav Items */
        .js-desktop-nav {
          display: flex;
          align-items: center;
          gap: 0.4rem;
          background: rgba(255, 255, 255, 0.04);
          padding: 0.35rem;
          border-radius: 999px;
          border: 1px solid rgba(255, 255, 255, 0.08);
        }

        .js-nav-pill {
          display: inline-flex;
          align-items: center;
          gap: 0.45rem;
          text-decoration: none;
          color: rgba(255, 250, 241, 0.78);
          padding: 0.55rem 0.95rem;
          border-radius: 999px;
          font-weight: 700;
          font-size: 0.88rem;
          transition: all 0.22s cubic-bezier(0.4, 0, 0.2, 1);
        }

        .js-nav-pill:hover {
          color: #ffffff;
          background: rgba(255, 255, 255, 0.08);
          transform: translateY(-1px);
        }

        .js-nav-pill.is-active {
          background: #d96b3b;
          color: #ffffff;
          box-shadow: 0 6px 20px rgba(217, 107, 59, 0.32);
        }

        .js-nav-icon {
          opacity: 0.85;
        }

        .js-nav-pill.is-active .js-nav-icon {
          opacity: 1;
        }

        /* Actions & Emergency Button */
        .js-nav-actions {
          display: flex;
          align-items: center;
          gap: 0.75rem;
        }

        .js-call-btn {
          position: relative;
          display: inline-flex;
          align-items: center;
          gap: 0.5rem;
          text-decoration: none;
          color: #ffffff;
          background: linear-gradient(135deg, #d96b3b 0%, #c25624 100%);
          border: 1px solid rgba(255, 255, 255, 0.2);
          border-radius: 999px;
          padding: 0.62rem 1.1rem;
          font-weight: 800;
          font-size: 0.86rem;
          box-shadow: 0 6px 18px rgba(217, 107, 59, 0.28);
          transition: all 0.2s ease;
          overflow: hidden;
        }

        .js-call-btn:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 24px rgba(217, 107, 59, 0.4);
        }

        .js-pulse-dot {
          width: 8px;
          height: 8px;
          border-radius: 50%;
          background: #10b981;
          box-shadow: 0 0 0 rgba(16, 185, 129, 0.7);
          animation: jsPulse 1.8s infinite;
        }

        @keyframes jsPulse {
          0% {
            transform: scale(0.95);
            box-shadow: 0 0 0 0 rgba(16, 185, 129, 0.7);
          }
          70% {
            transform: scale(1);
            box-shadow: 0 0 0 8px rgba(16, 185, 129, 0);
          }
          100% {
            transform: scale(0.95);
            box-shadow: 0 0 0 0 rgba(16, 185, 129, 0);
          }
        }

        /* Mobile Menu Button */
        .js-mobile-toggle {
          display: none;
          align-items: center;
          justify-content: center;
          width: 40px;
          height: 40px;
          border-radius: 12px;
          background: rgba(255, 255, 255, 0.08);
          border: 1px solid rgba(255, 255, 255, 0.12);
          color: #ffffff;
          cursor: pointer;
          transition: background 0.2s ease;
        }

        .js-mobile-toggle:hover {
          background: rgba(255, 255, 255, 0.15);
        }

        /* Mobile Drawer Drawer */
        .js-mobile-drawer {
          background: rgba(6, 22, 15, 0.96);
          backdrop-filter: blur(20px);
          border-top: 1px solid rgba(255, 255, 255, 0.08);
          border-bottom: 1px solid rgba(255, 255, 255, 0.08);
          animation: jsSlideDown 0.25s ease-out;
        }

        @keyframes jsSlideDown {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .js-mobile-drawer-inner {
          display: grid;
          gap: 0.5rem;
          padding: 1rem 1.25rem 1.25rem;
        }

        .js-mobile-nav-item {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          text-decoration: none;
          color: rgba(255, 250, 241, 0.82);
          padding: 0.8rem 1rem;
          border-radius: 14px;
          font-weight: 700;
          font-size: 0.95rem;
          background: rgba(255, 255, 255, 0.04);
          border: 1px solid rgba(255, 255, 255, 0.06);
          transition: all 0.2s ease;
        }

        .js-mobile-nav-item.is-active {
          background: #d96b3b;
          color: #ffffff;
          border-color: #d96b3b;
          font-weight: 800;
        }

        /* Media Queries for Screen Adaptation */
        @media (max-width: 900px) {
          .js-desktop-nav {
            display: none;
          }

          .js-mobile-toggle {
            display: flex;
          }
        }

        @media (max-width: 480px) {
          .js-brand-subtitle {
            display: none;
          }
          
          .js-call-text {
            display: none;
          }

          .js-call-btn {
            padding: 0.6rem 0.8rem;
          }
        }
      `}</style>
    </header>
  );
}