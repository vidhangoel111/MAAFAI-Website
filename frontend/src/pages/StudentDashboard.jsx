import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import { useAuth } from '../context/AuthContext';
import styles from './StudentDashboard.module.css';

export default function StudentDashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();

  return (
    <div className={styles.page}>
      <Navbar />
      <main className={styles.main}>
        <div className={styles.dashboard}>
          <h1>Student Dashboard</h1>
          <section className={styles.welcome}>
            <h2>Welcome, {user?.name || 'Student'}!</h2>
            <p className={styles.email}>{user?.email}</p>
          </section>
          <section className={styles.info}>
            <div className={styles.row}>
              <span className={styles.label}>Batch Name</span>
              <span>{user?.batchName || 'Not assigned'}</span>
            </div>
            <div className={styles.row}>
              <span className={styles.label}>Coach Name</span>
              <span>{user?.coachName || 'Not assigned'}</span>
            </div>
            <div className={styles.row}>
              <span className={styles.label}>Attendance</span>
              <span>{user?.attendance ?? 0}%</span>
            </div>
            <div className={styles.row}>
              <span className={styles.label}>Fee Status</span>
              <span className={user?.feeStatus === 'Paid' ? styles.paid : styles.pending}>
                {user?.feeStatus || 'Pending'}
              </span>
            </div>
          </section>
          <section className={styles.actions}>
            <button onClick={() => navigate('/')} className={styles.btn}>
              Back to Home
            </button>
          </section>
        </div>
      </main>
    </div>
  );
}
