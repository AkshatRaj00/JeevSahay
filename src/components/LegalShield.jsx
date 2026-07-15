export function LegalShield() {
  return (
    <section
      style={{
        backgroundColor: '#f9fafb',
        padding: '2.5rem 0',
        borderTop: '1px solid #e5e7eb',
      }}
    >
      <div className="container" style={{ maxWidth: '800px' }}>
        <h2
          style={{
            fontSize: '1.25rem',
            fontWeight: 800,
            color: 'var(--bg-emerald-deep)',
            marginBottom: '1rem',
          }}
        >
          ⚠️ Legal Disclaimer
        </h2>

        <div style={{ fontSize: '0.9rem', color: '#4b5563', lineHeight: 1.7 }}>
          <p style={{ marginBottom: '0.75rem' }}>
            JeevSahay is a community-driven platform that connects animal rescuers with NGOs,
            hospitals, and shelters across India. We do not operate any rescue services ourselves.
          </p>

          <p style={{ marginBottom: '0.75rem' }}>
            <strong style={{ color: '#374151' }}>No Liability:</strong> All SOS reports and map
            listings are user-generated. JeevSahay is not responsible for the accuracy of
            information, rescue outcomes, or any harm that may occur during rescue operations.
          </p>

          <p style={{ marginBottom: '0.75rem' }}>
            <strong style={{ color: '#374151' }}>User Responsibility:</strong> By using this
            platform, you agree to report only genuine cases. False or malicious reports may lead
            to permanent ban and legal action.
          </p>

          <p style={{ marginBottom: '0.75rem' }}>
            <strong style={{ color: '#374151' }}>Privacy:</strong> Personal data (rescue history,
            favourites) is stored locally on your device unless you explicitly login with Firebase
            Auth (future feature).
          </p>

          <p style={{ margin: 0 }}>
            For questions, contact:{' '}
            <a
              href="mailto:support@jeevsahay.org"
              style={{
                color: 'var(--brand-amber)',
                fontWeight: 600,
                textDecoration: 'none',
              }}
            >
              support@jeevsahay.org
            </a>
          </p>
        </div>
      </div>
    </section>
  );
}