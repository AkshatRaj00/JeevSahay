import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { collection, getCountFromServer } from 'firebase/firestore';
import {
  ArrowRight,
  Building2,
  HeartHandshake,
  MapPinned,
  PhoneCall,
  ShieldCheck,
  PawPrint,
  ChevronDown,
} from 'lucide-react';
import { db } from '../firebaseConfig';

const HERO_VIDEO_URL =
  'https://player.vimeo.com/external/368763065.sd.mp4?s=3a3e92ffa44b26d85e5855b36d34c2de8c72c5bf&profile_id=164&oauth2_token_id=57447761';

const HERO_IMAGE_URL =
  'https://pplx-res.cloudinary.com/image/upload/pplx_search_images/e734979aafdb29e5d4193885f640631133f11fc8.jpg';

const GALLERY = [
  {
    src: 'https://pplx-res.cloudinary.com/image/upload/pplx_search_images/e78030c4aad2f2ca7c12cfb3985a816c3adbd0dc.jpg',
    alt: 'Veterinarian holding a dog in clinic',
  },
  {
    src: 'https://pplx-res.cloudinary.com/image/upload/pplx_search_images/e734979aafdb29e5d4193885f640631133f11fc8.jpg',
    alt: 'Woman hugging a rescued dog',
  },
  {
    src: 'https://pplx-res.cloudinary.com/image/upload/pplx_search_images/5053949b03a656cda67c4293ebac7c984b66355d.jpg',
    alt: 'Woman sitting beside a large rescue dog outdoors',
  },
  {
    src: 'https://pplx-res.cloudinary.com/image/upload/pplx_search_images/ed69db4a24e870bda7c8742392a5ba22aac82b8a.jpg',
    alt: 'Veterinarian with a French Bulldog',
  },
  {
    src: 'https://pplx-res.cloudinary.com/image/upload/pplx_search_images/37e3f23c2fdc3ba086453ef17ff680df4eccb057.jpg',
    alt: 'Vet examining a dog in clinic',
  },
  {
    src: 'https://pplx-res.cloudinary.com/image/upload/pplx_search_images/7fda33c27c2873995a39ee5d552754346ec69a22.jpg',
    alt: 'Dog rescue scene with officer and dog',
  },
  {
    src: 'https://pplx-res.cloudinary.com/image/upload/pplx_search_images/9ccfb15786b401a18b86d41ca4f7f920cd2a67ff.jpg',
    alt: 'Adoption campaign poster with rescue dog',
  },
  {
    src: 'https://pplx-res.cloudinary.com/image/upload/pplx_search_images/244b0271d61fa9d87d1d8d3db3d70bebf3a1a8bd.jpg',
    alt: 'Superhero adoption poster with dog',
  },
  {
    src: 'https://pplx-res.cloudinary.com/image/upload/pplx_search_images/5053949b03a656cda67c4293ebac7c984b66355d.jpg',
    alt: 'Rescue dog with volunteer outdoors',
  },
  {
    src: 'https://pplx-res.cloudinary.com/image/upload/pplx_search_images/7fda33c27c2873995a39ee5d552754346ec69a22.jpg',
    alt: 'Dog rescue moment with handler',
  },
];

const INITIAL_STATS = {
  rescueCenters: '—',
  activeRescues: '—',
  resolved: '—',
};

const features = [
  {
    icon: MapPinned,
    title: 'Find nearby help',
    text: 'Locate verified shelters, NGOs, and veterinary support around you.',
  },
  {
    icon: HeartHandshake,
    title: 'Coordinate rescues',
    text: 'Connect volunteers and responders so animals get help faster.',
  },
  {
    icon: ShieldCheck,
    title: 'Track outcomes',
    text: 'Monitor rescue cases and keep a clear record from report to recovery.',
  },
];

function StatCard({ label, value, icon: Icon }) {
  return (
    <div className="home-stat-card">
      <Icon size={22} className="home-stat-icon" />
      <div className="home-stat-value">{value}</div>
      <div className="home-stat-label">{label}</div>
    </div>
  );
}

