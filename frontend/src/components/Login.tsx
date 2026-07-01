import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

const s = {
  wrapper: { minHeight: '100vh', background: '#0f172a', display: 'flex', alignItems: 'center', justifyContent: 'center' },
  card: { background: '#1e293b', borderRadius: 12, padding: 40, width: 400, border: '1px solid #334155' },
  title: { color: '#059669', fontSize: 28, fontWeight: 700, marginBottom: 4 },
  subtitle: { color: '#64748b', fontSize: 14, marginBottom: 24 },
  label: { color: '#94a3b8', fontSize: 13, marginBottom: 6, display: 'block' },
  input: { width: '100%', padding: '10px 12px', background: '#0f172a', border: '1px solid #334155', borderRadius: 8, color: '#e2e8f0', fontSize: 14, marginBottom: 16, outline: 'none', boxSizing: 'border-box' as const },
  btn: { width: '100%', padding: 12, background: '#059669', border: 'none', borderRadius: 8, color: '#fff', fontSize: 15, fontWeight: 600, cursor: 'pointer' },
  link: { color: '#059669', fontSize: 13, textAlign: 'center' as const, marginTop: 16 },
};

export default function Login({ onLogin }: { onLogin: (e: string, p: string) => Promise<any> }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await onLogin(email, password);
      navigate('/');
    } catch { setError('Invalid email or password'); }
  };

  return (
    <div style={s.wrapper}>
      <form style={s.card} onSubmit={handleSubmit}>
        <div style={s.title}>AssetGuard OG</div>
        <div style={s.subtitle}>Sign in to your account</div>
        {error && <div style={{ color: '#ef4444', fontSize: 13, marginBottom: 12 }}>{error}</div>}
        <label style={s.label}>Email</label>
        <input style={s.input} type="email" value={email} onChange={e => setEmail(e.target.value)} required />
        <label style={s.label}>Password</label>
        <input style={s.input} type="password" value={password} onChange={e => setPassword(e.target.value)} required />
        <button style={s.btn} type="submit">Sign In</button>
        <div style={s.link}><Link to="/register" style={{ color: '#059669' }}>Create an account</Link></div>
      </form>
    </div>
  );
}
