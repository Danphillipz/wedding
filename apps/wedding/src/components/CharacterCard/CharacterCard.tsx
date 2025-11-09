'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';
import styles from './CharacterCard.module.css';

interface CharacterCardProps {
  name: string;
  quote: string;
  description: string;
  imageSrc: string;
  imageAlt: string;
  delay?: number;
}

export default function CharacterCard({
  name,
  quote,
  description,
  imageSrc,
  imageAlt,
  delay = 0,
}: CharacterCardProps) {
  return (
    <motion.section
      className={styles.card}
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true, margin: '-100px' }}
      transition={{ duration: 0.8, delay }}
    >
      <div className={styles.imageContainer}>
        <motion.div
          initial={{ scale: 1.1, opacity: 0 }}
          whileInView={{ scale: 1, opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1.2, delay: delay + 0.2 }}
          className={styles.imageWrapper}
        >
          <Image
            src={imageSrc}
            alt={imageAlt}
            fill
            className={styles.image}
            sizes="(max-width: 768px) 100vw, 50vw"
          />
        </motion.div>
        <motion.div
          className={styles.overlay}
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: delay + 0.4 }}
        >
          <blockquote className={styles.quote}>&ldquo;{quote}&rdquo;</blockquote>
        </motion.div>
      </div>
      <motion.div
        className={styles.content}
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8, delay: delay + 0.6 }}
      >
        <h2 className={styles.name}>{name}</h2>
        <p className={styles.description}>{description}</p>
      </motion.div>
    </motion.section>
  );
}
