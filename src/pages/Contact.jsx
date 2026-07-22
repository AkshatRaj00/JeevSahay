import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';

const BANNER_PHOTO =
  'https://images.pexels.com/photos/1254140/pexels-photo-1254140.jpeg?auto=compress&cs=tinysrgb&w=1600';

const INQUIRY_TYPES = [
  'NGO Onboarding',
  'Hospital Partnership',
  'Volunteer Query',
  'Bug / Issue Report',
  'Emergency Support Contact Update',
  'Other',
];

const INITIAL_FORM = {
  name: '',
  email: '',
  phone: '',
  inquiryType: 'Other',
  message: '',
};

const PUBLIC_HELP_CONTACTS = [
  {
    id: 'vatika-raipur',
    name: 'Vatika Animal Sanctuary',
    type: 'Rescue • Shelter • Sanctuary',
    city: 'Raipur, Chhattisgarh',
    phone: '7225888800',
    note: 'Publicly listed support number (10am–8pm).',
  },
  {
    id: 'pfa-raipur-1',
    name: 'People For Animals - Raipur Unit',
    type: 'Animal welfare • Rescue support',
    city: 'Raipur, Chhattisgarh',
    phone: '9179079200',
    note: 'Publicly listed rescue contact.',
  },
  {
    id: 'pfa-raipur-2',
    name: 'People For Animals - Raipur Unit',
    type: 'Animal welfare • Rescue support',
    city: 'Raipur, Chhattisgarh',
    phone: '9179080200',
    note: 'Publicly listed rescue contact.',
  },
  {
    id: 'pfa-raipur-3',
    name: 'People For Animals - Raipur Unit',
    type: 'Office / support line',
    city: 'Raipur, Chhattisgarh',
    phone: '07714048262',
    note: 'Publicly listed office number.',
  },
];

function loadContactQueries() {
  try {
    return JSON.parse(window.localStorage.getItem('contactQueries') || '[]');
  } catch {
    return [];
  }
}

function saveContactQueries(items) {
  try {
    window.localStorage.setItem('contactQueries', JSON.stringify(items));
    return true;
  } catch {
    return false;
  }
}

function normalizePhone(value) {
  return value.replace(/[^\d+]/g, '').slice(0, 15);
}

