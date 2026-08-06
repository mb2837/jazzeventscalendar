import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { format, parseISO } from 'date-fns';
import { CalendarView, eventsOnDate } from '../components/CalendarView';
import { EventCard } from '../components/EventCard';
import { MapView } from '../components/MapView';
import { OngoingPanel } from '../components/OngoingPanel';
import { useCatalog } from '../lib/catalog';
import type { JazzEvent } from '../types';

type ViewMode = 'calendar' | 'map' | 'ongoing';

export default function PublicDashboard() {
  const { catalog, venueById, loading, error } = useCatalog();
  const { editionLabel, events, ongoing } = catalog;

  const [view, setView] = useState<ViewMode>('calendar');
  const [month, setMonth] = useState(() => new Date(2026, 7, 1));
  const [selectedDate, setSelectedDate] = useState(() => new Date(2026, 7, 6));
  const [selectedEventId, setSelectedEventId] = useState<string | null>(null);
  const [selectedVenueId, setSelectedVenueId] = useState<string | null>(null);
  const [search, setSearch] = useState('');
  const [mapFocusDay, setMapFocusDay] = useState(true);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return events;
    return events.filter((e) => {
      const venue = venueById[e.venueId];
      return (
        e.artist.toLowerCase().includes(q) ||
        venue?.name.toLowerCase().includes(q) ||
        venue?.city.toLowerCase().includes(q) ||
        e.notes?.toLowerCase().includes(q) ||
        e.musicians?.toLowerCase().includes(q)
      );
    });
  }, [search, events, venueById]);

  const dayEvents = useMemo(
    () => eventsOnDate(filtered, selectedDate),
    [filtered, selectedDate],
  );

  const listEvents = selectedVenueId
    ? dayEvents.filter((e) => e.venueId === selectedVenueId)
    : dayEvents;

  function handleSelectEvent(event: JazzEvent) {
    setSelectedEventId(event.id);
    setSelectedVenueId(event.venueId);
    setSelectedDate(parseISO(event.date));
  }

  const stats = useMemo(() => {
    const venueIds = new Set(filtered.map((e) => e.venueId));
    return { shows: filtered.length, venues: venueIds.size };
  }, [filtered]);

  return (
    <div className="app">
      <div className="app__atmosphere" aria-hidden="true" />

      <header className="hero">
        <div className="hero__top">
          <p className="hero__kicker">{editionLabel}</p>
          <Link className="hero__admin-link" to="/admin">
            Admin
          </Link>
        </div>
        <h1 className="hero__brand">DFW Jazz Circuit</h1>
        <p className="hero__lede">
          Calendar and venue map for the monthly jazz email — {stats.shows} dated
          shows across {stats.venues} rooms.
        </p>
        {loading && <p className="hero__status">Loading latest catalog…</p>}
        {error && (
          <p className="hero__status hero__status--warn">
            Using built-in seed ({error}). Start the API with npm run dev.
          </p>
        )}

        <div className="hero__controls">
          <label className="search">
            <span className="sr-only">Search artists or venues</span>
            <input
              type="search"
              placeholder="Search artists, venues, cities…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </label>
          <nav className="tabs" aria-label="Views">
            {(
              [
                ['calendar', 'Calendar'],
                ['map', 'Map'],
                ['ongoing', 'On-going'],
              ] as const
            ).map(([id, label]) => (
              <button
                key={id}
                type="button"
                className={`tabs__btn${view === id ? ' is-active' : ''}`}
                onClick={() => setView(id)}
              >
                {label}
              </button>
            ))}
          </nav>
        </div>
      </header>

      <main className="stage">
        {view === 'ongoing' ? (
          <OngoingPanel items={ongoing} />
        ) : (
          <div className={`layout${view === 'map' ? ' layout--map' : ''}`}>
            <div className="layout__primary">
              {view === 'calendar' ? (
                <CalendarView
                  month={month}
                  onMonthChange={setMonth}
                  events={filtered}
                  selectedDate={selectedDate}
                  onSelectDate={(d) => {
                    setSelectedDate(d);
                    setSelectedEventId(null);
                    setSelectedVenueId(null);
                    setMonth(new Date(d.getFullYear(), d.getMonth(), 1));
                  }}
                />
              ) : (
                <>
                  <div className="map-toolbar">
                    <label className="toggle">
                      <input
                        type="checkbox"
                        checked={mapFocusDay}
                        onChange={(e) => setMapFocusDay(e.target.checked)}
                      />
                      Pin venues for selected day only
                    </label>
                    <button
                      type="button"
                      className="ghost-btn"
                      onClick={() => {
                        setSelectedVenueId(null);
                        setSelectedEventId(null);
                      }}
                    >
                      Clear venue filter
                    </button>
                  </div>
                  <MapView
                    events={filtered}
                    selectedVenueId={selectedVenueId}
                    onSelectVenue={(venueId) => {
                      setSelectedVenueId(venueId);
                      setSelectedEventId(null);
                    }}
                    focusDate={mapFocusDay ? selectedDate : null}
                  />
                </>
              )}
            </div>

            <aside className="layout__aside">
              <div className="aside-head">
                <h2>{format(selectedDate, 'EEEE, MMMM d')}</h2>
                <p>
                  {listEvents.length} show{listEvents.length === 1 ? '' : 's'}
                  {selectedVenueId && venueById[selectedVenueId]
                    ? ` · ${venueById[selectedVenueId].name}`
                    : ''}
                </p>
              </div>

              {view === 'calendar' && (
                <button
                  type="button"
                  className="ghost-btn aside-map-link"
                  onClick={() => setView('map')}
                >
                  See these venues on the map →
                </button>
              )}

              <div className="event-list">
                {listEvents.length === 0 ? (
                  <p className="empty">No listed shows for this day.</p>
                ) : (
                  listEvents.map((event) => (
                    <EventCard
                      key={event.id}
                      event={event}
                      selected={selectedEventId === event.id}
                      onSelect={handleSelectEvent}
                    />
                  ))
                )}
              </div>
            </aside>
          </div>
        )}
      </main>

      <footer className="footer">
        <p>
          Parsed from the community jazz email. Venue coordinates are approximate.
          Manage listings in Admin.
        </p>
      </footer>
    </div>
  );
}
