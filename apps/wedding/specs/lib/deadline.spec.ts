import { describe, it, expect, beforeEach, afterEach } from '@jest/globals';
import { isBeforeDeadline, getRSVPDeadline, getDaysUntilDeadline } from '@/lib/deadline';

describe('RSVP deadline validation', () => {
  const ORIGINAL_DATE = Date;
  
  beforeEach(() => {
    // Reset Date to original implementation before each test
    global.Date = ORIGINAL_DATE;
  });

  afterEach(() => {
    // Clean up after each test
    global.Date = ORIGINAL_DATE;
  });

  describe('getRSVPDeadline', () => {
    it('should return May 2, 2026 deadline', () => {
      const deadline = getRSVPDeadline();
      expect(deadline.getFullYear()).toBe(2026);
      expect(deadline.getMonth()).toBe(4); // May is month 4 (0-indexed)
      expect(deadline.getDate()).toBe(2);
    });
  });

  describe('isBeforeDeadline', () => {
    it('should return true when current date is before deadline', () => {
      // Mock current date to April 1, 2026 (before deadline)
      const mockDate = new Date('2026-04-01T12:00:00');
      global.Date = class extends ORIGINAL_DATE {
        constructor() {
          super();
          return mockDate;
        }
        static now() {
          return mockDate.getTime();
        }
      } as DateConstructor;

      expect(isBeforeDeadline()).toBe(true);
    });

    it('should return true when current date is ON deadline day before 23:59:59', () => {
      // Mock current date to May 2, 2026 at noon (still before deadline)
      const mockDate = new Date('2026-05-02T12:00:00');
      global.Date = class extends ORIGINAL_DATE {
        constructor() {
          super();
          return mockDate;
        }
        static now() {
          return mockDate.getTime();
        }
      } as DateConstructor;

      expect(isBeforeDeadline()).toBe(true);
    });

    it('should return false when current date is after deadline', () => {
      // Mock current date to May 3, 2026 (after deadline)
      const mockDate = new Date('2026-05-03T00:00:01');
      global.Date = class extends ORIGINAL_DATE {
        constructor() {
          super();
          return mockDate;
        }
        static now() {
          return mockDate.getTime();
        }
      } as DateConstructor;

      expect(isBeforeDeadline()).toBe(false);
    });

    it('should return false on deadline day at 23:59:59', () => {
      // Mock current date to May 2, 2026 at 23:59:59 (at deadline cutoff)
      const mockDate = new Date('2026-05-02T23:59:59');
      global.Date = class extends ORIGINAL_DATE {
        constructor() {
          super();
          return mockDate;
        }
        static now() {
          return mockDate.getTime();
        }
      } as DateConstructor;

      expect(isBeforeDeadline()).toBe(false);
    });

    it('should return true for November 2025 (current time)', () => {
      // Mock current date to November 8, 2025 (well before deadline)
      const mockDate = new Date('2025-11-08T12:00:00');
      global.Date = class extends ORIGINAL_DATE {
        constructor() {
          super();
          return mockDate;
        }
        static now() {
          return mockDate.getTime();
        }
      } as DateConstructor;

      expect(isBeforeDeadline()).toBe(true);
    });
  });

  describe('getDaysUntilDeadline', () => {
    it('should return positive number of days when before deadline', () => {
      // Mock current date to April 1, 2026 (31 days before deadline)
      const mockDate = new Date('2026-04-01T00:00:00');
      global.Date = class extends ORIGINAL_DATE {
        constructor() {
          super();
          return mockDate;
        }
        static now() {
          return mockDate.getTime();
        }
      } as DateConstructor;

      const days = getDaysUntilDeadline();
      expect(days).toBeGreaterThan(30);
      expect(days).toBeLessThan(32);
    });

    it('should return 0 on deadline day', () => {
      // Mock current date to May 2, 2026
      const mockDate = new Date('2026-05-02T12:00:00');
      global.Date = class extends ORIGINAL_DATE {
        constructor() {
          super();
          return mockDate;
        }
        static now() {
          return mockDate.getTime();
        }
      } as DateConstructor;

      const days = getDaysUntilDeadline();
      expect(days).toBe(0);
    });

    it('should return negative number when after deadline', () => {
      // Mock current date to May 10, 2026 (8 days after deadline)
      const mockDate = new Date('2026-05-10T00:00:00');
      global.Date = class extends ORIGINAL_DATE {
        constructor() {
          super();
          return mockDate;
        }
        static now() {
          return mockDate.getTime();
        }
      } as DateConstructor;

      const days = getDaysUntilDeadline();
      expect(days).toBeLessThan(0);
      expect(days).toBeGreaterThan(-9);
    });
  });
});
