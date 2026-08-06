import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { addDays, format, parseISO } from 'date-fns';
import { CalendarView, eventsOnDate } from '../components/CalendarView';
import { EventCard } from '../components/EventCard';
import { MapView } from '../components/MapView';
import { OngoingPanel } from '../components/OngoingPanel';
import { useCatalog } from '../lib/catalog';
import type { JazzEvent } from '../types';

type ViewMode = 'calendar' | 'map' | 'ongoing';

export default function PublicDashboard() {
  const { catalog, venueById, loading, error, refresh } = useCatalog();
  const { editionLabel, ongoing } = catalog;
  const events = useMemo(
    () => catalog.events.filter((e) => !e.deletedAt),
    [catalog.events],
  );

  useEffect(() => {
    void refresh();
  }, [refresh]);

  const [view, setView] = useState<ViewMode>('calendar');
  const [month, setMonth] = useState(() => new Date(2026, 7, 1));
  const [selectedDate, setSelectedDate] = useState(() => new Date(2026, 7, 6));
  const [selectedEventId, setSelectedEventId] = useState<string | null>(null);
  const [selectedVenueId, setSelectedVenueId] = useState<string | null>(null);
  const [search, setSearch] = useState('');
  const [mapFocusDay, setMapFocusDay] = useState(true);
  const [mapFocusToken, setMapFocusToken] = useState(0);

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
    if (view === 'map') {
      setMapFocusToken((t) => t + 1);
    }
  }

  function openMapView() {
    setMapFocusDay(true);
    setMapFocusToken((t) => t + 1);
    setView('map');
  }

  function shiftDay(delta: number) {
    const next = addDays(selectedDate, delta);
    setSelectedDate(next);
    setSelectedEventId(null);
    setSelectedVenueId(null);
    setMonth(new Date(next.getFullYear(), next.getMonth(), 1));
    if (view === 'map') setMapFocusToken((t) => t + 1);
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
                onClick={() => {
                  if (id === 'map') openMapView();
                  else setView(id);
                }}
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
                        onChange={(e) => {
                          setMapFocusDay(e.target.checked);
                          setMapFocusToken((t) => t + 1);
                        }}
                      />
                      Pin venues for selected day only
                    </label>
                    <button
                      type="button"
                      className="ghost-btn"
                      onClick={() => {
                        setSelectedVenueId(null);
                        setSelectedEventId(null);
                        setMapFocusToken((t) => t + 1);
                      }}
                    >
                      Show all day pins
                    </button>
                  </div>
                  <MapView
                    events={filtered}
                    selectedVenueId={selectedVenueId}
                    onSelectVenue={(venueId) => {
                      setSelectedVenueId(venueId);
                      setSelectedEventId(null);
                      setMapFocusToken((t) => t + 1);
                    }}
                    focusDate={mapFocusDay ? selectedDate : null}
                    focusToken={mapFocusToken}
                  />
                </>
              )}
            </div>

            <aside className="layout__aside">
              <div className="aside-head">
                <div className="aside-head__title-row">
                  <button
                    type="button"
                    className="aside-day-nav"
                    onClick={() => shiftDay(-1)}
                    aria-label={`Previous day, ${format(addDays(selectedDate, -1), 'EEEE, MMMM d')}`}
                  >
                    ‹
                  </button>
                  <h2>{format(selectedDate, 'EEEE, MMMM d')}</h2>
                  <button
                    type="button"
                    className="aside-day-nav"
                    onClick={() => shiftDay(1)}
                    aria-label={`Next day, ${format(addDays(selectedDate, 1), 'EEEE, MMMM d')}`}
                  >
                    ›
                  </button>
                </div>
                <p>
                  {listEvents.length} show{listEvents.length === 1 ? '' : 's'}
                  {selectedVenueId && venueById[selectedVenueId]
                    ? ` · ${venueById[selectedVenueId].name}`
                    : ''}
                </p>
                {selectedVenueId && (
                  <button
                    type="button"
                    className="ghost-btn aside-crumb__clear"
                    onClick={() => {
                      setSelectedVenueId(null);
                      setSelectedEventId(null);
                      if (view === 'map') setMapFocusToken((t) => t + 1);
                    }}
                  >
                    ← All shows on {format(selectedDate, 'MMM d')}
                  </button>
                )}
              </div>

              {view === 'calendar' && (
                <button
                  type="button"
                  className="ghost-btn aside-map-link"
                  onClick={openMapView}
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
