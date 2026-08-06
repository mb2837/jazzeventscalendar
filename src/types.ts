export interface Venue {
  id: string;
  name: string;
  address: string;
  city: string;
  lat: number;
  lng: number;
  phone?: string;
  url?: string;
}

export interface JazzEvent {
  id: string;
  date: string; // YYYY-MM-DD
  startTime?: string; // HH:mm 24h
  endTime?: string;
  artist: string;
  venueId: string;
  cover?: string;
  notes?: string;
  ticketUrl?: string;
  musicians?: string;
  /** ISO timestamp when archived; null/undefined = active */
  deletedAt?: string | null;
}

export interface OngoingSeries {
  id: string;
  title: string;
  schedule: string;
  venueId?: string;
  cover?: string;
  notes?: string;
  url?: string;
}

export interface Catalog {
  editionLabel: string;
  venues: Venue[];
  events: JazzEvent[];
  ongoing: OngoingSeries[];
}

export interface ParsedEventDraft {
  id: string;
  date?: string;
  startTime?: string;
  endTime?: string;
  artist: string;
  venueId?: string;
  venueGuess?: string;
  cover?: string;
  notes?: string;
  ticketUrl?: string;
  musicians?: string;
  raw: string;
  warnings: string[];
  selected: boolean;
}
