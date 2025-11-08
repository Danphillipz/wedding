# Data Model: Wedding Information Website

**Feature**: 001-wedding-website  
**Date**: November 8, 2025  
**Status**: Complete

## Overview

This document defines the data structures for the wedding website. Since this is a static site, all data is defined as TypeScript interfaces and stored in static JSON files.

## Entities

### Guest

Represents an invited wedding guest on the guestlist.

**Fields**:

| Field | Type | Required | Description | Validation Rules |
|-------|------|----------|-------------|------------------|
| `id` | `string` | Yes | Unique identifier (UUID v4) | Non-empty string, UUID format |
| `name` | `string` | Yes | Full name as it appears on invitation | Non-empty string, max 100 characters |
| `email` | `string` | Yes | Email address for disambiguation | Valid email format |
| `postalCode` | `string` | Yes | UK postal code for disambiguation | Valid UK postal code format (e.g., "B12 3AB") |

**TypeScript Interface**:

```typescript
interface Guest {
  id: string;
  name: string;
  email: string;
  postalCode: string;
}
```

**Example**:

```json
{
  "id": "550e8400-e29b-41d4-a716-446655440000",
  "name": "John Smith",
  "email": "john.smith@example.com",
  "postalCode": "B12 3AB"
}
```

**State Transitions**: None (read-only data)

**Relationships**:
- One guest can have one RSVP response (stored in Google Forms, not in application data)

---

### Guestlist

Collection of all invited guests.

**Fields**:

| Field | Type | Required | Description | Validation Rules |
|-------|------|----------|-------------|------------------|
| `guests` | `Guest[]` | Yes | Array of all invited guests | Non-empty array, unique IDs |

**TypeScript Interface**:

```typescript
interface Guestlist {
  guests: Guest[];
}
```

**Example**:

```json
{
  "guests": [
    {
      "id": "550e8400-e29b-41d4-a716-446655440000",
      "name": "John Smith",
      "email": "john.smith@example.com",
      "postalCode": "B12 3AB"
    },
    {
      "id": "6ba7b810-9dad-11d1-80b4-00c04fd430c8",
      "name": "Jane Doe",
      "email": "jane.doe@example.com",
      "postalCode": "SW1A 1AA"
    }
  ]
}
```

**Storage Location**: `apps/wedding/src/data/guestlist.json`

**Access Pattern**: Loaded at build time, bundled with application, searched client-side

---

### SearchResult

Result of a guestlist search operation.

**Fields**:

| Field | Type | Required | Description | Validation Rules |
|-------|------|----------|-------------|------------------|
| `status` | `'found' \| 'not-found' \| 'multiple-matches' \| 'deadline-passed'` | Yes | Search outcome | One of the four status values |
| `guest` | `Guest \| null` | No | Matched guest (if status is 'found') | Required if status is 'found' |
| `matches` | `Guest[]` | No | Multiple matching guests (if status is 'multiple-matches') | Required if status is 'multiple-matches', length ≥ 2 |
| `message` | `string` | Yes | User-friendly message to display | Non-empty string |

**TypeScript Interface**:

```typescript
type SearchStatus = 'found' | 'not-found' | 'multiple-matches' | 'deadline-passed';

interface SearchResult {
  status: SearchStatus;
  guest?: Guest;
  matches?: Guest[];
  message: string;
}
```

**Examples**:

```typescript
// Single match found
{
  status: 'found',
  guest: { id: '...', name: 'John Smith', email: '...', postalCode: '...' },
  message: 'Welcome, John Smith! Please confirm your attendance below.'
}

// No match
{
  status: 'not-found',
  message: 'We couldn\'t find your name on our guestlist. Please contact Amy and Dan if you believe this is an error.'
}

// Multiple matches
{
  status: 'multiple-matches',
  matches: [
    { id: '...', name: 'John Smith', email: 'john1@example.com', postalCode: 'B12 3AB' },
    { id: '...', name: 'John Smith', email: 'john2@example.com', postalCode: 'M1 1AA' }
  ],
  message: 'We found multiple guests with that name. Please provide your email or postal code to help us identify you.'
}

// Deadline passed
{
  status: 'deadline-passed',
  message: 'The RSVP deadline (May 2, 2026) has passed. Please contact Amy and Dan directly if you need to update your response.'
}
```

