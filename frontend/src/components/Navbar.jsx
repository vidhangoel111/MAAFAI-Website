import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import styles from './Navbar.module.css';

export default function Navbar() {
  const { isAuthenticated, logout, isStudent, isAdmin } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <nav className={styles.navbar}>
      <Link to="/" className={styles.logo}>
        MAAFAI
      </Link>
      <ul className={styles.links}>
        <li><a href="/#home">Home</a></li>
        <li><a href="/#about">About</a></li>
        <li><a href="/#batch-details">Batch Details</a></li>
        <li><a href="/#awards">Awards</a></li>
        <li><a href="/#our-students">Our Students</a></li>
        <li><a href="/#gallery">Gallery</a></li>
        <li><a href="/#images-videos">Images & Videos</a></li>
        {!isAuthenticated ? (
          <>
            <li><Link to="/student-login">Student Login</Link></li>
            <li><Link to="/admin-login">Admin Login</Link></li>
          </>
        ) : (
          <>
            {isStudent && <li><Link to="/student-dashboard">Dashboard</Link></li>}
            {isAdmin && <li><Link to="/admin-dashboard">Dashboard</Link></li>}
            <li>
              <button className={styles.logoutBtn} onClick={handleLogout}>
                Logout
              </button>
            </li>
          </>
        )}
      </ul>
    </nav>
  );
}
