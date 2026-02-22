import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Gallery from '../components/Gallery';
import { contentApi } from '../api/api';
import styles from './LandingPage.module.css';

const DEFAULT_ABOUT = 'MAAFAI Academy is dedicated to nurturing talent and fostering excellence. Our experienced coaches and structured programs help you achieve your full potential in a disciplined, supportive environment.';
const DEFAULT_BATCH = 'We offer multiple batches throughout the year. Each batch is led by qualified coaches and follows a comprehensive curriculum.\n• Batch 2024-A – Morning sessions\n• Batch 2024-B – Evening sessions';
const DEFAULT_AWARDS = 'Our students and academy have been recognized for excellence in training and performance.\n• Excellence in Training Award 2023\n• Outstanding Student Achievement 2024';

export default function LandingPage() {
  const [content, setContent] = useState(null);

  useEffect(() => {
    contentApi.getContent()
      .then((res) => setContent(res.content || {}))
      .catch(() => setContent({}));
  }, []);

  const aboutUs = content?.aboutUs || DEFAULT_ABOUT;
  const batchDetails = content?.batchDetails || DEFAULT_BATCH;
  const awards = content?.awards || DEFAULT_AWARDS;

  const batchParts = batchDetails.split('\n').filter(Boolean);
  const awardParts = awards.split('\n').filter(Boolean);

  return (
    <div className={styles.page}>
      <Navbar />
      <main>
        <section id="home" className={styles.hero}>
          <div className={styles.heroOverlay} />
          <div className={styles.heroContent}>
            <h1 className={styles.title}>MAAFAI Martial Arts Academy</h1>
            <p className={styles.tagline}>Strength • Discipline • Excellence</p>
            <p className={styles.description}>
              Train with the best. Forge your mind and body.
            </p>
            <div className={styles.ctaGroup}>
              <Link to="/student-login" className={styles.ctaPrimary}>
                Join Now
              </Link>
              <Link to="/admin-login" className={styles.ctaSecondary}>
                Admin Login
              </Link>
            </div>
          </div>
        </section>

        <section id="about" className={styles.section}>
          <h2 className={styles.sectionTitle}>About Us</h2>
          <div className={styles.sectionContent}>
            {aboutUs.split('\n').map((p, i) => (
              <p key={i} className={styles.sectionText}>{p}</p>
            ))}
          </div>
        </section>

        <section id="batch-details" className={styles.section}>
          <h2 className={styles.sectionTitle}>Batch Details</h2>
          <div className={styles.sectionContent}>
            {batchParts.map((line, i) => {
              const trimmed = line.trim();
              const isBullet = trimmed.startsWith('•') || trimmed.startsWith('-');
              const text = isBullet ? trimmed.replace(/^[•\-]\s*/, '') : trimmed;
              return <p key={i} className={isBullet ? styles.bulletPoint : styles.sectionText}>{isBullet ? '• ' : ''}{text}</p>;
            })}
          </div>
        </section>

        <section id="awards" className={styles.section}>
          <h2 className={styles.sectionTitle}>Awards</h2>
          <div className={styles.sectionContent}>
            {awardParts.map((line, i) => {
              const trimmed = line.trim();
              const isBullet = trimmed.startsWith('•') || trimmed.startsWith('-');
              const text = isBullet ? trimmed.replace(/^[•\-]\s*/, '') : trimmed;
              return <p key={i} className={isBullet ? styles.bulletPoint : styles.sectionText}>{isBullet ? '• ' : ''}{text}</p>;
            })}
          </div>
        </section>

        <section id="our-students" className={styles.section}>
          <h2 className={styles.sectionTitle}>Our Students</h2>
          <p className={styles.sectionText}>
            Our students come from diverse backgrounds and excel in their chosen disciplines.
          </p>
        </section>

        <Gallery />

        <section id="images-videos" className={styles.section}>
          <h2 className={styles.sectionTitle}>Images & Videos</h2>
          <p className={styles.sectionText}>
            Explore our academy events, training sessions, and achievements.
          </p>
        </section>
      </main>
    </div>
  );
}
