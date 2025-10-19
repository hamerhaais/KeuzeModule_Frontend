import { useEffect, useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { apiGet, endpoints } from '../services/api.js';
import { useAuth } from '../services/auth.jsx';

export default function ModulesList() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const { isLoggedIn } = useAuth();

  // Filters
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCredits, setSelectedCredits] = useState([]);
  const [selectedLocations, setSelectedLocations] = useState([]);
  const [selectedLevels, setSelectedLevels] = useState([]);

  useEffect(() => {
    let alive = true;
    (async () => {
      try {
        const data = await apiGet(endpoints.modules);
        if (alive) setItems(data);
      } catch (e) {
        setError(e.message);
      } finally {
        if (alive) setLoading(false);
      }
    })();
    return () => { alive = false; };
  }, []);

  // Bereken unieke studiepunten, locaties en levels
  const uniqueCredits = useMemo(() => {
    const credits = items.map(m => m.studycredit).filter(c => c != null);
    return [...new Set(credits)].sort((a, b) => a - b);
  }, [items]);

  const uniqueLocations = useMemo(() => {
    const locs = items.map(m => m.location).filter(l => l && l.trim().length > 0);
    return [...new Set(locs)].sort();
  }, [items]);

  const uniqueLevels = useMemo(() => {
    const levels = items.map(m => m.level).filter(l => l && l.trim().length > 0);
    return [...new Set(levels)].sort();
  }, [items]);

  // Filter modules
  const filteredItems = useMemo(() => {
    return items.filter(m => {
      // Zoekterm filter
      if (searchTerm.trim().length > 0) {
        const term = searchTerm.toLowerCase();
        const inName = m.name && m.name.toLowerCase().includes(term);
        const inDesc = m.shortdescription && m.shortdescription.toLowerCase().includes(term);
        const inContent = m.description && m.description.toLowerCase().includes(term);
        if (!inName && !inDesc && !inContent) return false;
      }

      // Studiepunten filter
      if (selectedCredits.length > 0 && !selectedCredits.includes(m.studycredit)) {
        return false;
      }

      // Locatie filter
      if (selectedLocations.length > 0 && !selectedLocations.includes(m.location)) {
        return false;
      }

      // Level filter
      if (selectedLevels.length > 0 && !selectedLevels.includes(m.level)) {
        return false;
      }

      return true;
    });
  }, [items, searchTerm, selectedCredits, selectedLocations, selectedLevels]);

  function toggleCredit(credit) {
    setSelectedCredits(prev => prev.includes(credit) ? prev.filter(c => c !== credit) : [...prev, credit]);
  }

  function toggleLocation(location) {
    setSelectedLocations(prev => prev.includes(location) ? prev.filter(l => l !== location) : [...prev, location]);
  }

  function toggleLevel(level) {
    setSelectedLevels(prev => prev.includes(level) ? prev.filter(l => l !== level) : [...prev, level]);
  }

  if (loading) return <p>Loading modules…</p>;
  if (error) return <p style={{ color: 'crimson' }}>Error: {error}</p>;

  return (
    <div style={{ maxWidth: 1200, margin: '0 auto', padding: '32px 16px' }}>
      <h2 style={{ textAlign: 'left', marginBottom: 24, color: '#2193b0', fontWeight: 700, fontSize: '2rem', textShadow: '0 2px 8px rgba(33,147,176,0.12)' }}>Keuzemodules</h2>

      {/* Zoekbalk */}
      <div style={{ marginBottom: 24 }}>
        <input
          type="text"
          placeholder="Zoek op naam of trefwoord…"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          style={{ width: '100%', padding: '12px 16px', borderRadius: 8, border: '1px solid #ccc', fontSize: '1rem' }}
        />
      </div>

      {/* Filters */}
      <div style={{ display: 'flex', gap: 32, marginBottom: 24, flexWrap: 'wrap' }}>
        {/* Studiepunten filter */}
        {uniqueCredits.length > 0 && (
          <div>
            <strong style={{ display: 'block', marginBottom: 8, color: '#2193b0', fontWeight: 600 }}>Studiepunten:</strong>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
              {uniqueCredits.map(credit => (
                <label key={credit} style={{ display: 'flex', alignItems: 'center', gap: 6, cursor: 'pointer', color: '#fff' }}>
                  <input
                    type="checkbox"
                    checked={selectedCredits.includes(credit)}
                    onChange={() => toggleCredit(credit)}
                  />
                  <span>{credit} EC</span>
                </label>
              ))}
            </div>
          </div>
        )}

        {/* Locatie filter */}
        {uniqueLocations.length > 0 && (
          <div>
            <strong style={{ display: 'block', marginBottom: 8, color: '#2193b0', fontWeight: 600 }}>Locatie:</strong>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
              {uniqueLocations.map(location => (
                <label key={location} style={{ display: 'flex', alignItems: 'center', gap: 6, cursor: 'pointer', color: '#fff' }}>
                  <input
                    type="checkbox"
                    checked={selectedLocations.includes(location)}
                    onChange={() => toggleLocation(location)}
                  />
                  <span>{location}</span>
                </label>
              ))}
            </div>
          </div>
        )}

        {/* Level filter */}
        {uniqueLevels.length > 0 && (
          <div>
            <strong style={{ display: 'block', marginBottom: 8, color: '#2193b0', fontWeight: 600 }}>Level:</strong>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
              {uniqueLevels.map(level => (
                <label key={level} style={{ display: 'flex', alignItems: 'center', gap: 6, cursor: 'pointer', color: '#fff' }}>
                  <input
                    type="checkbox"
                    checked={selectedLevels.includes(level)}
                    onChange={() => toggleLevel(level)}
                  />
                  <span>{level}</span>
                </label>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Resultaten */}
      {filteredItems.length === 0 ? (
        <p>Geen modules gevonden die aan de filters voldoen.</p>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '24px' }}>
          {filteredItems.map((m, i) => (
            <div key={m.id} style={{ background: `linear-gradient(135deg, #${(i%2===0?'6dd5ed':'f7797d')}, #${(i%2===0?'2193b0':'fbd786')})`, borderRadius: 16, boxShadow: '0 2px 8px rgba(0,0,0,0.07)', padding: '24px', color: '#fff', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', alignItems: 'flex-start', minHeight: 160, textAlign: 'left' }}>
              <div style={{ width: '100%' }}>
                <strong style={{ fontSize: '1.2rem', letterSpacing: 0.5, display: 'block' }}>{m.name}</strong>
                {m.shortdescription ? <div style={{ color: 'rgba(255,255,255,0.85)', marginTop: 8 }}>{m.shortdescription}</div> : null}
              </div>
              <Link to={`/modules/${m.id}`} style={{ marginTop: 16, background: 'rgba(255,255,255,0.2)', color: '#fff', padding: '8px 16px', borderRadius: 8, textDecoration: 'none', fontWeight: 500 }}>Bekijk details</Link>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
