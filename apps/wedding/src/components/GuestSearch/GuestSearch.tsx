'use client';

import { useState, FormEvent } from 'react';
import { searchGuest } from '@/lib/guestlist';
import { isBeforeDeadline } from '@/lib/deadline';
import { decryptGuestlist } from '@/lib/crypto';
import type { Guest, SearchResult, Guestlist } from '@/types';
import styles from './GuestSearch.module.css';
import encryptedData from '@/data/guestlist.encrypted.json';

interface GuestSearchProps {
  onGuestFound: (guest: Guest) => void;
}

export default function GuestSearch({ onGuestFound }: GuestSearchProps) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [postalCode, setPostalCode] = useState('');
  const [password, setPassword] = useState('');
  const [searchResult, setSearchResult] = useState<SearchResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isUnlocked, setIsUnlocked] = useState(false);
  const [guestlist, setGuestlist] = useState<Guestlist | null>(null);
  const [unlockError, setUnlockError] = useState('');

  const handleUnlock = async (e: FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setUnlockError('');

    try {
      const decrypted = await decryptGuestlist(encryptedData, password);
      const data = JSON.parse(decrypted) as Guestlist;
      setGuestlist(data);
      setIsUnlocked(true);
    } catch {
      setUnlockError(
        'Incorrect password. Please contact Amy and Dan if you need assistance.'
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();

    if (!name.trim() || !guestlist) {
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

  if (!isUnlocked) {
    return (
      <div className={styles.guestSearch}>
        <form onSubmit={handleUnlock} className={styles.form}>
          <div className={styles.unlockMessage}>
            <p>
              To protect guest privacy, please enter the access code provided in
              your invitation.
            </p>
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="password" className={styles.label}>
              Access Code
            </label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className={styles.input}
              placeholder="Enter access code"
              required
              autoComplete="off"
            />
          </div>

          {unlockError && (
            <div className={styles.error} data-testid="unlock-error">
              <p>{unlockError}</p>
            </div>
          )}

          <button type="submit" className={styles.button} disabled={isLoading}>
            {isLoading ? 'Unlocking...' : 'Unlock RSVP'}
          </button>
        </form>
      </div>
    );
  }

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
