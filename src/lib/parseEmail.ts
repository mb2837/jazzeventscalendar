import type { Catalog, JazzEvent, ParsedEventDraft, Venue } from '../types';

const MONTHS: Record<string, number> = {
  jan: 0,
  january: 0,
  feb: 1,
  february: 1,
  mar: 2,
  march: 2,
  apr: 3,
  april: 3,
  may: 4,
  jun: 5,
  june: 5,
  jul: 6,
  july: 6,
  aug: 7,
  august: 7,
  sep: 8,
  sept: 8,
  september: 8,
  oct: 9,
  october: 9,
  nov: 10,
  november: 10,
  dec: 11,
  december: 11,
};

const SKIP_HEADERS = /^(on-?going|websites|all playlists|dale mcfarland|for more jazz)/i;

function normalizeVenueKey(value: string): string {
  return value
    .toLowerCase()
    .replace(/['’]/g, '')
    .replace(/[^a-z0-9]+/g, ' ')
    .trim();
}

const VENUE_ALIASES: Record<string, string[]> = {
  dakotas: ['dakota', 'dakotas restaurant', 'dakotas'],
  'library-bar': ['library bar', 'melrose', 'melrose hotel'],
  'free-man': ['free man', 'the free man'],
  revelers: ['revelers', 'reveler', 'revelers hall', 'revelers hall band'],
  kitchen: ['kitchen', 'kitchen cafe', 'the kitchen', 'the kitchen cafe'],
  scat: ['scat', 'scat jazz', 'scat jazz lounge'],
  stoneys: ['stoney', 'stoneys', 'stoneys wine lounge'],
  'wine-therapist': ['wine therapist'],
  resident: ['resident', 'resident taqueria'],
  'central-market-southlake': ['central market', 'southlake'],
  'nova-cafe': ['nova cafe', 'nova'],
  'grace-bible': ['grace bible'],
  balcony: ['balcony', 'balcony club'],
  'rodeo-city': ['rodeo city', 'eight second', '8 second', 'mesquite rodeo'],
  steves: ['steves wine', "steve's wine", 'steve’s wine'],
  'guitars-growlers': ['guitars', 'growlers'],
  eisemann: ['eisemann'],
  sundance: ['sundance'],
  windmills: ['windmill', 'windmills', 'windmills craftworks'],
  'lonestar-wine': ['lonestar wine', 'lone star wine'],
  stonebriar: ['stonebriar'],
  'la-stella': ['la stella', 'sophia lounge'],
  'cafe-madrid': ['cafe madrid', 'café madrid'],
  memphis: ['memphis'],
  'wine-haus': ['wine haus'],
  sammons: ['sammons'],
  mansion: ['mansion', 'turtle creek'],
  'table-13': ['table 13'],
  regines: ['regine', 'regines'],
};

function matchVenue(text: string, venues: Venue[]): { venueId?: string; venueGuess?: string } {
  const lower = text.toLowerCase();
  for (const venue of venues) {
    const nameKey = normalizeVenueKey(venue.name);
    if (nameKey && lower.includes(nameKey)) {
      return { venueId: venue.id, venueGuess: venue.name };
    }
  }
  for (const [id, aliases] of Object.entries(VENUE_ALIASES)) {
    if (aliases.some((a) => lower.includes(a))) {
      const venue = venues.find((v) => v.id === id);
      return { venueId: id, venueGuess: venue?.name ?? id };
    }
  }
  return {};
}

function parseClockToken(raw: string): string | undefined {
  const cleaned = raw
    .trim()
    .toLowerCase()
    .replace(/[”"]/g, '')
    .replace(/\s+/g, '');
  const match = cleaned.match(/^(\d{1,2})(?::(\d{2}))?(am|pm)?$/i);
  if (!match) return undefined;
  let hour = Number(match[1]);
  const minute = match[2] ? Number(match[2]) : 0;
  const period = match[3]?.toLowerCase();
  if (period === 'pm' && hour < 12) hour += 12;
  if (period === 'am' && hour === 12) hour = 0;
  if (!period && hour >= 1 && hour <= 6) {
    // jazz listings: bare 6–11 usually evening
    if (hour <= 11) hour += 12;
  }
  if (!period && hour === 12) {
    // noon stays 12
  }
  if (hour > 23 || minute > 59) return undefined;
  return `${String(hour).padStart(2, '0')}:${String(minute).padStart(2, '0')}`;
}

function extractTimes(text: string): { startTime?: string; endTime?: string } {
  const range =
    text.match(
      /(\d{1,2}(?::\d{2})?\s*(?:am|pm|a\.m\.|p\.m\.)?)\s*(?:to|–|-|—)\s*(\d{1,2}(?::\d{2})?\s*(?:am|pm|a\.m\.|p\.m\.|”00|"00)?)/i,
    ) ??
    text.match(
      /(\d{1,2}(?::\d{2})?)\s*(?:to|–|-|—)\s*(\d{1,2}(?::\d{2})?)\s*(am|pm)?/i,
    );

  if (range) {
    const endRaw = `${range[2]}${range[3] ?? ''}`;
    let startTime = parseClockToken(range[1].replace(/\./g, ''));
    let endTime = parseClockToken(endRaw.replace(/\./g, '').replace(/[”"]00/, ':00'));
    // Bare evening ranges like "6:00 to 9:30"
    if (startTime && endTime) {
      const [sh, sm] = startTime.split(':').map(Number);
      const [eh, em] = endTime.split(':').map(Number);
      const startMin = sh * 60 + sm;
      const endMin = eh * 60 + em;
      if (endMin <= startMin && eh <= 11) {
        endTime = `${String(eh + 12).padStart(2, '0')}:${String(em).padStart(2, '0')}`;
      }
    }
    return { startTime, endTime };
  }

  const single = text.match(
    /(?:^|[^\d])(\d{1,2}(?::\d{2})?\s*(?:am|pm|a\.m\.|p\.m\.))\b/i,
  );
  if (single) {
    return { startTime: parseClockToken(single[1].replace(/\./g, '')) };
  }

  const loose = text.match(/\b(\d{1,2})(?::(\d{2}))?\s*(?:p\.?m\.?)\b/i);
  if (loose) {
    return { startTime: parseClockToken(`${loose[1]}:${loose[2] ?? '00'}pm`) };
  }

  return {};
}

function extractDate(
  text: string,
  defaultYear: number,
): { date?: string; warning?: string } {
  const match = text.match(
    /\b(?:mon|monday|tue|tu|tues|tuesday|wed|wednesday|thu|thur|thurs|thursday|th|fri|friday|sat|saturday|sun|sunday)?\.?\s*,?\s*(jan(?:uary)?|feb(?:ruary)?|mar(?:ch)?|apr(?:il)?|may|jun(?:e)?|jul(?:y)?|aug(?:ust)?|sept?(?:ember)?|oct(?:ober)?|nov(?:ember)?|dec(?:ember)?)\.?\s+(\d{1,2})(?:st|nd|rd|th)?(?:,?\s*(\d{4}))?/i,
  );
  if (!match) return { warning: 'Could not parse date' };

  const month = MONTHS[match[1].toLowerCase().replace(/\.$/, '')];
  if (month === undefined) return { warning: 'Unknown month' };
  const day = Number(match[2]);
  const year = match[3] ? Number(match[3]) : defaultYear;
  const iso = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
  const warnings =
    month === 6 && defaultYear === 2026
      ? 'Source says July — confirm (often an August typo in these emails)'
      : undefined;
  return { date: iso, warning: warnings };
}

function extractCover(text: string): string | undefined {
  const noCover = text.match(/\bno cover\b/i);
  if (noCover) return 'No cover';
  const cover = text.match(/\$\s?\d+(?:\.\d{2})?(?:\s*(?:cover|music (?:fee|cover)|table|bar)[^.,;]*)?/i);
  if (cover) return cover[0].replace(/\s+/g, ' ').trim();
  const fee = text.match(/\$\d+(?:\s*\/\s*\$\d+)*.{0,40}/i);
  return fee?.[0]?.trim();
}

function extractUrl(text: string): string | undefined {
  const match = text.match(/https?:\/\/[^\s)]+/i);
  if (match) return match[0].replace(/[.,;]+$/, '');
  if (/scatjazzlounge\.com/i.test(text)) return 'https://scatjazzlounge.com';
  if (/stoneyswinelounge\.com/i.test(text)) return 'https://stoneyswinelounge.com';
  return undefined;
}

function extractEditionLabel(text: string): string | undefined {
  const match = text.match(/^\s*([A-Za-z]+\.?\s+\d{4}\s+jazz events\s*#\s*\d+)/im);
  return match?.[1]?.trim();
}

function stripDatePrefix(text: string): string {
  return text
    .replace(
      /^\s*(?:mon|monday|tue|tu|tues|tuesday|wed|wednesday|thu|thur|thurs|thursday|th|fri|friday|sat|saturday|sun|sunday)?\.?\s*,?\s*(?:jan(?:uary)?|feb(?:ruary)?|mar(?:ch)?|apr(?:il)?|may|jun(?:e)?|jul(?:y)?|aug(?:ust)?|sept?(?:ember)?|oct(?:ober)?|nov(?:ember)?|dec(?:ember)?)\.?\s+\d{1,2}(?:st|nd|rd|th)?(?:,?\s*\d{4})?\s*[-–—:]?\s*/i,
      '',
    )
    .trim();
}

function guessArtist(body: string, venueGuess?: string): string {
  let working = body;
  if (venueGuess) {
    const parts = working.split(/\s+[–—-]\s+/);
    if (parts.length >= 2) {
      working = parts[0];
    } else {
      const needle = venueGuess.toLowerCase().split('–')[0].trim().toLowerCase();
      const idx = working.toLowerCase().indexOf(needle);
      if (idx > 8) {
        working = working.slice(0, idx).replace(/[–—-]\s*$/, '').trim();
      }
    }
  } else {
    const parts = working.split(/\s+[–—-]\s+/);
    if (parts.length >= 2) working = parts[0];
  }
  working = working.replace(/\s+/g, ' ').trim();
  if (working.length > 120) working = `${working.slice(0, 117)}...`;
  return working || 'Untitled event';
}

export function parseJazzEmail(
  text: string,
  venues: Venue[],
  options?: { defaultYear?: number },
): { editionLabel?: string; drafts: ParsedEventDraft[] } {
  const defaultYear = options?.defaultYear ?? 2026;
  const editionLabel = extractEditionLabel(text);

  const ongoingIdx = text.search(/\bON-?GOING\s*:/i);
  const datedSection = ongoingIdx >= 0 ? text.slice(0, ongoingIdx) : text;

  const chunks = datedSection
    .split(/#{3,}/)
    .map((c) => c.replace(/\s+/g, ' ').trim())
    .filter(Boolean);

  const drafts: ParsedEventDraft[] = [];
  let n = 0;

  for (const chunk of chunks) {
    if (SKIP_HEADERS.test(chunk)) continue;
    if (/youtube\.com|playlist/i.test(chunk) && !/\b(aug|sept|oct|nov|dec|jan|feb|mar|apr|may|jun|jul)\b/i.test(chunk)) {
      continue;
    }
    if (/^\s*[A-Za-z]+\.?\s+\d{4}\s+jazz events/i.test(chunk)) continue;

    const { date, warning: dateWarning } = extractDate(chunk, defaultYear);
    if (!date && !/\b(aug|sept|oct|nov|dec|jan|feb|mar|apr|may|jun|jul)\b/i.test(chunk)) {
      continue;
    }

    const { startTime, endTime } = extractTimes(chunk);
    const { venueId, venueGuess } = matchVenue(chunk, venues);
    const cover = extractCover(chunk);
    const ticketUrl = extractUrl(chunk);
    const body = stripDatePrefix(chunk);
    const artist = guessArtist(body, venueGuess);

    const warnings: string[] = [];
    if (dateWarning) warnings.push(dateWarning);
    if (!date) warnings.push('Missing date');
    if (!venueId) warnings.push('Venue not matched — pick one before import');
    if (!startTime) warnings.push('Start time unclear');

    n += 1;
    drafts.push({
      id: `draft-${n}-${date ?? 'nodate'}`,
      date,
      startTime,
      endTime,
      artist,
      venueId,
      venueGuess,
      cover,
      ticketUrl,
      notes: body.length > 180 ? body.slice(0, 180) + '…' : undefined,
      raw: chunk,
      warnings,
      selected: Boolean(date && venueId),
    });
  }

  return { editionLabel, drafts };
}

export function draftToEvent(draft: ParsedEventDraft): JazzEvent | null {
  if (!draft.date || !draft.venueId || !draft.artist.trim()) return null;
  return {
    id: draft.id.startsWith('draft-')
      ? `e${draft.date.replace(/-/g, '')}-${Math.random().toString(36).slice(2, 7)}`
      : draft.id,
    date: draft.date,
    startTime: draft.startTime,
    endTime: draft.endTime,
    artist: draft.artist.trim(),
    venueId: draft.venueId,
    cover: draft.cover,
    notes: draft.notes,
    ticketUrl: draft.ticketUrl,
    musicians: draft.musicians,
  };
}

export function emptyCatalog(): Catalog {
  return { editionLabel: 'Jazz events', venues: [], events: [], ongoing: [] };
}
