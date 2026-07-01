import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './hooks/useAuth';
import Layout from './components/Layout';
import Login from './components/Login';
import Register from './components/Register';
import Dashboard from './components/Dashboard';

function Protected({ token, children }: { token: string | null; children: JSX.Element }) {
  if (!token) return <Navigate to="/login" replace />;
  return children;
}

export default function App() {
  const { token, user, login, register, logout } = useAuth();

  return (
    <Routes>
      <Route path="/login" element={token ? <Navigate to="/" replace /> : <Login onLogin={login} />} />
      <Route path="/register" element={token ? <Navigate to="/" replace /> : <Register onRegister={register} />} />
      <Route
        path="/*"
        element={
          <Protected token={token}>
            <Layout user={user} onLogout={logout}>
              <Routes>
                <Route path="/" element={<Dashboard token={token!} />} />
                <Route path="*" element={<Navigate to="/" replace />} />
              </Routes>
            </Layout>
          </Protected>
        }
      />
    </Routes>
  );
}
