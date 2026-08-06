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
