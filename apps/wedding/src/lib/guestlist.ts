import guestlistData from '@/data/guestlist.json';
import type { Guest, Guestlist, SearchResult } from '@/types';

/**
 * Normalize a string for case-insensitive comparison
 * Converts to lowercase and trims whitespace
 * Also normalizes internal whitespace (multiple spaces to single space)
 * Preserves special characters (apostrophes, hyphens, accents)
 */
export function normalizeString(str: string): string {
  return str.toLowerCase().trim().replace(/\s+/g, ' ');
}

/**
 * Normalize a UK postal code for comparison
 * Converts to uppercase and removes all spaces
 */
export function normalizePostalCode(postalCode: string): string {
  return postalCode.toUpperCase().replace(/\s+/g, '');
}

/**
 * Search guestlist by name (case-insensitive exact match)
 * @param guestlist - The guestlist to search
 * @param name - The name to search for
 * @returns Array of matching guests (0, 1, or multiple)
 */
export function searchByName(guestlist: Guestlist, name: string): Guest[] {
  const normalized = normalizeString(name);
  return guestlist.guests.filter(
    (guest) => normalizeString(guest.name) === normalized
  );
}

/**
 * Search for a specific guest by email (case-insensitive)
 * Used to disambiguate when multiple guests have the same name
 * @param matches - Array of guests with matching names
 * @param email - The email to search for
 * @returns The matching guest or null if not found
 */
export function searchByEmail(matches: Guest[], email: string): Guest | null {
  const normalized = normalizeString(email);
  return (
    matches.find((guest) => normalizeString(guest.email) === normalized) || null
  );
}

/**
 * Search for a specific guest by postal code
 * Used to disambiguate when multiple guests have the same name
 * @param matches - Array of guests with matching names
 * @param postalCode - The postal code to search for
 * @returns The matching guest or null if not found
 */
export function searchByPostalCode(
  matches: Guest[],
  postalCode: string
): Guest | null {
  const normalized = normalizePostalCode(postalCode);
  return (
    matches.find(
      (guest) => normalizePostalCode(guest.postalCode) === normalized
    ) || null
  );
}

/**
 * Main search function for guestlist
 * Supports name-only search and disambiguation by email or postal code
 * @param guestlist - The guestlist to search
 * @param name - The guest's name
 * @param email - Optional email for disambiguation
 * @param postalCode - Optional postal code for disambiguation
 * @returns SearchResult with status and appropriate data
 */
export function searchGuest(
  guestlist: Guestlist,
  name: string,
  email?: string,
  postalCode?: string
): SearchResult {
  const nameMatches = searchByName(guestlist, name);

  // No matches found
  if (nameMatches.length === 0) {
    return {
      status: 'not-found',
      message:
        "We couldn't find your name on the initial guestlist. Please contact Amy and Dan if you believe this is an error.",
    };
  }

  // Single match found
  if (nameMatches.length === 1) {
    return {
      status: 'found',
      guest: nameMatches[0],
      message: `Welcome, ${nameMatches[0].name}! Please confirm your attendance below.`,
    };
  }

  // Multiple matches - need disambiguation
  if (email) {
    const emailMatch = searchByEmail(nameMatches, email);
    if (emailMatch) {
      return {
        status: 'found',
        guest: emailMatch,
        message: `Welcome, ${emailMatch.name}! Please confirm your attendance below.`,
      };
    }
    return {
      status: 'not-found',
      message:
        'The email provided does not match any guest with that name. Please check your email or contact Amy and Dan.',
    };
  }

  if (postalCode) {
    const postalCodeMatch = searchByPostalCode(nameMatches, postalCode);
    if (postalCodeMatch) {
      return {
        status: 'found',
        guest: postalCodeMatch,
        message: `Welcome, ${postalCodeMatch.name}! Please confirm your attendance below.`,
      };
    }
    return {
      status: 'not-found',
      message:
        'The postal code provided does not match any guest with that name. Please check your postal code or contact Amy and Dan.',
    };
  }

  // Multiple matches, no disambiguation provided
  return {
    status: 'multiple-matches',
    matches: nameMatches,
    message:
      'We found multiple guests with that name. Please provide your email or postal code to help us identify you.',
  };
}

// Export loaded guestlist for use in components
export const guestlist: Guestlist = guestlistData as Guestlist;
