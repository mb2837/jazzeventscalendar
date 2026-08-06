import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import type { Catalog, JazzEvent, OngoingSeries, Venue } from '../src/types.ts';
import { editionLabel, events, ongoing } from '../src/data/events.ts';
import { venues } from '../src/data/venues.ts';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const dataDir = path.resolve(__dirname, '../data');
const dbPath = path.join(dataDir, 'db.json');

export function isActiveEvent(event: JazzEvent): boolean {
  return !event.deletedAt;
}

function sortEvents(list: JazzEvent[]) {
  list.sort((a, b) =>
    `${a.date}${a.startTime ?? ''}`.localeCompare(`${b.date}${b.startTime ?? ''}`),
  );
}

function seedCatalog(): Catalog {
  return {
    editionLabel,
    venues: structuredClone(venues),
    events: structuredClone(events),
    ongoing: structuredClone(ongoing),
  };
}

export function ensureDb(): Catalog {
  fs.mkdirSync(dataDir, { recursive: true });
  if (!fs.existsSync(dbPath)) {
    const seed = seedCatalog();
    fs.writeFileSync(dbPath, JSON.stringify(seed, null, 2), 'utf8');
    return seed;
  }
  return readCatalog();
}

export function readCatalog(): Catalog {
  ensureDbExists();
  const raw = fs.readFileSync(dbPath, 'utf8');
  return JSON.parse(raw) as Catalog;
}

/** Public-facing catalog with archived events removed. */
export function readPublicCatalog(): Catalog {
  const catalog = readCatalog();
  return {
    ...catalog,
    events: catalog.events.filter(isActiveEvent),
  };
}

function ensureDbExists() {
  if (!fs.existsSync(dbPath)) ensureDb();
}

export function writeCatalog(catalog: Catalog): Catalog {
  fs.mkdirSync(dataDir, { recursive: true });
  fs.writeFileSync(dbPath, JSON.stringify(catalog, null, 2), 'utf8');
  return catalog;
}

export function updateEditionLabel(label: string): Catalog {
  const catalog = readCatalog();
  catalog.editionLabel = label.trim() || catalog.editionLabel;
  return writeCatalog(catalog);
}

export function upsertEvent(event: JazzEvent): Catalog {
  const catalog = readCatalog();
  const existing = catalog.events.find((e) => e.id === event.id);
  const next: JazzEvent = {
    ...event,
    // Preserve archive state unless caller sets deletedAt explicitly
    deletedAt:
      event.deletedAt === undefined
        ? (existing?.deletedAt ?? null)
        : event.deletedAt,
  };
  const idx = catalog.events.findIndex((e) => e.id === event.id);
  if (idx >= 0) catalog.events[idx] = next;
  else catalog.events.push({ ...next, deletedAt: next.deletedAt ?? null });
  sortEvents(catalog.events);
  return writeCatalog(catalog);
}

export function archiveEvent(id: string): Catalog {
  const catalog = readCatalog();
  const event = catalog.events.find((e) => e.id === id);
  if (event && !event.deletedAt) {
    event.deletedAt = new Date().toISOString();
  }
  return writeCatalog(catalog);
}

export function restoreEvent(id: string): Catalog {
  const catalog = readCatalog();
  const event = catalog.events.find((e) => e.id === id);
  if (event) {
    event.deletedAt = null;
  }
  return writeCatalog(catalog);
}

/** Permanent delete — trash only. */
export function purgeEvent(id: string): Catalog {
  const catalog = readCatalog();
  catalog.events = catalog.events.filter((e) => e.id !== id);
  return writeCatalog(catalog);
}

export function importEvents(
  incoming: JazzEvent[],
  options?: { replaceDates?: string[]; editionLabel?: string },
): Catalog {
  const catalog = readCatalog();
  if (options?.editionLabel) catalog.editionLabel = options.editionLabel;

  const replace = new Set(options?.replaceDates ?? []);
  const now = new Date().toISOString();
  if (replace.size > 0) {
    for (const event of catalog.events) {
      if (replace.has(event.date) && !event.deletedAt) {
        event.deletedAt = now;
      }
    }
  }

  const byKey = new Map(
    catalog.events
      .filter(isActiveEvent)
      .map((e) => [`${e.date}|${e.venueId}|${e.artist.toLowerCase()}`, e]),
  );

  for (const event of incoming) {
    const key = `${event.date}|${event.venueId}|${event.artist.toLowerCase()}`;
    const existing = byKey.get(key);
    if (existing) {
      Object.assign(existing, event, {
        id: existing.id,
        deletedAt: null,
      });
    } else {
      const created = { ...event, deletedAt: null as string | null };
      catalog.events.push(created);
      byKey.set(key, created);
    }
  }

  sortEvents(catalog.events);
  return writeCatalog(catalog);
}

export function upsertVenue(venue: Venue): Catalog {
  const catalog = readCatalog();
  const idx = catalog.venues.findIndex((v) => v.id === venue.id);
  if (idx >= 0) catalog.venues[idx] = venue;
  else catalog.venues.push(venue);
  return writeCatalog(catalog);
}

export function upsertSeries(series: OngoingSeries): Catalog {
  const catalog = readCatalog();
  const idx = catalog.ongoing.findIndex((s) => s.id === series.id);
  if (idx >= 0) catalog.ongoing[idx] = series;
  else catalog.ongoing.push(series);
  return writeCatalog(catalog);
}

export function deleteSeries(id: string): Catalog {
  const catalog = readCatalog();
  catalog.ongoing = catalog.ongoing.filter((s) => s.id !== id);
  return writeCatalog(catalog);
}

export function resetToSeed(): Catalog {
  return writeCatalog(seedCatalog());
}

export { dbPath };
