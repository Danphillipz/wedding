'use client';

import { useState, FormEvent } from 'react';
import { searchGuest, guestlist } from '@/lib/guestlist';
import { isBeforeDeadline } from '@/lib/deadline';
import type { Guest, SearchResult } from '@/types';
import styles from './GuestSearch.module.css';

interface GuestSearchProps {
  onGuestFound: (guest: Guest) => void;
}

export default function GuestSearch({ onGuestFound }: GuestSearchProps) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [postalCode, setPostalCode] = useState('');
  const [searchResult, setSearchResult] = useState<SearchResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();

    if (!name.trim()) {
      return;
    }

    setIsLoading(true);

    // Check deadline first
    if (!isBeforeDeadline()) {
      setSearchResult({
        status: 'deadline-passed',
        message:
          'The RSVP deadline has passed (May 2, 2026). Please contact Amy and Dan directly if you need to update your response.',
      });
      setIsLoading(false);
      return;
    }

    // Perform search
    const result = searchGuest(
      guestlist,
      name,
      email || undefined,
      postalCode || undefined
    );

    setSearchResult(result);
    setIsLoading(false);

    // Notify parent if guest found
    if (result.status === 'found' && result.guest) {
      onGuestFound(result.guest);
    }
  };

  return (
    <div className={styles.guestSearch}>
      <form onSubmit={handleSubmit} className={styles.form}>
        <div className={styles.formGroup}>
          <label htmlFor="name" className={styles.label}>
            Full Name
          </label>
          <input
            type="text"
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className={styles.input}
            placeholder="Enter your full name"
            required
          />
        </div>

        {searchResult?.status === 'multiple-matches' && (
          <>
            <div className={styles.disambiguationMessage}>
              <p>{searchResult.message}</p>
              <p>Please provide your email address or postal code:</p>
            </div>

            <div className={styles.formGroup}>
              <label htmlFor="email" className={styles.label}>
                Email Address (optional)
              </label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className={styles.input}
                placeholder="your.email@example.com"
              />
            </div>

            <div className={styles.formGroup}>
              <label htmlFor="postalCode" className={styles.label}>
                Postal Code (optional)
              </label>
              <input
                type="text"
                id="postalCode"
                value={postalCode}
                onChange={(e) => setPostalCode(e.target.value)}
                className={styles.input}
                placeholder="B79 7XX"
              />
            </div>
          </>
        )}

        <button
          type="submit"
          className={styles.button}
          disabled={isLoading}
        >
          {isLoading ? 'Searching...' : 'Search'}
        </button>
      </form>

      {searchResult && (
        <div
          className={`${styles.result} ${styles[searchResult.status]}`}
          data-testid="search-result"
          data-status={searchResult.status}
        >
          {searchResult.status === 'found' && (
            <div className={styles.success} data-testid="result-found">
              <h3>{searchResult.message}</h3>
            </div>
          )}

          {searchResult.status === 'not-found' && (
            <div className={styles.error} data-testid="result-not-found">
              <p>{searchResult.message}</p>
            </div>
          )}

          {searchResult.status === 'deadline-passed' && (
            <div className={styles.warning} data-testid="result-deadline">
              <p>{searchResult.message}</p>
            </div>
          )}

          {searchResult.status === 'multiple-matches' && (
            <div className={styles.info} data-testid="result-multiple">
              <p>Found {searchResult.matches?.length} guests with that name</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
