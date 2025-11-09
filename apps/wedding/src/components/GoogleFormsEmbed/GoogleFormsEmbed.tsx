'use client';

import styles from './GoogleFormsEmbed.module.css';
import type { Guest } from '@/types';

interface GoogleFormsEmbedProps {
  guest: Guest;
}

export default function GoogleFormsEmbed({ guest }: GoogleFormsEmbedProps) {
  // TODO: Replace with actual Google Form ID once created
  const formId = 'PLACEHOLDER_FORM_ID';
  
  // Generate pre-fill URL with guest name
  // Google Forms pre-fill format: entry.ENTRY_ID=value
  // TODO: Replace entry.123456789 with actual entry ID for Name field
  const encodedName = encodeURIComponent(guest.name);
  const formUrl = `https://docs.google.com/forms/d/e/${formId}/viewform?usp=pp_url&entry.123456789=${encodedName}`;

  return (
    <div className={styles.embedContainer}>
      <iframe
        src={formUrl}
        width="100%"
        frameBorder="0"
        title="RSVP Form"
        className={styles.iframe}
      >
        Loading form...
      </iframe>
    </div>
  );
}
