/**
 * Guest entity representing an invited wedding guest
 */
export interface Guest {
  id: string;
  name: string;
  email: string;
  postalCode: string;
}

/**
 * Search status outcomes
 */
export type SearchStatus = 'found' | 'not-found' | 'multiple-matches' | 'deadline-passed';

/**
 * Result of a guestlist search operation
 */
export interface SearchResult {
  status: SearchStatus;
  guest?: Guest;
  matches?: Guest[];
  message: string;
}

/**
 * Guestlist collection
 */
export interface Guestlist {
  guests: Guest[];
}
