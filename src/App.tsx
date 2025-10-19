import { Link, Route, Routes } from 'react-router-dom';
import './App.css';
import ModulesList from './components/ModulesList';
import ModuleDetail from './components/ModuleDetail';
import Login from './components/Login';
import MijnInschrijvingen from './components/MijnInschrijvingen';
import FAQ from './components/FAQ';
import { useAuth } from './services';

export default function App() {
  const { isLoggedIn, setToken } = useAuth();
  return (
    <div className="app-container">
      <nav style={{ display: 'flex', gap: 12, padding: 12, borderBottom: '1px solid #e5e5e5' }}>
        <Link to="/">Home</Link>
        <Link to="/mijn-inschrijvingen">Mijn inschrijvingen</Link>
        <Link to="/faq">FAQ</Link>
        {!isLoggedIn ? (
          <Link to="/login">Login</Link>
        ) : (
          <button onClick={() => setToken('')}>Logout</button>
        )}
      </nav>
      <main style={{ padding: 16 }}>
        <Routes>
          <Route path="/" element={<ModulesList />} />
          <Route path="/modules/:id" element={<ModuleDetail />} />
          <Route path="/mijn-inschrijvingen" element={<MijnInschrijvingen />} />
          <Route path="/faq" element={<FAQ />} />
          <Route path="/login" element={<Login />} />
        </Routes>
      </main>
    </div>
  );
}
