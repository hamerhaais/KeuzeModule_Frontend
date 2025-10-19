import { useEffect, useState } from 'react';
import { useAuth } from '../services/auth.jsx';
import { getMyEnrollments, setFirstChoice, endpoints, apiGet, apiDelete } from '../services/api.js';

export default function MijnInschrijvingen() {
  const { token, isLoggedIn } = useAuth();
  const [enrollments, setEnrollments] = useState([]);
  const [modules, setModules] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let alive = true;
    (async () => {
      try {
        const [enrs, mods] = await Promise.all([
          isLoggedIn ? getMyEnrollments(token) : [],
          apiGet(endpoints.modules),
        ]);
        if (alive) {
          setEnrollments(enrs || []);
          setModules(mods || []);
        }
      } catch (e) {
        setError(e.message);
      } finally {
        if (alive) setLoading(false);
      }
    })();
    return () => { alive = false; };
  }, [isLoggedIn, token]);

  async function handleSetFirstChoice(moduleId) {
    try {
      await setFirstChoice(moduleId, true, token);
      const enrs = await getMyEnrollments(token);
      setEnrollments(enrs || []);
    } catch (e) {
      // Toon een nette melding, geen raw JSON
      alert('Kon eerste keuze niet opslaan. Probeer opnieuw.');
    }
  }

    async function handleDeleteEnrollment(moduleId) {
      if (!window.confirm('Weet je zeker dat je deze inschrijving wilt verwijderen?')) return;
      try {
        await apiDelete(`${endpoints.enrollments}/${moduleId}`, token);
        const enrs = await getMyEnrollments(token);
        setEnrollments(enrs || []);
      } catch (e) {
        alert(e.message);
      }
    }

  if (!isLoggedIn) return <p>Log eerst in om je inschrijvingen te zien.</p>;
  if (loading) return <p>Bezig met laden…</p>;
  if (error) return <p style={{ color: 'crimson' }}>Error: {error}</p>;

  return (
    <div>
      <h2>Mijn inschrijvingen</h2>
      {enrollments.length === 0 ? (
        <p>Je bent nog niet ingeschreven voor een keuzemodule.</p>
      ) : (
        <ul style={{ listStyle: 'none', padding: 0 }}>
          {enrollments.map((e) => {
            const mod = modules.find((m) => Number(m.id) === Number(e.moduleId));
            return (
              <li key={e.moduleId} style={{ padding: '8px 0', borderBottom: '1px solid #eee', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <span>
                  <strong>{mod?.name || `Module ${e.moduleId}`}</strong>
                  {e.firstChoice ? (
                    <span style={{ color: 'green', marginLeft: 8 }}>(Eerste keuze)</span>
                  ) : (
                    <button style={{ marginLeft: 8 }} onClick={() => handleSetFirstChoice(e.moduleId)}>
                      Maak eerste keuze
                    </button>
                  )}
                </span>
                <button style={{ color: 'crimson', background: 'none', border: 'none', cursor: 'pointer' }} onClick={() => handleDeleteEnrollment(e.moduleId)}>
                  Verwijder
                </button>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}