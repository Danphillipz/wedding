'use client';

import Image from 'next/image';
import { motion } from 'framer-motion';
import styles from './page.module.css';
import { FadeIn, ScaleIn } from '@/components/animations';

export default function HomePage() {
  return (
    <main className={styles.homepage}>
      <section className={styles.heroSection}>
        <motion.div
          className={styles.heroImageContainer}
          initial={{ opacity: 0, scale: 1.1 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1.2, ease: 'easeOut' }}
        >
          <Image
            src="/wedding/images/hero.jpg"
            alt="Amy and Dan's wedding celebration"
            fill
            priority
            className={styles.heroImage}
          />
        </motion.div>
      </section>

      <section className={styles.announcementSection}>
        <FadeIn delay={0.3} duration={0.8}>
          <h1 className={styles.announcement}>We&apos;re getting married</h1>
        </FadeIn>
        <ScaleIn delay={0.6} duration={0.6}>
          <p className={styles.weddingDate}>Thursday July 2nd 2026</p>
        </ScaleIn>
        <FadeIn delay={0.9} duration={0.8} direction="up" distance={20}>
          <p className={styles.coupleNames}>Amy &amp; Dan</p>
        </FadeIn>
      </section>
    </main>
  );
}
