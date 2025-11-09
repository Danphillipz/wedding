import Link from 'next/link';
import styles from './Navigation.module.css';

export default function Navigation() {
  return (
    <nav className={styles.nav}>
      <div className={styles.container}>
        <Link href="/" className={styles.logo}>
          Amy & Dan
        </Link>
        <ul className={styles.navList}>
          <li>
            <Link href="/" className={styles.navLink}>
              Home
            </Link>
          </li>
          <li>
            <Link href="/rsvp" className={styles.navLink}>
              RSVP
            </Link>
          </li>
          <li>
            <Link href="/about" className={styles.navLink}>
              About
            </Link>
          </li>
        </ul>
      </div>
    </nav>
  );
}
