import { FormEvent, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { apiPost, endpoints } from '../services/api';
import { useAuth } from '../services/auth';

type LoginResponse = { access_token?: string };

export default function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { setToken, isLoggedIn } = useAuth();

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError('');
    try {
      const res = await apiPost<LoginResponse>(endpoints.login, { username, password });
      if (res?.access_token) {
        setToken(res.access_token);
        navigate('/');
      } else {
        setError('Invalid response from server');
      }
    } catch (e: any) {
      // Try to parse error for more specific messages
      let msg = e?.message || '';
      if (msg.includes('401') || msg.toLowerCase().includes('unauthorized')) {
        setError('Unauthorized: Wrong credentials');
      } else if (msg.includes('404') || msg.toLowerCase().includes('not found')) {
        setError('User does not exist');
      } else if (msg) {
        setError(msg);
      } else {
        setError('Login mislukt');
      }
    }
  }

  if (isLoggedIn) return <p>Already logged in.</p>;

  return (
    <div>
      <h2>Login</h2>
      <form onSubmit={handleSubmit} style={{ display: 'grid', gap: 8, maxWidth: 320 }}>
        <label style={{ display: 'grid', gap: 4 }}>
          <span>Username</span>
          <input value={username} onChange={(e) => setUsername(e.target.value)} required />
        </label>
        <label style={{ display: 'grid', gap: 4 }}>
          <span>Password</span>
          <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
        </label>
        <button type="submit">Login</button>
        {error && <p style={{ color: 'crimson' }}>{error}</p>}
      </form>
    </div>
  );
}
