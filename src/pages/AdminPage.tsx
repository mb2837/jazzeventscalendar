import { useEffect, useMemo, useState, type FormEvent } from 'react';
import { Link } from 'react-router-dom';
import { format, parseISO } from 'date-fns';
import { api, setToken } from '../lib/api';
import { useCatalog } from '../lib/catalog';
import type { JazzEvent, ParsedEventDraft, Venue } from '../types';
import { TimeField } from '../components/TimeField';
import './AdminPage.css';

type AdminTab = 'events' | 'import' | 'venues' | 'series';

export default function AdminPage() {
  const { catalog, setCatalog, refreshAdmin } = useCatalog();
  const [authed, setAuthed] = useState(false);
  const [checking, setChecking] = useState(true);
  const [password, setPassword] = useState('');
  const [loginError, setLoginError] = useState<string | null>(null);
  const [tab, setTab] = useState<AdminTab>('events');
  const [status, setStatus] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const session = await api.session();
        if (cancelled) return;
        setAuthed(session.authenticated);
        if (!session.authenticated) setToken(null);
        else await refreshAdmin();
      } catch {
        if (!cancelled) setAuthed(false);
      } finally {
        if (!cancelled) setChecking(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [refreshAdmin]);

  async function handleLogin(e: FormEvent) {
    e.preventDefault();
    setLoginError(null);
    try {
      const { token } = await api.login(password);
      setToken(token);
      setAuthed(true);
      setPassword('');
      await refreshAdmin();
    } catch (err) {
      setLoginError(err instanceof Error ? err.message : 'Login failed');
    }
  }

  async function handleLogout() {
    try {
      await api.logout();
    } catch {
      /* ignore */
    }
    setToken(null);
    setAuthed(false);
  }

  if (checking) {
    return (
      <div className="admin">
        <p className="admin__muted">Checking session…</p>
      </div>
    );
  }

  if (!authed) {
    return (
      <div className="admin admin--login">
        <div className="admin-card">
          <p className="admin-card__kicker">DFW Jazz Events</p>
          <h1>Admin</h1>
          <p className="admin__muted">
            Sign in to add, edit, and archive shows. Email import is optional.
            Default local password: <code>jazzadmin</code>
          </p>
          <form onSubmit={handleLogin} className="admin-login">
            <label>
              Password
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoFocus
              />
            </label>
            {loginError && <p className="admin__error">{loginError}</p>}
            <button type="submit" className="admin-btn">
              Sign in
            </button>
          </form>
          <Link to="/" className="admin__back">
            ← Back to calendar
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="admin">
      <header className="admin-header">
        <div>
          <p className="admin-card__kicker">DFW Jazz Events</p>
          <h1>Admin</h1>
          <p className="admin__muted">
            {catalog.events.filter((e) => !e.deletedAt).length} active ·{' '}
            {catalog.events.filter((e) => e.deletedAt).length} in trash ·{' '}
            {catalog.venues.length} venues · {catalog.ongoing.length} series
          </p>
        </div>
        <div className="admin-header__actions">
          <Link to="/" className="ghost-btn">
            View site
          </Link>
          <button type="button" className="ghost-btn" onClick={() => void handleLogout()}>
            Sign out
          </button>
        </div>
      </header>

      <nav className="tabs admin-tabs" aria-label="Admin sections">
        {(
          [
            ['events', 'Events'],
            ['venues', 'Venues'],
            ['series', 'On-going'],
            ['import', 'Bulk import'],
          ] as const
        ).map(([id, label]) => (
          <button
            key={id}
            type="button"
            className={`tabs__btn${tab === id ? ' is-active' : ''}`}
            onClick={() => setTab(id)}
          >
            {label}
          </button>
        ))}
      </nav>

      {status && <p className="admin__status">{status}</p>}

      {tab === 'events' && (
        <EventsPanel
          onChange={(next, message) => {
            setCatalog(next);
            setStatus(message);
          }}
        />
      )}
      {tab === 'venues' && (
        <VenuesPanel
          onChange={(next, message) => {
            setCatalog(next);
            setStatus(message);
          }}
        />
      )}
      {tab === 'series' && (
        <SeriesPanel
          onChange={(next, message) => {
            setCatalog(next);
            setStatus(message);
          }}
        />
      )}
      {tab === 'import' && (
        <ImportPanel
          onImported={(next, message) => {
            setCatalog(next);
            setStatus(message);
          }}
        />
      )}
    </div>
  );
}

function ImportPanel({
  onImported,
}: {
  onImported: (catalog: import('../types').Catalog, message: string) => void;
}) {
  const { catalog } = useCatalog();
  const [text, setText] = useState('');
  const [year, setYear] = useState(2026);
  const [editionLabel, setEditionLabel] = useState(catalog.editionLabel);
  const [drafts, setDrafts] = useState<ParsedEventDraft[]>([]);
  const [replaceDates, setReplaceDates] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const selected = drafts.filter((d) => d.selected);
  const dates = useMemo(
    () => [...new Set(selected.map((d) => d.date).filter(Boolean) as string[])],
    [selected],
  );

  async function parse() {
    setBusy(true);
    setError(null);
    try {
      const result = await api.parseEmail(text, year);
      setDrafts(result.drafts);
      if (result.editionLabel) setEditionLabel(result.editionLabel);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Parse failed');
    } finally {
      setBusy(false);
    }
  }

  async function publish() {
    setBusy(true);
    setError(null);
    try {
      const result = await api.importEvents({
        drafts: selected,
        replaceDates: replaceDates ? dates : [],
        editionLabel,
      });
      onImported(
        result.catalog,
        `Imported ${result.imported} event${result.imported === 1 ? '' : 's'}.`,
      );
      setDrafts([]);
      setText('');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Import failed');
    } finally {
      setBusy(false);
    }
  }

  function updateDraft(id: string, patch: Partial<ParsedEventDraft>) {
    setDrafts((prev) => prev.map((d) => (d.id === id ? { ...d, ...patch } : d)));
  }

  return (
    <section className="admin-panel">
      <h2>Bulk import from email</h2>
      <p className="admin__muted">
        Optional. Prefer adding and editing shows under Events. Paste a monthly
        email here when you want a bulk assist — review drafts before publishing.
      </p>

      <div className="admin-grid-2">
        <label>
          Default year
          <input
            type="number"
            value={year}
            onChange={(e) => setYear(Number(e.target.value))}
          />
        </label>
        <label>
          Edition label
          <input
            value={editionLabel}
            onChange={(e) => setEditionLabel(e.target.value)}
          />
        </label>
      </div>

      <label className="admin-block">
        Email text
        <textarea
          rows={12}
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Paste the full jazz events email here…"
        />
      </label>

      <div className="admin-actions">
        <button
          type="button"
          className="admin-btn"
          disabled={busy || !text.trim()}
          onClick={() => void parse()}
        >
          {busy ? 'Working…' : 'Parse email'}
        </button>
      </div>

      {error && <p className="admin__error">{error}</p>}

      {drafts.length > 0 && (
        <>
          <div className="admin-import-meta">
            <p>
              {drafts.length} drafts · {selected.length} selected
            </p>
            <div className="admin-actions">
              <button
                type="button"
                className="ghost-btn"
                onClick={() =>
                  setDrafts((prev) => prev.map((d) => ({ ...d, selected: true })))
                }
              >
                Select all
              </button>
              <button
                type="button"
                className="ghost-btn"
                onClick={() =>
                  setDrafts((prev) => prev.map((d) => ({ ...d, selected: false })))
                }
              >
                Select none
              </button>
            </div>
          </div>

          <label className="toggle">
            <input
              type="checkbox"
              checked={replaceDates}
              onChange={(e) => setReplaceDates(e.target.checked)}
            />
            Archive existing events on selected dates ({dates.length} date
            {dates.length === 1 ? '' : 's'}) before import
          </label>

          <div className="draft-list">
            {drafts.map((draft) => (
              <DraftRow
                key={draft.id}
                draft={draft}
                venues={catalog.venues}
                onChange={(patch) => updateDraft(draft.id, patch)}
              />
            ))}
          </div>

          <div className="admin-actions">
            <button
              type="button"
              className="admin-btn"
              disabled={busy || selected.length === 0}
              onClick={() => void publish()}
            >
              Import {selected.length} selected
            </button>
          </div>
        </>
      )}
    </section>
  );
}

function DraftRow({
  draft,
  venues,
  onChange,
}: {
  draft: ParsedEventDraft;
  venues: Venue[];
  onChange: (patch: Partial<ParsedEventDraft>) => void;
}) {
  return (
    <article className={`draft-row${draft.selected ? '' : ' is-dim'}`}>
      <label className="draft-row__check">
        <input
          type="checkbox"
          checked={draft.selected}
          onChange={(e) => onChange({ selected: e.target.checked })}
        />
      </label>
      <div className="draft-row__fields">
        <div className="admin-grid-2">
          <label>
            Date
            <input
              type="date"
              value={draft.date ?? ''}
              onChange={(e) => onChange({ date: e.target.value || undefined })}
            />
          </label>
          <label>
            Venue
            <select
              value={draft.venueId ?? ''}
              onChange={(e) => onChange({ venueId: e.target.value || undefined })}
            >
              <option value="">Unmatched…</option>
              {venues.map((v) => (
                <option key={v.id} value={v.id}>
                  {v.name}
                </option>
              ))}
            </select>
          </label>
        </div>
        <label>
          Artist
          <input
            value={draft.artist}
            onChange={(e) => onChange({ artist: e.target.value })}
          />
        </label>
        <div className="admin-grid-3">
          <label>
            Start
            <TimeField
              value={draft.startTime}
              onChange={(startTime) => onChange({ startTime })}
            />
          </label>
          <label>
            End
            <TimeField
              value={draft.endTime}
              onChange={(endTime) => onChange({ endTime })}
            />
          </label>
          <label>
            Cover
            <input
              value={draft.cover ?? ''}
              onChange={(e) => onChange({ cover: e.target.value || undefined })}
            />
          </label>
        </div>
        {draft.warnings.length > 0 && (
          <ul className="draft-warnings">
            {draft.warnings.map((w) => (
              <li key={w}>{w}</li>
            ))}
          </ul>
        )}
        <details>
          <summary>Raw line</summary>
          <p>{draft.raw}</p>
        </details>
      </div>
    </article>
  );
}

function EventsPanel({
  onChange,
}: {
  onChange: (catalog: import('../types').Catalog, message: string) => void;
}) {
  const { catalog } = useCatalog();
  const [filter, setFilter] = useState('');
  const [listMode, setListMode] = useState<'active' | 'trash'>('active');
  const [editing, setEditing] = useState<JazzEvent | null>(null);
  const [error, setError] = useState<string | null>(null);

  const trashCount = catalog.events.filter((e) => e.deletedAt).length;

  const filtered = useMemo(() => {
    const q = filter.trim().toLowerCase();
    const list = catalog.events
      .filter((e) => (listMode === 'trash' ? Boolean(e.deletedAt) : !e.deletedAt))
      .sort((a, b) =>
        `${a.date}${a.startTime ?? ''}`.localeCompare(`${b.date}${b.startTime ?? ''}`),
      );
    if (!q) return list;
    return list.filter(
      (e) =>
        e.artist.toLowerCase().includes(q) ||
        e.date.includes(q) ||
        catalog.venues.find((v) => v.id === e.venueId)?.name.toLowerCase().includes(q),
    );
  }, [catalog, filter, listMode]);

  async function save() {
    if (!editing) return;
    setError(null);
    try {
      const payload = {
        ...editing,
        deletedAt: listMode === 'trash' ? editing.deletedAt ?? null : null,
      };
      const next = editing.id.startsWith('new-')
        ? await api.createEvent({ ...payload, id: `e${Date.now().toString(36)}` })
        : await api.saveEvent(payload);
      onChange(next, 'Event saved.');
      setEditing(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Save failed');
    }
  }

  async function archive(id: string) {
    if (!confirm('Move this event to trash? You can restore it later.')) return;
    const next = await api.archiveEvent(id);
    onChange(next, 'Event moved to trash.');
    if (editing?.id === id) setEditing(null);
  }

  async function restore(id: string) {
    const next = await api.restoreEvent(id);
    onChange(next, 'Event restored.');
  }

  async function purge(id: string) {
    if (!confirm('Permanently delete this event? This cannot be undone.')) return;
    const next = await api.purgeEvent(id);
    onChange(next, 'Event permanently deleted.');
    if (editing?.id === id) setEditing(null);
  }

  return (
    <section className="admin-panel">
      <div className="admin-import-meta">
        <div>
          <h2>Events</h2>
          <p className="admin__muted" style={{ margin: '0.35rem 0 0' }}>
            Add and edit shows manually. Archive sends them to trash — not gone.
          </p>
        </div>
        {listMode === 'active' && (
          <button
            type="button"
            className="admin-btn"
            onClick={() =>
              setEditing({
                id: `new-${Date.now()}`,
                date: format(new Date(), 'yyyy-MM-dd'),
                artist: '',
                venueId: catalog.venues[0]?.id ?? '',
                startTime: '19:30',
                deletedAt: null,
              })
            }
          >
            Add event
          </button>
        )}
      </div>

      <div className="admin-subtabs" role="tablist" aria-label="Event lists">
        <button
          type="button"
          className={`admin-subtabs__btn${listMode === 'active' ? ' is-active' : ''}`}
          onClick={() => {
            setListMode('active');
            setEditing(null);
          }}
        >
          Active
        </button>
        <button
          type="button"
          className={`admin-subtabs__btn${listMode === 'trash' ? ' is-active' : ''}`}
          onClick={() => {
            setListMode('trash');
            setEditing(null);
          }}
        >
          Trash{trashCount > 0 ? ` (${trashCount})` : ''}
        </button>
      </div>

      <input
        className="admin-filter"
        placeholder="Filter events…"
        value={filter}
        onChange={(e) => setFilter(e.target.value)}
      />
      {error && <p className="admin__error">{error}</p>}
      {editing && listMode === 'active' && (
        <EventEditor
          event={editing}
          venues={catalog.venues}
          onChange={setEditing}
          onCancel={() => setEditing(null)}
          onSave={() => void save()}
        />
      )}
      <div className="admin-table">
        {filtered.length === 0 ? (
          <p className="admin__muted">
            {listMode === 'trash' ? 'Trash is empty.' : 'No active events match.'}
          </p>
        ) : (
          filtered.map((event) => {
            const venue = catalog.venues.find((v) => v.id === event.venueId);
            return (
              <div key={event.id} className="admin-table__row">
                <div>
                  <strong>{event.artist}</strong>
                  <p className="admin__muted">
                    {format(parseISO(event.date), 'EEE MMM d')}
                    {event.startTime ? ` · ${event.startTime}` : ''}
                    {venue ? ` · ${venue.name}` : ''}
                    {event.deletedAt
                      ? ` · archived ${format(parseISO(event.deletedAt), 'MMM d, yyyy')}`
                      : ''}
                  </p>
                </div>
                <div className="admin-actions">
                  {listMode === 'active' ? (
                    <>
                      <button
                        type="button"
                        className="ghost-btn"
                        onClick={() => setEditing(event)}
                      >
                        Edit
                      </button>
                      <button
                        type="button"
                        className="ghost-btn"
                        onClick={() => void archive(event.id)}
                      >
                        Archive
                      </button>
                    </>
                  ) : (
                    <>
                      <button
                        type="button"
                        className="ghost-btn"
                        onClick={() => void restore(event.id)}
                      >
                        Restore
                      </button>
                      <button
                        type="button"
                        className="ghost-btn ghost-btn--danger"
                        onClick={() => void purge(event.id)}
                      >
                        Delete forever
                      </button>
                    </>
                  )}
                </div>
              </div>
            );
          })
        )}
      </div>
    </section>
  );
}

function EventEditor({
  event,
  venues,
  onChange,
  onCancel,
  onSave,
}: {
  event: JazzEvent;
  venues: Venue[];
  onChange: (event: JazzEvent) => void;
  onCancel: () => void;
  onSave: () => void;
}) {
  return (
    <div className="admin-editor">
      <div className="admin-grid-2">
        <label>
          Date
          <input
            type="date"
            value={event.date}
            onChange={(e) => onChange({ ...event, date: e.target.value })}
          />
        </label>
        <label>
          Venue
          <select
            value={event.venueId}
            onChange={(e) => onChange({ ...event, venueId: e.target.value })}
          >
            {venues.map((v) => (
              <option key={v.id} value={v.id}>
                {v.name}
              </option>
            ))}
          </select>
        </label>
      </div>
      <label>
        Artist
        <input
          value={event.artist}
          onChange={(e) => onChange({ ...event, artist: e.target.value })}
        />
      </label>
      <div className="admin-grid-3">
        <label>
          Start
          <TimeField
            value={event.startTime}
            onChange={(startTime) => onChange({ ...event, startTime })}
            allowEmpty={false}
          />
        </label>
        <label>
          End
          <TimeField
            value={event.endTime}
            onChange={(endTime) => onChange({ ...event, endTime })}
          />
        </label>
        <label>
          Cover
          <input
            value={event.cover ?? ''}
            onChange={(e) => onChange({ ...event, cover: e.target.value || undefined })}
          />
        </label>
      </div>
      <label>
        Notes
        <textarea
          rows={3}
          value={event.notes ?? ''}
          onChange={(e) => onChange({ ...event, notes: e.target.value || undefined })}
        />
      </label>
      <label>
        Ticket URL
        <input
          value={event.ticketUrl ?? ''}
          onChange={(e) =>
            onChange({ ...event, ticketUrl: e.target.value || undefined })
          }
        />
      </label>
      <div className="admin-actions">
        <button type="button" className="admin-btn" onClick={onSave}>
          Save
        </button>
        <button type="button" className="ghost-btn" onClick={onCancel}>
          Cancel
        </button>
      </div>
    </div>
  );
}

function VenuesPanel({
  onChange,
}: {
  onChange: (catalog: import('../types').Catalog, message: string) => void;
}) {
  const { catalog } = useCatalog();
  const [editing, setEditing] = useState<Venue | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function save() {
    if (!editing) return;
    setError(null);
    try {
      const next = catalog.venues.some((v) => v.id === editing.id)
        ? await api.saveVenue(editing)
        : await api.createVenue(editing);
      onChange(next, 'Venue saved.');
      setEditing(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Save failed');
    }
  }

  return (
    <section className="admin-panel">
      <div className="admin-import-meta">
        <h2>Venues</h2>
        <button
          type="button"
          className="admin-btn"
          onClick={() =>
            setEditing({
              id: '',
              name: '',
              address: '',
              city: 'Dallas',
              lat: 32.78,
              lng: -96.8,
            })
          }
        >
          Add venue
        </button>
      </div>
      {error && <p className="admin__error">{error}</p>}
      {editing && (
        <div className="admin-editor">
          <div className="admin-grid-2">
            <label>
              Name
              <input
                value={editing.name}
                onChange={(e) => setEditing({ ...editing, name: e.target.value })}
              />
            </label>
            <label>
              City
              <input
                value={editing.city}
                onChange={(e) => setEditing({ ...editing, city: e.target.value })}
              />
            </label>
          </div>
          <label>
            Address
            <input
              value={editing.address}
              onChange={(e) => setEditing({ ...editing, address: e.target.value })}
            />
          </label>
          <div className="admin-grid-2">
            <label>
              Lat
              <input
                type="number"
                step="0.0001"
                value={editing.lat}
                onChange={(e) =>
                  setEditing({ ...editing, lat: Number(e.target.value) })
                }
              />
            </label>
            <label>
              Lng
              <input
                type="number"
                step="0.0001"
                value={editing.lng}
                onChange={(e) =>
                  setEditing({ ...editing, lng: Number(e.target.value) })
                }
              />
            </label>
          </div>
          <div className="admin-actions">
            <button type="button" className="admin-btn" onClick={() => void save()}>
              Save
            </button>
            <button type="button" className="ghost-btn" onClick={() => setEditing(null)}>
              Cancel
            </button>
          </div>
        </div>
      )}
      <div className="admin-table">
        {catalog.venues.map((venue) => (
          <div key={venue.id} className="admin-table__row">
            <div>
              <strong>{venue.name}</strong>
              <p className="admin__muted">
                {venue.address}, {venue.city}
              </p>
            </div>
            <button type="button" className="ghost-btn" onClick={() => setEditing(venue)}>
              Edit
            </button>
          </div>
        ))}
      </div>
    </section>
  );
}

function SeriesPanel({
  onChange,
}: {
  onChange: (catalog: import('../types').Catalog, message: string) => void;
}) {
  const { catalog } = useCatalog();

  async function remove(id: string) {
    if (!confirm('Delete this series?')) return;
    const next = await api.deleteSeries(id);
    onChange(next, 'Series deleted.');
  }

  return (
    <section className="admin-panel">
      <h2>On-going series</h2>
      <p className="admin__muted">
        Recurring listings from the email footer. Edit via API reset/seed for now,
        or delete stale rows here.
      </p>
      <div className="admin-table">
        {catalog.ongoing.map((item) => (
          <div key={item.id} className="admin-table__row">
            <div>
              <strong>{item.title}</strong>
              <p className="admin__muted">{item.schedule}</p>
            </div>
            <button type="button" className="ghost-btn" onClick={() => void remove(item.id)}>
              Delete
            </button>
          </div>
        ))}
      </div>
      <div className="admin-actions" style={{ marginTop: '1rem' }}>
        <button
          type="button"
          className="ghost-btn"
          onClick={async () => {
            if (!confirm('Reset catalog to the built-in seed data?')) return;
            const next = await api.resetSeed();
            onChange(next, 'Catalog reset to seed.');
          }}
        >
          Reset catalog to seed
        </button>
      </div>
    </section>
  );
}
