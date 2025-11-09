import { describe, it, expect } from '@jest/globals';
import {
  normalizeString,
  searchByName,
  searchByEmail,
  searchByPostalCode,
  searchGuest,
} from '@/lib/guestlist';
import type { Guestlist, Guest } from '@/types';

describe('guestlist search utilities', () => {
  const mockGuestlist: Guestlist = {
    guests: [
      {
        id: '1',
        name: 'John Smith',
        email: 'john.smith@example.com',
        postalCode: 'B12 3AB',
      },
      {
        id: '2',
        name: 'Jane Doe',
        email: 'jane.doe@example.com',
        postalCode: 'SW1A 1AA',
      },
      {
        id: '3',
        name: 'John Smith',
        email: 'johnsmith2@example.com',
        postalCode: 'M1 1AA',
      },
      {
        id: '4',
        name: "Michael O'Brien",
        email: 'michael.obrien@example.com',
        postalCode: 'G1 1AA',
      },
    ],
  };

  describe('normalizeString', () => {
    it('should convert string to lowercase', () => {
      expect(normalizeString('HELLO')).toBe('hello');
    });

    it('should trim whitespace', () => {
      expect(normalizeString('  hello  ')).toBe('hello');
    });

    it('should handle empty strings', () => {
      expect(normalizeString('')).toBe('');
    });

    it('should preserve special characters like apostrophes', () => {
      expect(normalizeString("O'Brien")).toBe("o'brien");
    });

    it('should preserve hyphens', () => {
      expect(normalizeString('Anne-Marie')).toBe('anne-marie');
    });
  });

  describe('searchByName', () => {
    it('should find single exact match (case-insensitive)', () => {
      const results = searchByName(mockGuestlist, 'jane doe');
      expect(results).toHaveLength(1);
      expect(results[0].name).toBe('Jane Doe');
    });

    it('should find multiple matches for same name', () => {
      const results = searchByName(mockGuestlist, 'John Smith');
      expect(results).toHaveLength(2);
    });

    it('should return empty array for no matches', () => {
      const results = searchByName(mockGuestlist, 'Unknown Person');
      expect(results).toHaveLength(0);
    });

    it('should handle names with special characters', () => {
      const results = searchByName(mockGuestlist, "michael o'brien");
      expect(results).toHaveLength(1);
      expect(results[0].name).toBe("Michael O'Brien");
    });

    it('should ignore extra whitespace', () => {
      const results = searchByName(mockGuestlist, '  jane   doe  ');
      expect(results).toHaveLength(1);
    });
  });

  describe('searchByEmail', () => {
    const multipleMatches: Guest[] = [
      {
        id: '1',
        name: 'John Smith',
        email: 'john.smith@example.com',
        postalCode: 'B12 3AB',
      },
      {
        id: '3',
        name: 'John Smith',
        email: 'johnsmith2@example.com',
        postalCode: 'M1 1AA',
      },
    ];

    it('should find guest by exact email match (case-insensitive)', () => {
      const result = searchByEmail(multipleMatches, 'john.smith@example.com');
      expect(result).not.toBeNull();
      expect(result?.id).toBe('1');
    });

    it('should handle uppercase email input', () => {
      const result = searchByEmail(multipleMatches, 'JOHN.SMITH@EXAMPLE.COM');
      expect(result).not.toBeNull();
      expect(result?.id).toBe('1');
    });

    it('should return null for no match', () => {
      const result = searchByEmail(multipleMatches, 'notfound@example.com');
      expect(result).toBeNull();
    });

    it('should trim whitespace from email', () => {
      const result = searchByEmail(multipleMatches, '  john.smith@example.com  ');
      expect(result).not.toBeNull();
      expect(result?.id).toBe('1');
    });
  });

  describe('searchByPostalCode', () => {
    const multipleMatches: Guest[] = [
      {
        id: '1',
        name: 'John Smith',
        email: 'john.smith@example.com',
        postalCode: 'B12 3AB',
      },
      {
        id: '3',
        name: 'John Smith',
        email: 'johnsmith2@example.com',
        postalCode: 'M1 1AA',
      },
    ];

    it('should find guest by exact postal code match', () => {
      const result = searchByPostalCode(multipleMatches, 'B12 3AB');
      expect(result).not.toBeNull();
      expect(result?.id).toBe('1');
    });

    it('should handle postal code without space', () => {
      const result = searchByPostalCode(multipleMatches, 'B123AB');
      expect(result).not.toBeNull();
      expect(result?.id).toBe('1');
    });

    it('should handle lowercase postal code', () => {
      const result = searchByPostalCode(multipleMatches, 'b12 3ab');
      expect(result).not.toBeNull();
      expect(result?.id).toBe('1');
    });

    it('should return null for no match', () => {
      const result = searchByPostalCode(multipleMatches, 'XX1 1XX');
      expect(result).toBeNull();
    });
  });

  describe('searchGuest', () => {
    it('should return "found" status for single match', () => {
      const result = searchGuest(mockGuestlist, 'jane doe');
      expect(result.status).toBe('found');
      expect(result.guest?.name).toBe('Jane Doe');
      expect(result.message).toContain('Jane Doe');
    });

    it('should return "not-found" status for no matches', () => {
      const result = searchGuest(mockGuestlist, 'Unknown Person');
      expect(result.status).toBe('not-found');
      expect(result.message).toContain('couldn\'t find your name on the initial guestlist');
    });

    it('should return "multiple-matches" status for duplicate names', () => {
      const result = searchGuest(mockGuestlist, 'John Smith');
      expect(result.status).toBe('multiple-matches');
      expect(result.matches).toHaveLength(2);
      expect(result.message).toContain('multiple guests');
    });

    it('should disambiguate by email when provided', () => {
      const result = searchGuest(
        mockGuestlist,
        'John Smith',
        'john.smith@example.com'
      );
      expect(result.status).toBe('found');
      expect(result.guest?.id).toBe('1');
    });

    it('should disambiguate by postal code when provided', () => {
      const result = searchGuest(
        mockGuestlist,
        'John Smith',
        undefined,
        'M1 1AA'
      );
      expect(result.status).toBe('found');
      expect(result.guest?.id).toBe('3');
    });

    it('should return "not-found" if disambiguation fails', () => {
      const result = searchGuest(
        mockGuestlist,
        'John Smith',
        'wrong@example.com'
      );
      expect(result.status).toBe('not-found');
      expect(result.message).toContain('not match');
    });
  });
});
