import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import {
  ArrowRight,
  Camera,
  CheckCircle2,
  Clover,
  HeartHandshake,
  MapPinned,
  PawPrint,
  RefreshCw,
  ShieldAlert,
  Upload,
  Video,
  Wind,
} from 'lucide-react';
import { db } from '../firebaseConfig';
import { useGeoLocation } from '../hooks/useGeoLocation';

const storage = getStorage();

const ANIMAL_OPTIONS = [
  { value: 'Dog', label: 'Dog', emoji: '🐶' },
  { value: 'Cat', label: 'Cat', emoji: '🐱' },
  { value: 'Cow', label: 'Cow', emoji: '🐄' },
  { value: 'Goat', label: 'Goat', emoji: '🐐' },
  { value: 'Bird', label: 'Bird', emoji: '🐦' },
  { value: 'Other', label: 'Other', emoji: '🐾' },
];

const SEVERITY_OPTIONS = [
  { value: 'Low', label: 'Low' },
  { value: 'Medium', label: 'Medium' },
  { value: 'High', label: 'High' },
  { value: 'Critical', label: 'Critical' },
];

const CONDITION_OPTIONS = [
  'Injured',
  'Bleeding',
  'Stuck',
  'Sick',
  'Abandoned',
  'Aggressive',
  'Pregnant',
  'Weak',
];

const BANNER_PHOTO =
  'https://images.pexels.com/photos/1108099/pexels-photo-1108099.jpeg?auto=compress&cs=tinysrgb&w=1600';

function FileChip({ icon: Icon, label, value }) {
  return (
    <div className="rg-file-chip">
      <Icon size={16} />
      <span>{label}</span>
      <strong>{value || 'Not added'}</strong>
    </div>
  );
}

function AnimalChip({ active, emoji, label, onClick }) {
  return (
    <button
      type="button"
      className={`rg-animal-chip ${active ? 'is-active' : ''}`}
      onClick={onClick}
    >
      <span>{emoji}</span>
      <strong>{label}</strong>
    </button>
  );
}

function SeverityPill({ active, label, onClick }) {
  return (
    <button
      type="button"
      className={`rg-severity-pill ${active ? 'is-active' : ''}`}
      onClick={onClick}
    >
      {label}
    </button>
  );
}

