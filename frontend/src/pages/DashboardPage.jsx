import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import { useAuth } from '../context/AuthContext';
import { getUser } from '../api/auth';
import styles from './DashboardPage.module.css';

export default function DashboardPage() {
  const { user, token, logout, isAuthenticated } = useAuth();
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    if (!isAuthenticated || !token) {
      navigate('/login');
      return;
    }

    async function fetchUser() {
      try {
        const data = await getUser(token);
        setUserData(data.user);
      } catch {
        logout();
        navigate('/login');
      } finally {
        setLoading(false);
      }
    }

    fetchUser();
  }, [token, isAuthenticated, logout, navigate]);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  if (loading) {
    return (
      <div className={styles.page}>
        <Navbar />
        <main className={styles.main}>
          <p className={styles.loading}>Loading...</p>
        </main>
      </div>
    );
  }

  const displayUser = userData || user;

  return (
    <div className={styles.page}>
      <Navbar />
      <main className={styles.main}>
        <div className={styles.dashboard}>
          <h1>Dashboard</h1>
          <section className={styles.welcome}>
            <h2>Welcome, {displayUser?.name || 'User'}!</h2>
            <p className={styles.email}>{displayUser?.email}</p>
          </section>
          <section className={styles.info}>
            <h3>Academy Information</h3>
            <ul>
              <li><strong>Academy:</strong> MAAFAI Academy</li>
              <li><strong>Mission:</strong> Excellence in learning and growth</li>
              <li><strong>Status:</strong> Active member</li>
            </ul>
          </section>
          <section className={styles.navOptions}>
            <h3>Quick Navigation</h3>
            <div className={styles.buttons}>
              <button onClick={() => navigate('/')} className={styles.navBtn}>
                Home
              </button>
              <button onClick={handleLogout} className={styles.logoutBtn}>
                Logout
              </button>
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}
