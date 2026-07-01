import { ReactNode } from 'react';
import { Link, useNavigate } from 'react-router-dom';

const styles = {
  container: { minHeight: '100vh', background: '#0f172a', color: '#e2e8f0' },
  header: { background: '#1e293b', borderBottom: '1px solid #334155', padding: '0 24px', display: 'flex', alignItems: 'center', height: 60 },
  logo: { color: '#059669', fontSize: 22, fontWeight: 700, textDecoration: 'none' },
  nav: { marginLeft: 32, display: 'flex', gap: 24 },
  link: { color: '#94a3b8', textDecoration: 'none', fontSize: 14 },
  userArea: { marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: 12 },
  userName: { color: '#cbd5e1', fontSize: 14 },
  btn: { background: 'none', border: '1px solid #475569', color: '#e2e8f0', borderRadius: 6, padding: '6px 14px', cursor: 'pointer', fontSize: 13 },
  main: { padding: 24, maxWidth: 1280, margin: '0 auto' },
};

export default function Layout({ user, onLogout, children }: { user: any; onLogout: () => void; children: ReactNode }) {
  const navigate = useNavigate();
  return (
    <div style={styles.container}>
      <header style={styles.header}>
        <Link to="/" style={styles.logo}>AssetGuard OG</Link>
        <nav style={styles.nav}>
          <Link to="/" style={styles.link}>Dashboard</Link>
        </nav>
        <div style={styles.userArea}>
          <span style={styles.userName}>{user?.name}</span>
          <button style={styles.btn} onClick={() => { onLogout(); navigate('/login'); }}>Logout</button>
        </div>
      </header>
      <main style={styles.main}>{children}</main>
    </div>
  );
}
