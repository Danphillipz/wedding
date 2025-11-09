// TypeScript interfaces from contracts/guestlist-schema.json

export interface Guest {
  id: string;
  name: string;
  email: string;
  postalCode: string;
}

export interface Guestlist {
  guests: Guest[];
}

export type SearchStatus = 'found' | 'not-found' | 'multiple-matches' | 'deadline-passed';

export interface SearchResult {
  status: SearchStatus;
  guest?: Guest;
  matches?: Guest[];
  message: string;
}

export interface VenueAddress {
  line1: string;
  line2?: string;
  city: string;
  postalCode: string;
  country: string;
}

export interface VenueCoordinates {
  lat: number;
  lng: number;
}

export interface VenueInfo {
  name: string;
  address: VenueAddress;
  coordinates?: VenueCoordinates;
}

export interface WeddingDetails {
  date: string; // ISO 8601 format (YYYY-MM-DD)
  venue: VenueInfo;
  rsvpDeadline: string; // ISO 8601 format (YYYY-MM-DD)
}
