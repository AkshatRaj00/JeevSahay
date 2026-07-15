import React, { Suspense, lazy } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';

const HomePage = lazy(() =>
  import('./pages/Home').then((mod) => ({ default: mod.Home }))
);

const ContactPage = lazy(() =>
  import('./pages/Contact').then((mod) => ({ default: mod.Contact }))
);

const MapPage = lazy(() =>
  import('./pages/MapRadar').then((mod) => ({ default: mod.MapRadar }))
);

const ReportPage = lazy(() =>
  import('./pages/ReportSOS').then((mod) => ({ default: mod.ReportSOS }))
);

const UserPage = lazy(() =>
  import('./pages/UserProfile').then((mod) => ({ default: mod.UserProfile }))
);

const DirectoryPage = lazy(() =>
  import('./pages/RescueDirectory').then((mod) => ({ default: mod.RescueDirectory }))
);

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    try {
      console.error('JeevSahay Error:', error?.message || String(error));
      console.error('Component stack:', errorInfo?.componentStack || '');
    } catch {
      console.error('ErrorBoundary logging failed');
    }
  }

  render() {
    if (this.state.hasError) {
      return (
        <div
          style={{
            minHeight: '100vh',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: 'var(--bg-emerald-soft)',
            padding: '2rem',
          }}
        >
          <div
            style={{
              textAlign: 'center',
              padding: '2rem',
              backgroundColor: 'var(--bg-surface)',
              borderRadius: '1rem',
              boxShadow: '0 4px 24px rgba(0,0,0,0.1)',
              maxWidth: '500px',
            }}
          >
            <h2 style={{ fontSize: '1.5rem', marginBottom: '1rem', color: 'var(--text-primary)' }}>
              Something went wrong
            </h2>
            <p style={{ color: 'var(--text-muted)', marginBottom: '1.5rem' }}>
              The page encountered an error.
            </p>
            <button
              onClick={() => window.location.reload()}
              style={{
                padding: '0.75rem 1.5rem',
                backgroundColor: 'var(--accent-primary)',
                color: 'white',
                border: 'none',
                borderRadius: '0.5rem',
                fontWeight: '600',
                cursor: 'pointer',
              }}
            >
              Reload Page
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

function PageLoader() {
  return (
    <div className="container" style={{ padding: '3rem 0', textAlign: 'center' }}>
      <div
        style={{
          display: 'inline-block',
          padding: '1rem 2rem',
          borderRadius: '999px',
          border: '1px solid var(--border-primary)',
          backgroundColor: 'var(--bg-surface)',
          fontWeight: '600',
        }}
      >
        Loading JeevSahay...
      </div>
    </div>
  );
}

export default function App() {
  return (
    <ErrorBoundary>
      <BrowserRouter>
        <div
          style={{
            minHeight: '100vh',
            display: 'flex',
            flexDirection: 'column',
            backgroundColor: 'var(--bg-emerald-soft)',
          }}
        >
          <Navbar />

          <Suspense fallback={<PageLoader />}>
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/contact" element={<ContactPage />} />
              <Route path="/map" element={<MapPage />} />
              <Route path="/report" element={<ReportPage />} />
              <Route path="/user" element={<UserPage />} />
              <Route path="/directory" element={<DirectoryPage />} />
            </Routes>
          </Suspense>

          <Footer />
        </div>
      </BrowserRouter>
    </ErrorBoundary>
  );
}