import Image from 'next/image';
import styles from './page.module.css';

export default function HomePage() {
  return (
    <main className={styles.homepage}>
      <section className={styles.heroSection}>
        <div className={styles.heroImageContainer}>
          <Image
            src="/images/hero.jpg"
            alt="Amy and Dan's wedding celebration"
            fill
            priority
            className={styles.heroImage}
          />
        </div>
      </section>

      <section className={styles.announcementSection}>
        <h1 className={styles.announcement}>We&apos;re getting married</h1>
        <p className={styles.weddingDate}>Thursday July 2nd 2026</p>
        <p className={styles.coupleNames}>Amy &amp; Dan</p>
      </section>
    </main>
  );
}
