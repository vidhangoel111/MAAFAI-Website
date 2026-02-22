import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function RoleProtectedRoute({ children, role }) {
  const { isAuthenticated, isStudent, isAdmin, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div style={{ padding: '3rem', textAlign: 'center', color: 'var(--text-muted)' }}>
        Loading...
      </div>
    );
  }

  if (!isAuthenticated) {
    const redirectTo = role === 'student' ? '/student-login' : '/admin-login';
    return <Navigate to={redirectTo} state={{ from: location }} replace />;
  }

  if (role === 'student' && !isStudent) {
    return <Navigate to="/admin-dashboard" replace />;
  }

  if (role === 'admin' && !isAdmin) {
    return <Navigate to="/student-dashboard" replace />;
  }

  return children;
}
