import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import crypto from 'node:crypto';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import type { JazzEvent, OngoingSeries, Venue } from '../src/types.ts';
import { draftToEvent, parseJazzEmail } from '../src/lib/parseEmail.ts';
import {
  archiveEvent,
  deleteSeries,
  ensureDb,
  importEvents,
  purgeEvent,
  readCatalog,
  readPublicCatalog,
  resetToSeed,
  restoreEvent,
  updateEditionLabel,
  upsertEvent,
  upsertSeries,
  upsertVenue,
} from './store.ts';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const PORT = Number(process.env.PORT ?? 8787);
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD ?? 'jazzadmin';
const TOKEN_TTL_MS = 1000 * 60 * 60 * 12;

type Session = { token: string; expiresAt: number };
const sessions = new Map<string, Session>();

function issueToken(): string {
  const token = crypto.randomBytes(24).toString('hex');
  sessions.set(token, { token, expiresAt: Date.now() + TOKEN_TTL_MS });
  return token;
}

function isAuthed(req: express.Request): boolean {
  const header = req.headers.authorization;
  const bearer = header?.startsWith('Bearer ') ? header.slice(7) : undefined;
  const token = bearer || req.cookies?.jazz_admin;
  if (!token) return false;
  const session = sessions.get(token);
  if (!session || session.expiresAt < Date.now()) {
    sessions.delete(token);
    return false;
  }
  return true;
}

function requireAuth(
  req: express.Request,
  res: express.Response,
  next: express.NextFunction,
) {
  if (!isAuthed(req)) {
    res.status(401).json({ error: 'Unauthorized' });
    return;
  }
  next();
}

export function createApp() {
  ensureDb();
  const app = express();
  app.use(cors({ origin: true, credentials: true }));
  app.use(express.json({ limit: '2mb' }));
  app.use(cookieParser());

  app.get('/api/health', (_req, res) => {
    res.json({ ok: true });
  });

  app.get('/api/catalog', (_req, res) => {
    res.json(readPublicCatalog());
  });

  app.get('/api/admin/catalog', requireAuth, (_req, res) => {
    res.json(readCatalog());
  });

  app.post('/api/admin/login', (req, res) => {
    const password = String(req.body?.password ?? '');
    if (password !== ADMIN_PASSWORD) {
      res.status(401).json({ error: 'Invalid password' });
      return;
    }
    const token = issueToken();
    res.cookie('jazz_admin', token, {
      httpOnly: true,
      sameSite: 'lax',
      maxAge: TOKEN_TTL_MS,
    });
    res.json({ token, expiresInMs: TOKEN_TTL_MS });
  });

  app.post('/api/admin/logout', (req, res) => {
    const header = req.headers.authorization;
    const bearer = header?.startsWith('Bearer ') ? header.slice(7) : undefined;
    const token = bearer || req.cookies?.jazz_admin;
    if (token) sessions.delete(token);
    res.clearCookie('jazz_admin');
    res.json({ ok: true });
  });

  app.get('/api/admin/session', (req, res) => {
    res.json({ authenticated: isAuthed(req) });
  });

  app.post('/api/admin/parse-email', requireAuth, (req, res) => {
    const text = String(req.body?.text ?? '');
    const year = Number(req.body?.defaultYear ?? 2026);
    if (!text.trim()) {
      res.status(400).json({ error: 'Email text is required' });
      return;
    }
    const catalog = readCatalog();
    const parsed = parseJazzEmail(text, catalog.venues, { defaultYear: year });
    res.json(parsed);
  });

  app.post('/api/admin/import-events', requireAuth, (req, res) => {
    const drafts = Array.isArray(req.body?.drafts) ? req.body.drafts : [];
    const events: JazzEvent[] = [];
    for (const draft of drafts) {
      const event = draftToEvent(draft);
      if (event) events.push(event);
    }
    if (events.length === 0) {
      res.status(400).json({ error: 'No valid events to import' });
      return;
    }
    const replaceDates = Array.isArray(req.body?.replaceDates)
      ? req.body.replaceDates.map(String)
      : [];
    const edition = req.body?.editionLabel
      ? String(req.body.editionLabel)
      : undefined;
    const catalog = importEvents(events, {
      replaceDates,
      editionLabel: edition,
    });
    res.json({ imported: events.length, catalog });
  });

  app.put('/api/admin/edition', requireAuth, (req, res) => {
    res.json(updateEditionLabel(String(req.body?.editionLabel ?? '')));
  });

  app.put('/api/admin/events/:id', requireAuth, (req, res) => {
    const event = { ...(req.body as JazzEvent), id: req.params.id };
    if (!event.date || !event.artist || !event.venueId) {
      res.status(400).json({ error: 'date, artist, and venueId are required' });
      return;
    }
    res.json(upsertEvent(event));
  });

  app.post('/api/admin/events', requireAuth, (req, res) => {
    const body = req.body as JazzEvent;
    const event: JazzEvent = {
      ...body,
      id: body.id || `e${Date.now().toString(36)}`,
      deletedAt: null,
    };
    if (!event.date || !event.artist || !event.venueId) {
      res.status(400).json({ error: 'date, artist, and venueId are required' });
      return;
    }
    res.json(upsertEvent(event));
  });

  app.post('/api/admin/events/:id/archive', requireAuth, (req, res) => {
    res.json(archiveEvent(req.params.id));
  });

  app.post('/api/admin/events/:id/restore', requireAuth, (req, res) => {
    res.json(restoreEvent(req.params.id));
  });

  app.delete('/api/admin/events/:id', requireAuth, (req, res) => {
    // Permanent purge (trash only)
    res.json(purgeEvent(req.params.id));
  });

  app.put('/api/admin/venues/:id', requireAuth, (req, res) => {
    const venue = { ...(req.body as Venue), id: req.params.id };
    if (!venue.name || venue.lat == null || venue.lng == null) {
      res.status(400).json({ error: 'name, lat, and lng are required' });
      return;
    }
    res.json(upsertVenue(venue));
  });

  app.post('/api/admin/venues', requireAuth, (req, res) => {
    const body = req.body as Venue;
    const venue: Venue = {
      ...body,
      id:
        body.id ||
        body.name
          .toLowerCase()
          .replace(/[^a-z0-9]+/g, '-')
          .replace(/^-|-$/g, ''),
    };
    res.json(upsertVenue(venue));
  });

  app.put('/api/admin/series/:id', requireAuth, (req, res) => {
    const series = { ...(req.body as OngoingSeries), id: req.params.id };
    res.json(upsertSeries(series));
  });

  app.post('/api/admin/series', requireAuth, (req, res) => {
    const body = req.body as OngoingSeries;
    const series = { ...body, id: body.id || `o${Date.now().toString(36)}` };
    res.json(upsertSeries(series));
  });

  app.delete('/api/admin/series/:id', requireAuth, (req, res) => {
    res.json(deleteSeries(req.params.id));
  });

  app.post('/api/admin/reset-seed', requireAuth, (_req, res) => {
    res.json(resetToSeed());
  });

  return app;
}

const isMain =
  Boolean(process.argv[1]) &&
  path.resolve(process.argv[1]) === path.resolve(fileURLToPath(import.meta.url));

if (isMain) {
  const app = createApp();
  const dist = path.resolve(__dirname, '../dist');
  if (fs.existsSync(dist)) {
    app.use(express.static(dist));
    app.get(/^(?!\/api).*/, (_req, res) => {
      res.sendFile(path.join(dist, 'index.html'));
    });
  }
  app.listen(PORT, () => {
    console.log(`DFW Jazz API listening on http://localhost:${PORT}`);
  });
}
