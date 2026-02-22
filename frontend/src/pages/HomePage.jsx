import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import styles from './HomePage.module.css';

export default function HomePage() {
  return (
    <div className={styles.page}>
      <Navbar />
      <main className={styles.hero}>
        <h1 className={styles.title}>MAAFAI Academy</h1>
        <p className={styles.description}>
          Welcome to MAAFAI Academy – your gateway to excellence in learning and growth.
          Join our community of scholars and discover your potential.
        </p>
        <Link to="/login" className={styles.cta}>
          Login
        </Link>
      </main>
    </div>
  );
}