export function Contact() {
  const [formData, setFormData] = useState(INITIAL_FORM);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState(null);

  const supportEmail = 'avishekray2006@gmail.com';
  const supportPhone = '9522752780';
  const whatsappLink = `https://wa.me/91${supportPhone}`;
  const mailtoLink = `mailto:${supportEmail}`;

  const contactStats = useMemo(
    () => [
      { label: 'Public support contacts', value: PUBLIC_HELP_CONTACTS.length },
      { label: 'Primary city', value: 'Raipur' },
      { label: 'Coverage focus', value: 'NGO • Hospital • Shelter • Rescue' },
    ],
    []
  );

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === 'phone' ? normalizePhone(value) : value,
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus(null);

    try {
      await new Promise((resolve) => setTimeout(resolve, 600));

      const queries = loadContactQueries();
      const updated = [
        {
          ...formData,
          id: Date.now().toString(),
          createdAt: Date.now(),
          status: 'local-draft',
        },
        ...queries,
      ].slice(0, 50);

      saveContactQueries(updated);
      setSubmitStatus('success');
      setFormData(INITIAL_FORM);
    } catch (error) {
      console.error('Contact form submit failed:', error);
      setSubmitStatus('error');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main
      style={{
        minHeight: '100vh',
        background: 'linear-gradient(180deg, #f8f4eb 0%, #fffdf8 42%, #eef6ef 100%)',
      }}
    >
      <section
        style={{
          position: 'relative',
          minHeight: '40vh',
          backgroundImage: `linear-gradient(180deg, rgba(17, 42, 28, 0.24), rgba(17, 42, 28, 0.76)), url(${BANNER_PHOTO})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          borderBottomLeftRadius: '26px',
          borderBottomRightRadius: '26px',
          overflow: 'hidden',
        }}
      >
        <div
          className="container"
          style={{
            minHeight: '40vh',
            display: 'flex',
            alignItems: 'center',
            paddingTop: '2rem',
            paddingBottom: '2rem',
          }}
        >
          <div
            style={{
              maxWidth: '760px',
              background: 'rgba(11, 28, 19, 0.42)',
              backdropFilter: 'blur(10px)',
              border: '1px solid rgba(255,255,255,0.16)',
              borderRadius: '22px',
              padding: '1.25rem',
              boxShadow: '0 20px 40px rgba(0,0,0,0.18)',
            }}
          >
            <div
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.45rem',
                padding: '0.42rem 0.75rem',
                borderRadius: '999px',
                background: 'rgba(255,255,255,0.12)',
                color: '#fff7ee',
                fontWeight: 800,
                fontSize: '0.82rem',
                marginBottom: '0.9rem',
              }}
            >
              🐄 Cow care • rescue partnerships • real contacts
            </div>

            <h1
              style={{
                color: '#fffaf1',
                fontSize: 'clamp(2rem, 5vw, 3.2rem)',
                fontWeight: 900,
                lineHeight: 1.05,
                margin: 0,
              }}
            >
              Contact JeevSahay
            </h1>

            <p
              style={{
                color: 'rgba(255,250,241,0.88)',
                fontSize: '1rem',
                lineHeight: 1.7,
                margin: '0.85rem 0 0',
                maxWidth: '64ch',
              }}
            >
              NGO onboarding, hospital partnerships, rescue support updates, ya platform issues —
              yahan se direct connect karo. Fake placeholders hata diye hain; page ab real contact
              info ke saath ready hai.
            </p>

            <div
              style={{
                display: 'flex',
                gap: '0.75rem',
                flexWrap: 'wrap',
                marginTop: '1rem',
              }}
            >
              <a href={mailtoLink} style={heroPrimaryBtn}>
                📧 Email now
              </a>
              <a
                href={whatsappLink}
                target="_blank"
                rel="noopener noreferrer"
                style={heroSecondaryBtn}
              >
                💬 WhatsApp
              </a>
            </div>
          </div>
        </div>
      </section>

      <section style={{ padding: '1rem 0 0.25rem' }}>
        <div
          className="container"
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
            gap: '1rem',
          }}
        >
          {contactStats.map((item) => (
            <div
              key={item.label}
              style={{
                background: '#fffdf8',
                borderRadius: '18px',
                border: '1px solid rgba(34, 62, 46, 0.08)',
                padding: '1rem',
                boxShadow: '0 12px 26px rgba(18, 32, 24, 0.06)',
              }}
            >
              <div
                style={{
                  fontSize: '0.78rem',
                  fontWeight: 800,
                  color: '#6a756d',
                  textTransform: 'uppercase',
                  letterSpacing: '0.08em',
                  marginBottom: '0.4rem',
                }}
              >
                {item.label}
              </div>
              <div
                style={{
                  fontSize: '1.2rem',
                  fontWeight: 900,
                  color: '#1f3a2d',
                }}
              >
                {item.value}
              </div>
            </div>
          ))}
        </div>
      </section>

      <section style={{ padding: '1.25rem 0 2rem' }}>
        <div
          className="container"
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
            gap: '1.25rem',
          }}
        >
          <div
            style={{
              background: '#fffdf8',
              borderRadius: '22px',
              border: '1px solid rgba(34, 62, 46, 0.08)',
              boxShadow: '0 14px 30px rgba(18, 32, 24, 0.06)',
              padding: '1.2rem',
            }}
          >
            <div style={{ marginBottom: '1rem' }}>
              <h2
                style={{
                  margin: 0,
                  fontSize: '1.55rem',
                  fontWeight: 900,
                  color: '#1f3a2d',
                }}
              >
                Send inquiry
              </h2>
              <p
                style={{
                  margin: '0.45rem 0 0',
                  color: '#5b665f',
                  lineHeight: 1.6,
                }}
              >
                Jab tak backend/live CRM connect nahi hota, ye form inquiry ko is device par
                locally save karega. Real urgent contact ke liye direct phone, email, ya WhatsApp use karo.
              </p>
            </div>

            {submitStatus === 'success' && (
              <div style={successAlert}>
                ✅ Inquiry saved on this device. For urgent response, call or WhatsApp directly.
              </div>
            )}

            {submitStatus === 'error' && (
              <div style={errorAlert}>
                ❌ Form save nahi ho paaya. Direct phone ya email use karo.
              </div>
            )}

            <form onSubmit={handleSubmit} style={{ display: 'grid', gap: '1rem' }}>
              <div style={fieldGrid}>
                <div>
                  <label htmlFor="name" style={labelStyle}>Your Name</label>
                  <input
                    id="name"
                    name="name"
                    type="text"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    placeholder="E.g., Rahul Sharma"
                    style={inputStyle}
                  />
                </div>

                <div>
                  <label htmlFor="phone" style={labelStyle}>Phone</label>
                  <input
                    id="phone"
                    name="phone"
                    type="tel"
                    value={formData.phone}
                    onChange={handleChange}
                    required
                    placeholder="+91 9XXXXXXXXX"
                    style={inputStyle}
                  />
                </div>
              </div>

              <div style={fieldGrid}>
                <div>
                  <label htmlFor="email" style={labelStyle}>Email</label>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    placeholder="you@example.com"
                    style={inputStyle}
                  />
                </div>

                <div>
                  <label htmlFor="inquiryType" style={labelStyle}>Inquiry Type</label>
                  <select
                    id="inquiryType"
                    name="inquiryType"
                    value={formData.inquiryType}
                    onChange={handleChange}
                    required
                    style={inputStyle}
                  >
                    {INQUIRY_TYPES.map((type) => (
                      <option key={type} value={type}>
                        {type}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label htmlFor="message" style={labelStyle}>Your Message</label>
                <textarea
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  required
                  rows="6"
                  placeholder="NGO details, issue report, rescue support update, ya partnership request likho..."
                  style={{ ...inputStyle, resize: 'vertical', fontFamily: 'inherit' }}
                />
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                style={{
                  ...submitBtn,
                  opacity: isSubmitting ? 0.72 : 1,
                  cursor: isSubmitting ? 'not-allowed' : 'pointer',
                }}
              >
                {isSubmitting ? 'Saving inquiry...' : '📬 Save inquiry'}
              </button>
            </form>
          </div>

          <div
            style={{
              display: 'grid',
              gap: '1rem',
              alignContent: 'start',
            }}
          >
            <div style={sideCard}>
              <div style={sideIcon}>📞</div>
              <h3 style={sideTitle}>Phone</h3>
              <a href={`tel:${supportPhone}`} style={sideLink}>
                {supportPhone}
              </a>
              <p style={sideText}>Primary direct support contact.</p>
            </div>

            <div style={sideCard}>
              <div style={sideIcon}>📧</div>
              <h3 style={sideTitle}>Email</h3>
              <a href={mailtoLink} style={sideLink}>
                {supportEmail}
              </a>
              <p style={sideText}>Use this for onboarding, support, or updates.</p>
            </div>

            <div style={sideCard}>
              <div style={sideIcon}>📍</div>
              <h3 style={sideTitle}>Address</h3>
              <p style={sideTextStrong}>Raipur, Chhattisgarh, India</p>
              <p style={sideText}>Base contact location for this project.</p>
            </div>
          </div>
        </div>
      </section>

      <section style={{ padding: '0 0 2rem' }}>
        <div className="container">
          <div
            style={{
              background: '#fffdf8',
              borderRadius: '22px',
              border: '1px solid rgba(34, 62, 46, 0.08)',
              boxShadow: '0 14px 30px rgba(18, 32, 24, 0.06)',
              padding: '1.25rem',
            }}
          >
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                gap: '1rem',
                alignItems: 'end',
                flexWrap: 'wrap',
                marginBottom: '1rem',
              }}
            >
              <div>
                <h2
                  style={{
                    margin: 0,
                    fontSize: '1.5rem',
                    fontWeight: 900,
                    color: '#1f3a2d',
                  }}
                >
                  Public rescue directory preview
                </h2>
                <p
                  style={{
                    margin: '0.45rem 0 0',
                    color: '#5b665f',
                    lineHeight: 1.6,
                  }}
                >
                  Ye sample list publicly listed Raipur-area animal rescue contacts se bani hai.
                  Final production ke liye har number manually verify karna zaroori hai.
                </p>
              </div>

              <Link to="/map" style={miniActionBtn}>
                📍 Open rescue map
              </Link>
            </div>

            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
                gap: '1rem',
              }}
            >
              {PUBLIC_HELP_CONTACTS.map((item) => (
                <article
                  key={item.id}
                  style={{
                    background: '#fff',
                    borderRadius: '18px',
                    border: '1px solid rgba(34, 62, 46, 0.08)',
                    padding: '1rem',
                    boxShadow: '0 10px 22px rgba(18, 32, 24, 0.05)',
                  }}
                >
                  <div
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      padding: '0.3rem 0.55rem',
                      borderRadius: '999px',
                      background: '#eef7f1',
                      color: '#1f6b55',
                      fontSize: '0.76rem',
                      fontWeight: 800,
                      marginBottom: '0.7rem',
                    }}
                  >
                    🐾 Publicly listed contact
                  </div>

                  <h3
                    style={{
                      margin: 0,
                      fontSize: '1.05rem',
                      fontWeight: 900,
                      color: '#1f3a2d',
                    }}
                  >
                    {item.name}
                  </h3>

                  <p style={cardMeta}>{item.type}</p>
                  <p style={cardMeta}>{item.city}</p>
                  <p style={cardNote}>{item.note}</p>

                  <div style={{ display: 'flex', gap: '0.6rem', flexWrap: 'wrap', marginTop: '0.8rem' }}>
                    <a href={`tel:${item.phone}`} style={callBtn}>
                      📞 {item.phone}
                    </a>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section
        style={{
          background: 'linear-gradient(135deg, #154734 0%, #1f6b55 100%)',
          color: '#fffaf1',
          padding: '3rem 0',
          textAlign: 'center',
          borderTopLeftRadius: '26px',
          borderTopRightRadius: '26px',
        }}
      >
        <div className="container" style={{ maxWidth: '760px' }}>
          <div
            style={{
              width: '74px',
              height: '74px',
              margin: '0 auto 1rem',
              borderRadius: '999px',
              background: 'rgba(255,255,255,0.12)',
              display: 'grid',
              placeItems: 'center',
              fontSize: '2rem',
            }}
          >
            🐄
          </div>

          <h2
            style={{
              fontSize: '1.6rem',
              fontWeight: 900,
              margin: 0,
            }}
          >
            NGO, shelter, hospital, ya rescue team ho?
          </h2>

          <p
            style={{
              color: 'rgba(255,250,241,0.86)',
              fontSize: '1rem',
              margin: '0.85rem auto 1.4rem',
              maxWidth: '62ch',
              lineHeight: 1.7,
            }}
          >
            JeevSahay map me listing chahiye to direct contact karo. Pehle verified onboarding,
            then map listing, then district-wise availability — isi flow me jana chahiye.
          </p>

          <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'center', flexWrap: 'wrap' }}>
            <a href={`tel:${supportPhone}`} style={heroPrimaryBtn}>
              📞 Call now
            </a>
            <a href={mailtoLink} style={heroSecondaryBtn}>
              📧 Email for onboarding
            </a>
          </div>
        </div>
      </section>
    </main>
  );
}

const heroPrimaryBtn = {
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

const heroSecondaryBtn = {
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

const sideCard = {
  background: '#fffdf8',
  borderRadius: '18px',
  border: '1px solid rgba(34, 62, 46, 0.08)',
  boxShadow: '0 12px 26px rgba(18, 32, 24, 0.06)',
  padding: '1rem',
};

const sideIcon = {
  width: '52px',
  height: '52px',
  borderRadius: '999px',
  background: '#eef7f1',
  color: '#1f6b55',
  display: 'grid',
  placeItems: 'center',
  fontSize: '1.35rem',
  marginBottom: '0.75rem',
};

const sideTitle = {
  margin: 0,
  fontSize: '1.05rem',
  fontWeight: 900,
  color: '#1f3a2d',
};

const sideLink = {
  display: 'inline-block',
  marginTop: '0.45rem',
  color: '#d96b3b',
  textDecoration: 'none',
  fontWeight: 800,
  wordBreak: 'break-word',
};

const sideText = {
  margin: '0.45rem 0 0',
  color: '#5b665f',
  lineHeight: 1.55,
};

const sideTextStrong = {
  margin: '0.45rem 0 0',
  color: '#233d30',
  lineHeight: 1.55,
  fontWeight: 800,
};

const successAlert = {
  background: '#177245',
  color: '#fff',
  padding: '0.95rem 1rem',
  borderRadius: '14px',
  marginBottom: '1rem',
  fontWeight: 700,
};

const errorAlert = {
  background: '#b42318',
  color: '#fff',
  padding: '0.95rem 1rem',
  borderRadius: '14px',
  marginBottom: '1rem',
  fontWeight: 700,
};

const fieldGrid = {
  display: 'grid',
  gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
  gap: '1rem',
};

const labelStyle = {
  display: 'block',
  fontWeight: 800,
  marginBottom: '0.5rem',
  color: '#32463b',
};

const inputStyle = {
  width: '100%',
  padding: '0.82rem 0.9rem',
  borderRadius: '12px',
  border: '1px solid rgba(50, 70, 59, 0.16)',
  fontSize: '1rem',
  backgroundColor: '#fff',
  color: '#1f2e25',
};

const submitBtn = {
  width: '100%',
  padding: '1rem',
  fontSize: '1rem',
  fontWeight: 900,
  borderRadius: '14px',
  border: 'none',
  background: '#d96b3b',
  color: '#fffaf1',
};

const miniActionBtn = {
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
  padding: '0.78rem 1rem',
  borderRadius: '999px',
  background: '#eef7f1',
  color: '#1f6b55',
  textDecoration: 'none',
  border: '1px solid rgba(31, 107, 85, 0.12)',
  fontWeight: 800,
};

const cardMeta = {
  margin: '0.35rem 0 0',
  color: '#5b665f',
  lineHeight: 1.5,
};

const cardNote = {
  margin: '0.45rem 0 0',
  color: '#6b756d',
  lineHeight: 1.55,
  fontSize: '0.92rem',
};

const callBtn = {
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
  padding: '0.72rem 0.95rem',
  borderRadius: '999px',
  background: '#d96b3b',
  color: '#fff',
  textDecoration: 'none',
  fontWeight: 800,
};