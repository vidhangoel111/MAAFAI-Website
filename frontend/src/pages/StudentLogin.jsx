import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import { useAuth } from '../context/AuthContext';
import { studentApi } from '../api/api';
import styles from './StudentLogin.module.css';

export default function StudentLogin() {
  const [mode, setMode] = useState('request'); // 'request' | 'login'
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleRegisterRequest = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);
    try {
      await studentApi.registerRequest(name, email, password);
      setSuccess('Registration request submitted. Please wait for admin approval to login.');
      setName('');
      setEmail('');
      setPassword('');
    } catch (err) {
      setError(err.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);
    try {
      const data = await studentApi.login(email, password);
      login(data.user, data.token, 'student');
      navigate('/student-dashboard');
    } catch (err) {
      setError(err.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.page}>
      <Navbar />
      <main className={styles.main}>
        <div className={styles.card}>
          <div className={styles.tabs}>
            <button
              className={mode === 'request' ? styles.tabActive : styles.tab}
              onClick={() => { setMode('request'); setError(''); setSuccess(''); }}
            >
              Request Access
            </button>
            <button
              className={mode === 'login' ? styles.tabActive : styles.tab}
              onClick={() => { setMode('login'); setError(''); setSuccess(''); }}
            >
              Login
            </button>
          </div>

          {mode === 'request' ? (
            <form onSubmit={handleRegisterRequest} className={styles.form}>
              <h1>Student Registration Request</h1>
              <p className={styles.subtitle}>
                Submit your details. Admin will approve your access.
              </p>
              {error && <p className={styles.error}>{error}</p>}
              {success && <p className={styles.success}>{success}</p>}
              <div className={styles.field}>
                <label htmlFor="name">Name</label>
                <input
                  id="name"
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Your full name"
                  required
                />
              </div>
              <div className={styles.field}>
                <label htmlFor="email">Email</label>
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="your@email.com"
                  required
                />
              </div>
              <div className={styles.field}>
                <label htmlFor="password">Password</label>
                <input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                />
              </div>
              <button type="submit" className={styles.submit} disabled={loading}>
                {loading ? 'Submitting...' : 'Submit Request'}
              </button>
            </form>
          ) : (
            <form onSubmit={handleLogin} className={styles.form}>
              <h1>Student Login</h1>
              <p className={styles.subtitle}>
                Login with your approved account.
              </p>
              {error && <p className={styles.error}>{error}</p>}
              <div className={styles.field}>
                <label htmlFor="login-email">Email</label>
                <input
                  id="login-email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="your@email.com"
                  required
                />
              </div>
              <div className={styles.field}>
                <label htmlFor="login-password">Password</label>
                <input
                  id="login-password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                />
              </div>
              <button type="submit" className={styles.submit} disabled={loading}>
                {loading ? 'Logging in...' : 'Login'}
              </button>
            </form>
          )}

          <p className={styles.back}>
            <Link to="/">← Back to Home</Link>
          </p>
        </div>
      </main>
    </div>
  );
}
