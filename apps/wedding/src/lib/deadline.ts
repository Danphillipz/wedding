/**
 * RSVP Deadline: May 2, 2026 at 23:59:59
 */

const RSVP_DEADLINE = new Date('2026-05-02T23:59:59');

/**
 * Get the RSVP deadline date
 * @returns The RSVP deadline (May 2, 2026 at 23:59:59)
 */
export function getRSVPDeadline(): Date {
  return RSVP_DEADLINE;
}

/**
 * Check if the current date is before the RSVP deadline
 * @returns True if before deadline, false if on or after deadline
 */
export function isBeforeDeadline(): boolean {
  return new Date() < RSVP_DEADLINE;
}

/**
 * Calculate the number of days until the RSVP deadline
 * @returns Number of days (positive if before deadline, negative if after, 0 on deadline day)
 */
export function getDaysUntilDeadline(): number {
  const now = new Date();
  const diff = RSVP_DEADLINE.getTime() - now.getTime();
  return Math.floor(diff / (1000 * 60 * 60 * 24));
}
