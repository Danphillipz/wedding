'use client';

import { useState } from 'react';
import GuestSearch from '@/components/GuestSearch/GuestSearch';
import GoogleFormsEmbed from '@/components/GoogleFormsEmbed/GoogleFormsEmbed';
import { getRSVPDeadline } from '@/lib/deadline';
import type { Guest } from '@/types';
import styles from './page.module.css';

export default function RsvpPage() {
  const [foundGuest, setFoundGuest] = useState<Guest | null>(null);
  const deadline = getRSVPDeadline();

  const formattedDeadline = deadline.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  return (
    <main className={styles.main}>
      <div className={styles.container}>
        <h1 className={styles.heading}>RSVP</h1>
        
        <div className={styles.deadline}>
          <p>Please RSVP by {formattedDeadline}</p>
        </div>

        <div className={styles.searchSection}>
          <GuestSearch onGuestFound={setFoundGuest} />
        </div>

        {foundGuest && (
          <div className={styles.formSection}>
            <GoogleFormsEmbed guest={foundGuest} />
          </div>
        )}
      </div>
    </main>
  );
}
