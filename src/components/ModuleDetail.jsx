import { useEffect, useMemo, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { apiGet, endpoints, enroll as apiEnroll, setFirstChoice, getMyEnrollments } from '../services/api.js';
import { useAuth } from '../services/auth.jsx';

export default function ModuleDetail() {
  const { id } = useParams();
  const [mod, setMod] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [myEnrollments, setMyEnrollments] = useState([]);
  const navigate = useNavigate();
  const { isLoggedIn, token } = useAuth();

  const byIdUrl = useMemo(() => endpoints.moduleById(id), [id]);

  useEffect(() => {
    let alive = true;
    (async () => {
      try {
        const data = await apiGet(byIdUrl);
        if (alive) { setMod(data); }
      } catch (e) {
        setError(e.message);
      } finally {
        if (alive) setLoading(false);
      }
    })();
    return () => { alive = false; };
  }, [byIdUrl]);

  useEffect(() => {
    if (!isLoggedIn) { setMyEnrollments([]); return; }
    let alive = true;
    (async () => {
      try {
        const mine = await getMyEnrollments(token);
        if (alive) setMyEnrollments(mine || []);
      } catch (e) {
        // ignore
      }
    })();
    return () => { alive = false; };
  }, [isLoggedIn, token]);

  const isEnrolled = !!myEnrollments.find(e => Number(e.moduleId) === Number(id));
  const isFirstChoice = !!myEnrollments.find(e => Number(e.moduleId) === Number(id) && e.firstChoice);

  async function handleEnroll() {
    try {
      await apiEnroll(Number(id), token);
      const mine = await getMyEnrollments(token);
      setMyEnrollments(mine || []);
      alert('Inschrijving opgeslagen');
    } catch (e) {
        if (e.message && (e.message.includes('maximaal 3 modules') || e.message.includes('3 modules'))) {
          setError('Je bent al in 3 modules ingeschreven.');
        } else {
          setError('Kon niet inschrijven. Probeer opnieuw.');
        }
    }
  }

  async function handleToggleFirstChoice() {
    try {
      await setFirstChoice(Number(id), !isFirstChoice, token);
      const mine = await getMyEnrollments(token);
      setMyEnrollments(mine || []);
    } catch (e) {
      alert(e.message);
    }
  }

  if (loading) return <p>Loading…</p>;
  if (error) return <p style={{ color: 'crimson' }}>Error: {error}</p>;
  if (!mod) return <p>Not found</p>;

  return (
    <div>
      <p><Link to="/">← Back to list</Link></p>
      <h2>Module {mod.id}</h2>

      <div>
          <h3>{mod.name}</h3>
          {mod.shortdescription && <p><em>{mod.shortdescription}</em></p>}
          {mod.description && <p>{mod.description}</p>}
          {mod.content && <p><strong>Content:</strong> {mod.content}</p>}
          <ul>
            {mod.studycredit != null && <li>Study credit: {mod.studycredit}</li>}
            {mod.location && <li>Location: {mod.location}</li>}
            {mod.level && <li>Level: {mod.level}</li>}
            {mod.learningoutcomes && <li>Learning outcomes: {mod.learningoutcomes}</li>}
          </ul>
          {isLoggedIn && (
            <div style={{ display: 'flex', gap: 8 }}>
              {!isEnrolled && <button onClick={handleEnroll}>Inschrijven</button>}
              {isEnrolled && (
                <button onClick={handleToggleFirstChoice}>
                  {isFirstChoice ? 'Verwijder eerste keuze' : 'Maak eerste keuze'}
                </button>
              )}
            </div>
          )}
        </div>
    </div>
  );
}
