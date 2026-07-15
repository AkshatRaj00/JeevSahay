// src/components/RecipientSelector.jsx
import React, { useEffect, useMemo, useState } from 'react';
import STATE_DISTRICT from '../data/stateDistrictData';
import { collection, getDocs, query, where, limit } from 'firebase/firestore';
import { db } from '../firebaseConfig'; // keep this same everywhere in project

const COLLECTION_NAME = 'centers';
const TYPES = ['NGO', 'Hospital', 'Shelter', 'Rescue'];

const normalizeText = (value) => (value || '').toString().trim();
const normalizeStateCode = (value) => normalizeText(value).toUpperCase();

const normalizeCenter = (id, data = {}) => ({
  id,
  name: normalizeText(data.name),
  type: normalizeText(data.type),
  city: normalizeText(data.city),
  district: normalizeText(data.district),
  stateCode: normalizeStateCode(data.stateCode),
  stateName: normalizeText(data.stateName),
  address: normalizeText(data.address),
  phone: normalizeText(data.phone || data.contact),
  active: data.active !== false,
  verified: data.verified === true,
});

const dedupeRecipients = (items = []) => {
  const map = new Map();

  for (const item of items) {
    if (!item || !item.id) continue;
    map.set(item.id, item);
  }

  return Array.from(map.values());
};

const RecipientSelector = ({ selectedRecipients = [], onChange }) => {
  const [stateCode, setStateCode] = useState('');
  const [district, setDistrict] = useState('');
  const [typeFilter, setTypeFilter] = useState('');
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(false);
  const [centers, setCenters] = useState([]);
  const [fetchError, setFetchError] = useState('');

  const normalizedSelected = useMemo(
    () => dedupeRecipients(selectedRecipients),
    [selectedRecipients]
  );

  const selectedIds = useMemo(
    () => new Set(normalizedSelected.map((item) => item.id)),
    [normalizedSelected]
  );

  const states = useMemo(() => STATE_DISTRICT || [], []);

  const districtsForState = useMemo(() => {
    if (!stateCode) return [];
    const found = states.find((st) => st.code === stateCode);
    return found?.districts || [];
  }, [stateCode, states]);

  useEffect(() => {
    let cancelled = false;

    const fetchCenters = async () => {
      setLoading(true);
      setFetchError('');

      try {
        const constraints = [];

        if (stateCode) constraints.push(where('stateCode', '==', stateCode));
        if (district) constraints.push(where('district', '==', district));
        if (typeFilter) constraints.push(where('type', '==', typeFilter));

        const baseRef = collection(db, COLLECTION_NAME);
        const ref =
          constraints.length > 0
            ? query(baseRef, ...constraints, limit(200))
            : query(baseRef, limit(200));

        const snap = await getDocs(ref);

        if (cancelled) return;

        const data = snap.docs
          .map((doc) => normalizeCenter(doc.id, doc.data()))
          .filter((center) => center.name && center.active);

        setCenters(data);
      } catch (error) {
        console.error('Error fetching centers:', error);
        if (!cancelled) {
          setCenters([]);
          setFetchError(
            'Failed to load centers. Check Firestore collection name, indexes, and firebase import.'
          );
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    fetchCenters();

    return () => {
      cancelled = true;
    };
  }, [stateCode, district, typeFilter]);

  const filteredCenters = useMemo(() => {
    const keyword = search.trim().toLowerCase();
    if (!keyword) return centers;

    return centers.filter((center) => {
      return (
        center.name.toLowerCase().includes(keyword) ||
        center.city.toLowerCase().includes(keyword) ||
        center.district.toLowerCase().includes(keyword) ||
        center.stateName.toLowerCase().includes(keyword) ||
        center.stateCode.toLowerCase().includes(keyword) ||
        center.address.toLowerCase().includes(keyword)
      );
    });
  }, [centers, search]);

  const toggleRecipient = (center) => {
    const exists = selectedIds.has(center.id);

    const updated = exists
      ? normalizedSelected.filter((item) => item.id !== center.id)
      : [...normalizedSelected, center];

    onChange(updated);
  };

  const clearFilters = () => {
    setStateCode('');
    setDistrict('');
    setTypeFilter('');
    setSearch('');
  };

  return (
    <section className="recipient-selector">
      <div className="recipient-selector__header">
        <h3>Select recipients</h3>
        <p>Choose verified hospitals, NGOs, shelters, or rescue teams for this SOS report.</p>
      </div>

      <div className="selector-row">
        <div className="field">
          <label htmlFor="recipient-state">State</label>
          <select
            id="recipient-state"
            value={stateCode}
            onChange={(e) => {
              setStateCode(e.target.value);
              setDistrict('');
            }}
          >
            <option value="">All states</option>
            {states.map((state) => (
              <option key={state.code} value={state.code}>
                {state.state}
              </option>
            ))}
          </select>
        </div>

        <div className="field">
          <label htmlFor="recipient-district">District</label>
          <select
            id="recipient-district"
            value={district}
            onChange={(e) => setDistrict(e.target.value)}
            disabled={!stateCode}
          >
            <option value="">All districts</option>
            {districtsForState.map((item) => (
              <option key={item} value={item}>
                {item}
              </option>
            ))}
          </select>
        </div>

        <div className="field">
          <label htmlFor="recipient-type">Type</label>
          <select
            id="recipient-type"
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
          >
            <option value="">All types</option>
            {TYPES.map((type) => (
              <option key={type} value={type}>
                {type}
              </option>
            ))}
          </select>
        </div>

        <div className="field">
          <label htmlFor="recipient-search">Search</label>
          <input
            id="recipient-search"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Name, city, district, address"
          />
        </div>
      </div>

      <div className="selector-toolbar">
        <span>
          {loading ? 'Loading centers...' : `${filteredCenters.length} centers found`}
        </span>
        <button type="button" onClick={clearFilters}>
          Clear filters
        </button>
      </div>

      {fetchError && <p className="error-text">{fetchError}</p>}

      <div className="selector-list" role="list">
        {!loading && !fetchError && filteredCenters.length === 0 && (
          <p>No centers found for the selected filters.</p>
        )}

        {!loading &&
          filteredCenters.map((center) => {
            const checked = selectedIds.has(center.id);

            return (
              <label
                key={center.id}
                className={`center-item ${checked ? 'selected' : ''}`}
              >
                <input
                  type="checkbox"
                  checked={checked}
                  onChange={() => toggleRecipient(center)}
                />
                <div className="center-main">
                  <strong>{center.name}</strong>
                  <span className="center-type">{center.type || 'Center'}</span>
                </div>

                <div className="center-meta">
                  <span>
                    {center.district || 'Unknown district'}, {center.stateName || center.stateCode || 'Unknown state'}
                  </span>
                  {center.phone && <span>📞 {center.phone}</span>}
                  {center.verified && <span>✅ Verified</span>}
                </div>

                {center.address && (
                  <div className="center-address">
                    {center.address}
                  </div>
                )}
              </label>
            );
          })}
      </div>

      {normalizedSelected.length > 0 && (
        <div className="selected-summary">
          <p>Selected {normalizedSelected.length} recipients:</p>
          <ul>
            {normalizedSelected.map((recipient) => (
              <li key={recipient.id}>
                {recipient.name} ({recipient.type || 'Center'})
              </li>
            ))}
          </ul>
        </div>
      )}
    </section>
  );
};

export default RecipientSelector;