**State Transitions**: Immutable (created and returned by search function)

---

### WeddingDetails

Static information about the wedding event.

**Fields**:

| Field | Type | Required | Description | Validation Rules |
|-------|------|----------|-------------|------------------|
| `date` | `string` | Yes | Wedding date | ISO 8601 format (YYYY-MM-DD) |
| `venue` | `VenueInfo` | Yes | Venue details | Valid VenueInfo object |
| `rsvpDeadline` | `string` | Yes | RSVP deadline date | ISO 8601 format (YYYY-MM-DD) |

**TypeScript Interface**:

```typescript
interface VenueInfo {
  name: string;
  address: {
    line1: string;
    line2?: string;
    city: string;
    postalCode: string;
    country: string;
  };
  coordinates?: {
    lat: number;
    lng: number;
  };
}

interface WeddingDetails {
  date: string; // '2026-07-02'
  venue: VenueInfo;
  rsvpDeadline: string; // '2026-05-02'
}
```

**Example**:

```typescript
const weddingDetails: WeddingDetails = {
  date: '2026-07-02',
  venue: {
    name: 'Thorpe Gardens',
    address: {
      line1: 'Thorpe Gardens',
      city: 'Tamworth',
      postalCode: 'B79 7XX',
      country: 'United Kingdom'
    },
    coordinates: {
      lat: 52.6369,
      lng: -1.6951
    }
  },
  rsvpDeadline: '2026-05-02'
};
```

**Storage Location**: Hardcoded constants in application code (not JSON file)

**Access Pattern**: Imported as TypeScript constants where needed

---

## Validation Rules

### Name Matching

**Algorithm**: Case-insensitive exact match

```typescript
function normalizeString(str: string): string {
  return str.toLowerCase().trim();
}

function searchByName(guestlist: Guestlist, searchName: string): Guest[] {
  const normalized = normalizeString(searchName);
  return guestlist.guests.filter(guest => 
    normalizeString(guest.name) === normalized
  );
}
```

**Special Characters**: Preserve apostrophes, hyphens, and accented characters in comparison (e.g., "O'Brien" matches "o'brien", "José" matches "josé")

### Email Disambiguation

**Algorithm**: Case-insensitive exact match on email field

```typescript
function searchByEmail(matches: Guest[], email: string): Guest | null {
  const normalized = normalizeString(email);
  return matches.find(guest => 
    normalizeString(guest.email) === normalized
  ) || null;
}
```

### Postal Code Disambiguation

**Algorithm**: Normalize to uppercase, remove spaces, exact match

```typescript
function normalizePostalCode(postalCode: string): string {
  return postalCode.toUpperCase().replace(/\s+/g, '');
}

function searchByPostalCode(matches: Guest[], postalCode: string): Guest | null {
  const normalized = normalizePostalCode(postalCode);
  return matches.find(guest => 
    normalizePostalCode(guest.postalCode) === normalized
  ) || null;
}
```

### Deadline Validation

**Algorithm**: Compare current date with RSVP deadline (May 2, 2026 at 23:59:59)

```typescript
function isBeforeDeadline(): boolean {
  const deadline = new Date('2026-05-02T23:59:59');
  return new Date() < deadline;
}
```

## Data Access Patterns

### Read Operations

1. **Load guestlist** (at build time):
   - Import `guestlist.json`
   - Parse JSON into `Guestlist` type
   - No runtime I/O (data is bundled)

2. **Search by name**:
   - Filter guestlist array using case-insensitive exact match
   - Return 0, 1, or 2+ matches

3. **Disambiguate by email/postal code**:
   - Filter matches array using normalized comparison
   - Return single guest or null

### Write Operations

None - this is a read-only static site. RSVP responses are written to Google Forms (external system).

## Data Constraints

- **Uniqueness**: Guest IDs must be unique (enforced by UUID generation)
- **Immutability**: Guestlist data is immutable after build
- **Size**: Maximum 500 guests (performance constraint for client-side search)
- **Format**: All data stored as JSON, parsed into TypeScript types at build time