function FeatureCard({ icon: Icon, title, text }) {
  return (
    <article className="home-feature-card">
      <Icon size={24} className="home-feature-icon" />
      <h3>{title}</h3>
      <p>{text}</p>
    </article>
  );
}

export function Home() {
  const [stats, setStats] = useState(INITIAL_STATS);
  const gallery = useMemo(() => GALLERY, []);

  useEffect(() => {
    let alive = true;

    (async () => {
      try {
        const [centersSnap, activeSnap, resolvedSnap] = await Promise.all([
          getCountFromServer(collection(db, 'rescueCenters')),
          getCountFromServer(collection(db, 'activeRescues')),
          getCountFromServer(collection(db, 'archivedRescues')),
        ]);

        if (!alive) return;

        setStats({
          rescueCenters: centersSnap.data().count,
          activeRescues: activeSnap.data().count,
          resolved: resolvedSnap.data().count,
        });
      } catch (error) {
        console.error('Stats load failed:', error?.message || error);
        if (alive) setStats(INITIAL_STATS);
      }
    })();

    return () => {
      alive = false;
    };
  }, []);

  return (
    <main className="home-page">
      <section className="home-hero">
        <div
          className="home-hero-image"
          style={{ backgroundImage: `url(${HERO_IMAGE_URL})` }}
        />

        <video autoPlay muted loop playsInline preload="metadata" className="home-hero-video">
          <source src={HERO_VIDEO_URL} type="video/mp4" />
        </video>

        <div className="home-hero-overlay" />
        <div className="home-hero-wash" />

        <div className="container home-hero-grid">
          <div className="home-hero-copy">
            <div className="home-kicker">
              <PawPrint size={14} /> India’s Animal Rescue Network
            </div>

            <h1>Reach Your Hand To Welfare Abandoned Animals Out There</h1>

            <p>
              Report injured animals, locate rescue support, and connect people who can actually
              respond. One platform for rescue, care, and coordination.
            </p>

            <div className="home-hero-actions">
              <Link to="/report" className="home-btn home-btn-primary">
                Report SOS <ArrowRight size={18} />
              </Link>

              <Link to="/map" className="home-btn home-btn-secondary">
                Find Nearby Help <MapPinned size={18} />
              </Link>
            </div>

            <div className="home-mini-row">
              <span>
                <PhoneCall size={16} /> Quick response workflow
              </span>
              <span>
                <ChevronDown size={16} /> Scroll for more
              </span>
            </div>
          </div>

          <div className="home-hero-panel">
            <StatCard icon={Building2} label="Rescue Centers Listed" value={stats.rescueCenters} />
            <StatCard icon={HeartHandshake} label="Active SOS Reports" value={stats.activeRescues} />
            <StatCard icon={ShieldCheck} label="Cases Resolved" value={stats.resolved} />

            <div className="home-side-card">
              <PhoneCall size={22} className="home-side-icon" />
              <h3>Fast response matters.</h3>
              <p>Keep rescue reporting simple, visible, and actionable.</p>
              <Link to="/contact" className="home-side-link">
                Partner with us <ArrowRight size={16} />
              </Link>
            </div>
          </div>
        </div>

        <div className="container home-floating-band">
          <div className="home-floating-card">
            <div>
              <span className="home-floating-label">Emergency support</span>
              <strong>Need urgent rescue? Start with one clear report.</strong>
            </div>
            <Link to="/report" className="home-floating-action">
              Create SOS
            </Link>
          </div>
        </div>
      </section>

      <section className="home-impact-strip">
        <div className="container home-impact-grid">
          <div className="home-impact-item">
            <span>01</span>
            <strong>Report fast</strong>
            <p>Share the animal’s location and condition in one clean flow.</p>
          </div>

          <div className="home-impact-item">
            <span>02</span>
            <strong>Connect right</strong>
            <p>Reach trusted responders, shelters, and volunteer teams.</p>
          </div>

          <div className="home-impact-item">
            <span>03</span>
            <strong>Track outcome</strong>
            <p>Follow the rescue until the case is safely resolved.</p>
          </div>
        </div>
      </section>

      <section className="home-gallery-section">
        <div className="container home-content-wrap">
          <div className="home-section-head">
            <p className="home-eyebrow">Rescue moments</p>
            <h2>Animals, care, and recovery.</h2>
          </div>

          <div className="home-gallery-grid">
            {gallery.map((item, idx) => (
              <figure
                key={item.src + idx}
                className={`home-gallery-item home-gallery-${(idx % 5) + 1}`}
              >
                <img src={item.src} alt={item.alt} loading="lazy" />
              </figure>
            ))}
          </div>
        </div>
      </section>

      <section id="services" className="home-section home-section-soft">
        <div className="container home-content-wrap">
          <div className="home-section-head">
            <p className="home-eyebrow">What JeevSahay does</p>
            <h2>A trusted rescue flow from report to response.</h2>
          </div>

          <div className="home-feature-grid">
            {features.map((item) => (
              <FeatureCard key={item.title} icon={item.icon} title={item.title} text={item.text} />
            ))}
          </div>
        </div>
      </section>

      <section className="home-section home-section-cta">
        <div className="container home-cta-inner">
          <div className="home-cta-copy">
            <p className="home-eyebrow">How to act now</p>
            <h2>Take the next step in seconds.</h2>
            <p>
              Submit a rescue report, locate help nearby, or contact the network team for
              partnerships.
            </p>
          </div>

          <div className="home-cta-actions">
            <Link to="/report" className="home-btn home-btn-primary">
              Report SOS <ArrowRight size={18} />
            </Link>

            <Link to="/map" className="home-btn home-btn-dark">
              Find Nearby Help <MapPinned size={18} />
            </Link>

            <Link to="/contact" className="home-btn home-btn-ghost">
              Contact Us <HeartHandshake size={18} />
            </Link>
          </div>
        </div>
      </section>

      <style>{`
        .home-page{overflow:hidden}
        .home-hero{position:relative;min-height:92vh;background:#0d1117;color:#fff;overflow:hidden}
        .home-hero-image{position:absolute;inset:0;background-size:cover;background-position:center right;background-repeat:no-repeat;transform:scale(1.04);filter:saturate(1.02) contrast(1.03)}
        .home-hero-video{position:absolute;inset:0;width:100%;height:100%;object-fit:cover;opacity:.2;mix-blend-mode:screen}
        .home-hero-overlay{position:absolute;inset:0;background:linear-gradient(90deg,rgba(7,10,18,.78) 0%,rgba(7,10,18,.48) 45%,rgba(7,10,18,.22) 100%)}
        .home-hero-wash{position:absolute;inset:0;background:radial-gradient(circle at 22% 32%, rgba(122,57,64,.28), transparent 42%), radial-gradient(circle at 78% 24%, rgba(234,107,74,.16), transparent 34%), radial-gradient(circle at 70% 80%, rgba(22,88,66,.16), transparent 38%)}
        .home-hero-grid{position:relative;z-index:2;min-height:92vh;display:grid;grid-template-columns:1.05fr .95fr;gap:2rem;align-items:center;padding:4rem 0 7rem}
        .home-hero-copy{max-width:680px;animation:homeFadeUp .7s ease both}
        .home-kicker{display:inline-flex;align-items:center;gap:.5rem;border-radius:999px;padding:.55rem .9rem;background:rgba(255,255,255,.08);border:1px solid rgba(255,255,255,.14);color:rgba(255,255,255,.88);font-size:.82rem;letter-spacing:.12em;text-transform:uppercase;margin-bottom:1rem}
        .home-hero h1{margin:0;color:#fff;font-size:clamp(2.8rem,6vw,5.3rem);line-height:.96;font-weight:900;max-width:11ch;animation:homeFadeUp .85s ease .08s both}
        .home-hero p{margin-top:1.25rem;color:rgba(255,255,255,.84);font-size:1.08rem;line-height:1.8;max-width:58ch;animation:homeFadeUp .85s ease .16s both}
        .home-hero-actions{display:flex;gap:1rem;flex-wrap:wrap;margin-top:2rem;animation:homeFadeUp .85s ease .24s both}
        .home-btn{display:inline-flex;align-items:center;gap:.6rem;text-decoration:none;padding:.95rem 1.35rem;border-radius:999px;font-weight:900;transition:transform .2s ease, box-shadow .2s ease, background .2s ease, border-color .2s ease}
        .home-btn:hover{transform:translateY(-2px)}
        .home-btn-primary{background:#ea6b4a;color:#fff;box-shadow:0 12px 24px rgba(0,0,0,.16)}
        .home-btn-secondary{background:rgba(255,255,255,.08);color:#fff;border:1px solid rgba(255,255,255,.16)}
        .home-btn-dark{background:#163f33;color:#fff}
        .home-btn-ghost{background:#fff;color:#5e2232;border:1px solid rgba(15,23,42,.14)}
        .home-mini-row{display:flex;gap:1rem;flex-wrap:wrap;margin-top:1.25rem;color:rgba(255,255,255,.8);font-size:.92rem}
        .home-mini-row span{display:inline-flex;align-items:center;gap:.45rem}
        .home-hero-panel{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:1rem;align-self:stretch;animation:homeFadeUp .85s ease .18s both}
        .home-stat-card,.home-side-card,.home-feature-card,.home-floating-card{backdrop-filter:blur(12px);box-shadow:0 14px 30px rgba(0,0,0,.05)}
        .home-stat-card{background:rgba(255,255,255,.08);border:1px solid rgba(255,255,255,.12);border-radius:24px;padding:1.25rem;min-height:150px}
        .home-stat-icon,.home-side-icon{color:#ea6b4a}
        .home-stat-value{font-size:2rem;font-weight:900;line-height:1;color:#fff;margin-top:.15rem}
        .home-stat-label{margin-top:.5rem;color:rgba(255,255,255,.78);font-size:.95rem;line-height:1.5}
        .home-side-card{grid-column:span 2;border-radius:24px;padding:1.4rem;background:rgba(255,255,255,.08);border:1px solid rgba(255,255,255,.12);color:#fff;display:flex;flex-direction:column;justify-content:space-between}
        .home-side-card h3{margin:.9rem 0 0;font-size:1.1rem;font-weight:900}
        .home-side-card p{margin:.65rem 0 0;color:rgba(255,255,255,.8);line-height:1.7}
        .home-side-link{display:inline-flex;align-items:center;gap:.35rem;text-decoration:none;font-weight:900;margin-top:1.25rem;color:#fff}
        .home-floating-band{position:relative;z-index:3;margin-top:-3.5rem}
        .home-floating-card{display:flex;justify-content:space-between;align-items:center;gap:1rem;background:rgba(255,250,245,.94);border:1px solid rgba(15,23,42,.08);border-radius:28px;padding:1.2rem 1.3rem;box-shadow:0 18px 40px rgba(0,0,0,.12)}
        .home-floating-label{display:block;font-size:.78rem;letter-spacing:.14em;text-transform:uppercase;color:#a24a55;font-weight:900;margin-bottom:.25rem}
        .home-floating-card strong{font-size:1.02rem;color:#18212f}
        .home-floating-action{display:inline-flex;align-items:center;justify-content:center;text-decoration:none;background:#ea6b4a;color:#fff;font-weight:900;padding:.9rem 1.15rem;border-radius:999px;min-width:132px;transition:transform .2s ease, box-shadow .2s ease}
        .home-floating-action:hover{transform:translateY(-2px);box-shadow:0 10px 24px rgba(234,107,74,.26)}
        .home-impact-strip{background:#fff;padding:1.2rem 0 3rem}
        .home-impact-grid{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:1rem}
        .home-impact-item{background:#faf6f1;border:1px solid rgba(15,23,42,.08);border-radius:22px;padding:1.2rem 1.2rem 1.1rem;min-height:150px;position:relative;overflow:hidden}
        .home-impact-item::after{content:'';position:absolute;inset:auto -20% -35% auto;width:180px;height:180px;border-radius:50%;background:radial-gradient(circle, rgba(234,107,74,.12), transparent 68%)}
        .home-impact-item span{display:inline-flex;font-weight:900;letter-spacing:.12em;color:#a24a55;margin-bottom:.7rem}
        .home-impact-item strong{display:block;font-size:1.08rem;color:#18212f}
        .home-impact-item p{margin:.6rem 0 0;color:#516070;line-height:1.7;max-width:28ch}
        .home-gallery-section{background:#fff;padding:2rem 0 4rem}
        .home-content-wrap{max-width:1180px}
        .home-section-head{max-width:760px;margin-bottom:1.75rem}
        .home-eyebrow{margin:0;text-transform:uppercase;letter-spacing:.14em;font-size:.8rem;font-weight:900;color:#a24a55}
        .home-section h2{margin:.7rem 0 0;font-size:clamp(1.9rem,3vw,3rem);line-height:1.08;font-weight:900;color:#18212f}
        .home-gallery-grid{display:grid;grid-template-columns:repeat(5,minmax(0,1fr));gap:1rem}
        .home-gallery-item{margin:0;overflow:hidden;border-radius:24px;aspect-ratio:1/1.15;background:#f3ede6;border:1px solid rgba(15,23,42,.08)}
        .home-gallery-item img{width:100%;height:100%;object-fit:cover;display:block;transform:scale(1.02);transition:transform .5s ease}
        .home-gallery-item:hover img{transform:scale(1.08)}
        .home-gallery-1{grid-column:span 2;aspect-ratio:1.1/1}
        .home-gallery-2{grid-column:span 1}
        .home-gallery-3{grid-column:span 2;aspect-ratio:1.4/1}
        .home-gallery-4{grid-column:span 1}
        .home-gallery-5{grid-column:span 1}
        .home-section{padding:4.5rem 0}
        .home-section-soft{background:#f6f1ea}
        .home-feature-grid{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:1.2rem}
        .home-feature-card{background:#fff;border-radius:24px;padding:1.5rem;border:1px solid rgba(15,23,42,.08)}
        .home-feature-icon{color:#ea6b4a}
        .home-feature-card h3{margin:1rem 0 0;font-size:1.15rem;font-weight:900;color:#18212f}
        .home-feature-card p,.home-cta-copy p{margin:.75rem 0 0;color:#4b5563;line-height:1.7}
        .home-section-cta{background:linear-gradient(180deg,#f7f2eb,#fff)}
        .home-cta-inner{max-width:1000px;text-align:center;border-radius:32px;padding:1.5rem 0}
        .home-cta-copy{max-width:760px;margin:0 auto 1.5rem}
        .home-cta-actions{display:flex;justify-content:center;gap:1rem;flex-wrap:wrap}
        @keyframes homeFadeUp{from{opacity:0;transform:translateY(18px)}to{opacity:1;transform:translateY(0)}}
        @media (max-width: 1024px){
          .home-hero-grid{grid-template-columns:1fr;min-height:auto;padding:4rem 0 3rem}
          .home-hero-panel{grid-template-columns:repeat(2,minmax(0,1fr))}
          .home-feature-grid,.home-impact-grid,.home-gallery-grid{grid-template-columns:1fr 1fr}
        }
        @media (max-width: 720px){
          .home-hero{min-height:auto}
          .home-hero-grid{padding:3rem 0 2.5rem}
          .home-hero h1{max-width:100%}
          .home-hero-panel{grid-template-columns:1fr}
          .home-side-card{grid-column:span 1}
          .home-floating-card{flex-direction:column;align-items:stretch}
          .home-floating-action{width:100%}
          .home-section{padding:3.5rem 0}
          .home-feature-grid,.home-impact-grid,.home-gallery-grid{grid-template-columns:1fr}
          .home-gallery-item,.home-gallery-1,.home-gallery-3{grid-column:span 1;aspect-ratio:1/1.1}
        }
      `}</style>
    </main>
  );
}