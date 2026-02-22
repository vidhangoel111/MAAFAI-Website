import { Routes, Route, Navigate } from 'react-router-dom';
import LandingPage from './pages/LandingPage';
import StudentLogin from './pages/StudentLogin';
import AdminLogin from './pages/AdminLogin';
import StudentDashboard from './pages/StudentDashboard';
import AdminDashboard from './pages/AdminDashboard';
import RoleProtectedRoute from './components/RoleProtectedRoute';

function App() {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/student-login" element={<StudentLogin />} />
      <Route path="/admin-login" element={<AdminLogin />} />
      <Route
        path="/student-dashboard"
        element={
          <RoleProtectedRoute role="student">
            <StudentDashboard />
          </RoleProtectedRoute>
        }
      />
      <Route
        path="/admin-dashboard"
        element={
          <RoleProtectedRoute role="admin">
            <AdminDashboard />
          </RoleProtectedRoute>
        }
      />
      <Route path="/login" element={<Navigate to="/" replace />} />
      <Route path="/dashboard" element={<Navigate to="/" replace />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default App;