export function ReportSOS() {
  const {
    coords,
    loading: geoLoading,
    error: geoError,
    accuracy,
    bestAccuracy,
    isPrecise,
    refetch,
    isWatching,
  } = useGeoLocation();

  const [animalType, setAnimalType] = useState('Dog');
  const [severity, setSeverity] = useState('High');
  const [description, setDescription] = useState('');
  const [landmark, setLandmark] = useState('');
  const [conditionTags, setConditionTags] = useState([]);
  const [photoFile, setPhotoFile] = useState(null);
  const [videoFile, setVideoFile] = useState(null);
  const [photoPreview, setPhotoPreview] = useState(null);
  const [videoPreview, setVideoPreview] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState(null);

  const userLocation = useMemo(() => {
    if (!coords) return null;
    return { lat: coords.latitude, lng: coords.longitude };
  }, [coords]);

  const toggleCondition = (tag) => {
    setConditionTags((prev) =>
      prev.includes(tag) ? prev.filter((item) => item !== tag) : [...prev, tag]
    );
  };

  const handlePhotoChange = (event) => {
    const file = event.target.files?.[0];
    if (!file) return;
    setPhotoFile(file);
    const reader = new FileReader();
    reader.onloadend = () => setPhotoPreview(reader.result);
    reader.readAsDataURL(file);
  };

  const handleVideoChange = (event) => {
    const file = event.target.files?.[0];
    if (!file) return;
    setVideoFile(file);
    const previewUrl = URL.createObjectURL(file);
    setVideoPreview(previewUrl);
  };

  const resetForm = () => {
    setAnimalType('Dog');
    setSeverity('High');
    setDescription('');
    setLandmark('');
    setConditionTags([]);
    setPhotoFile(null);
    setVideoFile(null);
    setPhotoPreview(null);
    setVideoPreview(null);
    setSubmitStatus(null);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!userLocation) {
      alert('Waiting for accurate location... Please refresh exact location.');
      return;
    }

    if (!description.trim()) {
      alert('Please describe the situation briefly.');
      return;
    }

    setIsSubmitting(true);
    setSubmitStatus(null);

    try {
      let photoUrl = null;
      let videoUrl = null;

      if (photoFile) {
        const photoRef = ref(storage, `rescues/photos/${Date.now()}_${photoFile.name}`);
        await uploadBytes(photoRef, photoFile);
        photoUrl = await getDownloadURL(photoRef);
      }

      if (videoFile) {
        const videoRef = ref(storage, `rescues/videos/${Date.now()}_${videoFile.name}`);
        await uploadBytes(videoRef, videoFile);
        videoUrl = await getDownloadURL(videoRef);
      }

      const rescueData = {
        animalType,
        severity,
        conditionTags,
        landmark: landmark.trim(),
        description: description.trim(),
        photoUrl,
        videoUrl,
        lat: userLocation.lat,
        lng: userLocation.lng,
        accuracy: bestAccuracy ?? accuracy ?? null,
        status: 'pending',
        createdAt: serverTimestamp(),
        reportedBy: 'anonymous',
      };

      await addDoc(collection(db, 'activeRescues'), rescueData);

      setSubmitStatus('success');
      resetForm();
    } catch (error) {
      console.error('SOS submit failed:', error);
      setSubmitStatus('error');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className="rg-page">
      <section className="rg-hero" style={{ backgroundImage: `url(${BANNER_PHOTO})` }}>
        <div className="rg-hero-overlay" />
        <div className="container rg-hero-inner">
          <div className="rg-hero-copy">
            <div className="rg-kicker">
              <PawPrint size={14} />
              Animal rescue report
            </div>
            <h1>Report SOS with real location, real urgency, and real proof.</h1>
            <p>
              Give us the animal type, exact location, condition, and evidence so rescue teams can
              act faster.
            </p>
            <div className="rg-hero-actions">
              <button type="button" className="rg-btn rg-btn-primary" onClick={refetch}>
                <RefreshCw size={18} />
                Refresh Exact Location
              </button>
              <Link to="/map" className="rg-btn rg-btn-secondary">
                <MapPinned size={18} />
                Open Map
              </Link>
            </div>
          </div>

          <div className="rg-hero-card">
            <div className="rg-location-status">
              {geoLoading ? (
                <>
                  <Wind size={18} />
                  <span>Getting your exact location...</span>
                </>
              ) : geoError ? (
                <>
                  <ShieldAlert size={18} />
                  <span>{geoError}</span>
                </>
              ) : userLocation ? (
                <>
                  <CheckCircle2 size={18} />
                  <span>
                    Location locked — {userLocation.lat.toFixed(5)}, {userLocation.lng.toFixed(5)}
                  </span>
                </>
              ) : (
                <>
                  <MapPinned size={18} />
                  <span>Waiting for location...</span>
                </>
              )}
            </div>

            <div className="rg-accuracy-card">
              <strong>Accuracy</strong>
              <span>{Math.round(bestAccuracy ?? accuracy ?? 0) || '—'} m</span>
              <small>{isPrecise ? 'Precise GPS lock' : 'Approximate lock'}</small>
              <small>{isWatching ? 'Tracking for best fix...' : 'Auto-refresh ready'}</small>
            </div>
          </div>
        </div>
      </section>

      <section className="rg-body">
        <div className="container rg-form-shell">
          {submitStatus === 'success' && (
            <div className="rg-alert success">
              <CheckCircle2 size={18} />
              <div>
                <strong>SOS report sent.</strong>
                <p>Help is on the way.</p>
              </div>
              <Link to="/user" className="rg-alert-link">
                View rescue history <ArrowRight size={16} />
              </Link>
            </div>
          )}

          {submitStatus === 'error' && (
            <div className="rg-alert error">
              <ShieldAlert size={18} />
              <div>
                <strong>Failed to send report.</strong>
                <p>Please try again.</p>
              </div>
            </div>
          )}

          <form onSubmit={handleSubmit} className="rg-form">
            <section className="rg-panel">
              <div className="rg-panel-head">
                <h2>1. Animal type</h2>
                <p>Select the closest match.</p>
              </div>

              <div className="rg-animal-grid">
                {ANIMAL_OPTIONS.map((item) => (
                  <AnimalChip
                    key={item.value}
                    active={animalType === item.value}
                    emoji={item.emoji}
                    label={item.label}
                    onClick={() => setAnimalType(item.value)}
                  />
                ))}
              </div>
            </section>

            <section className="rg-panel">
              <div className="rg-panel-head">
                <h2>2. Severity</h2>
                <p>How urgent is the rescue?</p>
              </div>

              <div className="rg-severity-grid">
                {SEVERITY_OPTIONS.map((item) => (
                  <SeverityPill
                    key={item.value}
                    active={severity === item.value}
                    label={item.label}
                    onClick={() => setSeverity(item.value)}
                  />
                ))}
              </div>

              <div className="rg-tag-section">
                <label className="rg-label">Condition tags</label>
                <div className="rg-tags">
                  {CONDITION_OPTIONS.map((tag) => (
                    <button
                      key={tag}
                      type="button"
                      className={`rg-tag ${conditionTags.includes(tag) ? 'is-active' : ''}`}
                      onClick={() => toggleCondition(tag)}
                    >
                      {tag}
                    </button>
                  ))}
                </div>
              </div>
            </section>

            <section className="rg-panel">
              <div className="rg-panel-head">
                <h2>3. Exact place</h2>
                <p>Add a nearby landmark for the rescue team.</p>
              </div>

              <div className="rg-field">
                <label htmlFor="landmark" className="rg-label">
                  Landmark / area
                </label>
                <input
                  id="landmark"
                  value={landmark}
                  onChange={(e) => setLandmark(e.target.value)}
                  placeholder="Temple gate, market corner, highway turn, hospital road..."
                />
              </div>

              <div className="rg-location-mini">
                <strong>Current coordinates</strong>
                <span>
                  {userLocation
                    ? `${userLocation.lat.toFixed(5)}, ${userLocation.lng.toFixed(5)}`
                    : 'Waiting...'}
                </span>
              </div>
            </section>

            <section className="rg-panel">
              <div className="rg-panel-head">
                <h2>4. Situation details</h2>
                <p>Short and clear works best.</p>
              </div>

              <div className="rg-field">
                <label htmlFor="desc" className="rg-label">
                  Describe the situation
                </label>
                <textarea
                  id="desc"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  required
                  rows="5"
                  placeholder="Example: Injured cow near the road, cannot stand, bleeding from leg..."
                />
              </div>
            </section>

            <section className="rg-panel">
              <div className="rg-panel-head">
                <h2>5. Photo and video</h2>
                <p>Clear evidence helps rescue teams decide faster.</p>
              </div>

              <div className="rg-upload-grid">
                <div className="rg-field">
                  <label htmlFor="photo" className="rg-label">
                    Photo evidence
                  </label>
                  <label className="rg-upload-box" htmlFor="photo">
                    <Camera size={20} />
                    <span>Upload image</span>
                    <small>{photoFile ? photoFile.name : 'JPG, PNG, WEBP'}</small>
                  </label>
                  <input id="photo" type="file" accept="image/*" onChange={handlePhotoChange} hidden />
                  {photoPreview && <img className="rg-preview" src={photoPreview} alt="Photo preview" />}
                </div>

                <div className="rg-field">
                  <label htmlFor="video" className="rg-label">
                    Video evidence
                  </label>
                  <label className="rg-upload-box" htmlFor="video">
                    <Video size={20} />
                    <span>Upload video</span>
                    <small>{videoFile ? videoFile.name : 'MP4, MOV, WEBM'}</small>
                  </label>
                  <input id="video" type="file" accept="video/*" onChange={handleVideoChange} hidden />
                  {videoPreview && (
                    <video className="rg-preview" controls src={videoPreview} />
                  )}
                </div>
              </div>

              <div className="rg-file-row">
                <FileChip icon={Upload} label="Photo" value={photoFile?.name} />
                <FileChip icon={Video} label="Video" value={videoFile?.name} />
              </div>
            </section>

            <button
              type="submit"
              disabled={isSubmitting || !userLocation}
              className="rg-submit"
            >
              {isSubmitting ? 'Sending SOS...' : !userLocation ? 'Waiting for accurate location...' : 'Send SOS Report'}
              <ArrowRight size={18} />
            </button>
          </form>

          <p className="rg-note">
            By submitting, you confirm this is a genuine rescue case. False reports may lead to ban.
          </p>
        </div>
      </section>

      <style>{`
        .rg-page{min-height:100vh;background:#f7f3ed;color:#18161a}
        .rg-hero{position:relative;background-size:cover;background-position:center;min-height:46vh;display:flex;align-items:center}
        .rg-hero-overlay{position:absolute;inset:0;background:linear-gradient(90deg,rgba(10,10,12,.82),rgba(10,10,12,.35))}
        .rg-hero-inner{position:relative;z-index:2;display:grid;grid-template-columns:1.1fr .9fr;gap:2rem;align-items:end;padding-block:4.5rem}
        .rg-hero-copy{max-width:720px;color:#fff}
        .rg-kicker{display:inline-flex;align-items:center;gap:.5rem;padding:.55rem .85rem;border-radius:999px;background:rgba(255,255,255,.1);border:1px solid rgba(255,255,255,.14);font-size:.82rem;letter-spacing:.12em;text-transform:uppercase}
        .rg-hero h1{margin:1rem 0 0;font-size:clamp(2.4rem,5vw,4.8rem);line-height:.96;max-width:12ch}
        .rg-hero p{margin-top:1rem;max-width:56ch;font-size:1.05rem;line-height:1.8;color:rgba(255,255,255,.86)}
        .rg-hero-actions{display:flex;flex-wrap:wrap;gap:.9rem;margin-top:1.6rem}
        .rg-btn{display:inline-flex;align-items:center;gap:.55rem;text-decoration:none;border:none;border-radius:999px;padding:.95rem 1.2rem;font-weight:800}
        .rg-btn-primary{background:#ea6b4a;color:#fff}
        .rg-btn-secondary{background:rgba(255,255,255,.12);color:#fff;border:1px solid rgba(255,255,255,.16)}
        .rg-hero-card{display:grid;gap:1rem}
        .rg-location-status,.rg-accuracy-card{background:rgba(255,255,255,.92);border:1px solid rgba(17,24,39,.08);border-radius:24px;padding:1rem 1.1rem;box-shadow:0 16px 30px rgba(0,0,0,.08)}
        .rg-location-status{display:flex;align-items:center;gap:.75rem;font-weight:700}
        .rg-accuracy-card{display:grid;gap:.25rem}
        .rg-accuracy-card strong{font-size:.8rem;letter-spacing:.12em;text-transform:uppercase;color:#8a4b4b}
        .rg-accuracy-card span{font-size:1.6rem;font-weight:900}
        .rg-accuracy-card small{color:#667085}
        .rg-body{padding:2rem 0 4rem}
        .rg-form-shell{max-width:920px}
        .rg-alert{display:flex;align-items:center;gap:1rem;padding:1rem 1.1rem;border-radius:20px;margin-bottom:1rem}
        .rg-alert.success{background:#e9f8ef;color:#11653e}
        .rg-alert.error{background:#fdecec;color:#a52d2d}
        .rg-alert p{margin:0}
        .rg-alert-link{margin-left:auto;display:inline-flex;align-items:center;gap:.35rem;text-decoration:none;font-weight:800;color:inherit}
        .rg-form{display:grid;gap:1rem}
        .rg-panel{background:#fff;border:1px solid rgba(17,24,39,.08);border-radius:24px;padding:1.25rem;box-shadow:0 12px 24px rgba(0,0,0,.04)}
        .rg-panel-head h2{margin:0;font-size:1.1rem}
        .rg-panel-head p{margin:.35rem 0 0;color:#667085}
        .rg-animal-grid,.rg-severity-grid,.rg-tags,.rg-file-row,.rg-upload-grid{display:grid;gap:.75rem}
        .rg-animal-grid{grid-template-columns:repeat(3,minmax(0,1fr));margin-top:1rem}
        .rg-animal-chip,.rg-severity-pill,.rg-tag{border:1px solid rgba(17,24,39,.12);background:#faf8f4;border-radius:16px;padding:.9rem 1rem;font-weight:800}
        .rg-animal-chip{display:flex;align-items:center;justify-content:space-between;gap:1rem}
        .rg-animal-chip.is-active,.rg-severity-pill.is-active,.rg-tag.is-active{background:#18161a;color:#fff;border-color:#18161a}
        .rg-severity-grid{grid-template-columns:repeat(4,minmax(0,1fr));margin-top:1rem}
        .rg-tag-section{margin-top:1rem}
        .rg-label{display:block;margin:0 0 .55rem;font-weight:800}
        .rg-tags{grid-template-columns:repeat(4,minmax(0,1fr))}
        .rg-field input,.rg-field textarea{width:100%;border:1px solid rgba(17,24,39,.12);background:#fff;border-radius:16px;padding:1rem;font:inherit}
        .rg-field textarea{resize:vertical;min-height:140px}
        .rg-location-mini{display:flex;justify-content:space-between;gap:1rem;align-items:center;margin-top:1rem;padding:1rem;border-radius:16px;background:#f6efe8}
        .rg-upload-grid{grid-template-columns:repeat(2,minmax(0,1fr));margin-top:1rem}
        .rg-upload-box{display:grid;place-items:center;gap:.35rem;padding:1.1rem;border-radius:18px;border:1px dashed rgba(17,24,39,.16);background:#fbfaf8;cursor:pointer;text-align:center}
        .rg-upload-box small{color:#667085}
        .rg-preview{width:100%;margin-top:.75rem;border-radius:16px;object-fit:cover;max-height:260px;background:#ece8e1}
        .rg-file-row{grid-template-columns:repeat(2,minmax(0,1fr));margin-top:1rem}
        .rg-file-chip{display:flex;align-items:center;gap:.75rem;padding:.85rem 1rem;border-radius:16px;background:#f6efe8;border:1px solid rgba(17,24,39,.08)}
        .rg-file-chip span{color:#667085}
        .rg-file-chip strong{margin-left:auto;max-width:55%;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
        .rg-submit{display:flex;align-items:center;justify-content:center;gap:.6rem;border:none;border-radius:18px;padding:1rem 1.2rem;background:#ea6b4a;color:#fff;font-weight:900;font-size:1rem}
        .rg-submit:disabled{opacity:.65;cursor:not-allowed}
        .rg-note{margin:1rem 0 0;text-align:center;color:#667085;line-height:1.7}
        @media (max-width: 900px){
          .rg-hero-inner{grid-template-columns:1fr;align-items:start}
          .rg-animal-grid,.rg-severity-grid,.rg-tags,.rg-upload-grid,.rg-file-row{grid-template-columns:1fr 1fr}
        }
        @media (max-width: 640px){
          .rg-hero{min-height:auto}
          .rg-hero-inner{padding-block:3.25rem}
          .rg-hero h1{max-width:100%}
          .rg-animal-grid,.rg-severity-grid,.rg-tags,.rg-upload-grid,.rg-file-row{grid-template-columns:1fr}
          .rg-location-mini{flex-direction:column;align-items:flex-start}
          .rg-alert{flex-direction:column;align-items:flex-start}
          .rg-alert-link{margin-left:0}
        }
      `}</style>
    </main>
  );
}