import { useState, useEffect } from 'react';
import { galleryApi } from '../api/api';
import styles from './Gallery.module.css';

export default function Gallery() {
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const res = await galleryApi.getImages();
        setImages(res.images || []);
      } catch {
        setImages([]);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  const displayImages = images.length > 0
    ? images
    : [
        { url: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=400' },
        { url: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400' },
        { url: 'https://images.unsplash.com/photo-1594381898411-846e7d193883?w=400' },
        { url: 'https://images.unsplash.com/photo-1541534741688-6078c6bfb5c5?w=400' },
        { url: 'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=400' }
      ];

  const imgUrls = displayImages.map(img =>
    img.url.startsWith('http') ? img.url : (img.url.startsWith('/') ? '' : '/') + img.url
  );

  return (
    <section id="gallery" className={styles.section}>
      <h2 className={styles.title}>Our Training Gallery</h2>
      {loading ? (
        <p className={styles.loading}>Loading gallery...</p>
      ) : (
        <div className={styles.scrollWrap}>
          <div className={styles.scrollTrack}>
            {[...imgUrls, ...imgUrls].map((src, i) => (
              <div key={i} className={styles.imgWrap}>
                <img src={src} alt={`Training ${i + 1}`} loading="lazy" />
              </div>
            ))}
          </div>
        </div>
      )}
    </section>
  );
}
