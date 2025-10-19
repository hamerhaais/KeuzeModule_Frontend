import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { apiGet, apiPost, endpoints } from '../services/api.js';
import { useAuth } from '../services/auth.js';

export default function AddModule() {
  const navigate = useNavigate();
  const { token, isLoggedIn } = useAuth();
  const [list, setList] = useState([]);
  const [form, setForm] = useState({ id: '', name: '', shortdescription: '', description: '', content: '', studycredit: '', location: '', contact_id: '', level: '', learningoutcomes: '' });
  const [error, setError] = useState('');

  useEffect(() => {
    (async () => {
      try {
        const data = await apiGet(endpoints.modules);
        setList(data);
        const maxId = data.reduce((mx, m) => Math.max(mx, Number(m.id) || 0), 0);
        setForm((f) => ({ ...f, id: maxId + 1 }));
      } catch (e) {
        setError(e.message);
      }
    })();
  }, []);

  if (!isLoggedIn) return <p>You must be logged in to add modules.</p>;
  if (error) return <p style={{ color: 'crimson' }}>Error: {error}</p>;

  async function handleSubmit(e) {
    e.preventDefault();
    try {
      const payload = {
        id: Number(form.id),
        name: form.name,
        shortdescription: form.shortdescription || undefined,
        description: form.description || undefined,
        content: form.content || undefined,
        studycredit: form.studycredit !== '' ? Number(form.studycredit) : undefined,
        location: form.location || undefined,
        contact_id: form.contact_id !== '' ? Number(form.contact_id) : undefined,
        level: form.level || undefined,
        learningoutcomes: form.learningoutcomes || undefined,
      };
      const created = await apiPost(endpoints.modules, payload, token);
      navigate(`/modules/${created?.id ?? payload.id}`);
    } catch (e) {
      alert(e.message);
    }
  }

  return (
    <div>
      <h2>Add Module</h2>
      <form onSubmit={handleSubmit} style={{ display: 'grid', gap: 8, maxWidth: 640 }}>
        {[
          ['id','number'],
          ['name','text'],
          ['shortdescription','text'],
          ['description','text'],
          ['content','text'],
          ['studycredit','number'],
          ['location','text'],
          ['contact_id','number'],
          ['level','text'],
          ['learningoutcomes','text'],
        ].map(([key, type]) => (
          <label key={key} style={{ display: 'grid', gap: 4 }}>
            <span style={{ fontWeight: 600 }}>{key}</span>
            <input type={type}
              value={form[key]}
              onChange={(e) => setForm((f) => ({ ...f, [key]: e.target.value }))}
              required={key === 'id' || key === 'name'}
            />
          </label>
        ))}
        <div style={{ display: 'flex', gap: 8 }}>
          <button type="submit">Create</button>
          <button type="button" onClick={() => navigate('/')}>Cancel</button>
        </div>
      </form>
    </div>
  );
}
