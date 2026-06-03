import { useEffect, useState } from 'react';
import { AdminLeads } from './pages/AdminLeads';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:4000';

function App() {
  const [email, setEmail] = useState('admin@example.com');
  const [password, setPassword] = useState('password');
  const [token, setToken] = useState(localStorage.getItem('token') || '');
  const [me, setMe] = useState(null);
  const [view, setView] = useState('dashboard');

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch(`${API_URL}/api/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      if (res.ok) {
        setToken(data.token);
        localStorage.setItem('token', data.token);
      } else {
        alert(data.message || 'Login failed');
      }
    } catch (err) {
      console.error(err);
      alert('Network error');
    }
  };

  useEffect(() => {
    if (!token) return;
    const fetchMe = async () => {
      try {
        const res = await fetch(`${API_URL}/api/auth/me`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const data = await res.json();
        if (res.ok) {
          setMe(data);
        } else {
          setMe(null);
        }
      } catch (err) {
        console.error(err);
      }
    };
    fetchMe();
  }, [token]);

  if (!token || !me) {
    return (
      <div style={{ maxWidth: 400, margin: '40px auto', fontFamily: 'sans-serif' }}>
        <h1>SchoolSync Login</h1>
        <form onSubmit={handleLogin}>
          <div style={{ marginBottom: 12 }}>
            <label>Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              style={{ width: '100%', padding: 8 }}
            />
          </div>
          <div style={{ marginBottom: 12 }}>
            <label>Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              style={{ width: '100%', padding: 8 }}
            />
          </div>
          <button type="submit" style={{ padding: '8px 16px' }}>
            Login
          </button>
        </form>
        <p style={{ marginTop: 16, fontSize: 12 }}>
          Demo: any email/password will log in as an ADMIN user.
        </p>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: 1000, margin: '40px auto', fontFamily: 'sans-serif' }}>
      <h1>SchoolSync Admin</h1>
      <p>Logged in as {me.email} ({me.role})</p>
      <button
        onClick={() => {
          localStorage.removeItem('token');
          setToken('');
          setMe(null);
        }}
        style={{ padding: '6px 12px', marginBottom: 24 }}
      >
        Logout
      </button>

      <nav style={{ marginBottom: 24 }}>
        <button onClick={() => setView('dashboard')} style={{ marginRight: 8 }}>
          Dashboard
        </button>
        <button onClick={() => setView('leads')}>
          CRM Leads
        </button>
      </nav>

      {view === 'dashboard' && (
        <div>
          <h2>Dashboard</h2>
          <p>Welcome to the admin dashboard. You can manage CRM leads and, later, attendance, tests, and more.</p>
        </div>
      )}

      {view === 'leads' && <AdminLeads />}
    </div>
  );
}

export default App;
