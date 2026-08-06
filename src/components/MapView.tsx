import { useEffect, useMemo, useRef } from 'react';
import { MapContainer, Marker, Popup, TileLayer, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import type { JazzEvent, Venue } from '../types';
import { useCatalog } from '../lib/catalog';
import { format, parseISO } from 'date-fns';

const pinIcon = L.divIcon({
  className: 'jazz-pin',
  html: '<span class="jazz-pin__dot"></span>',
  iconSize: [22, 22],
  iconAnchor: [11, 11],
  popupAnchor: [0, -12],
});

const activePinIcon = L.divIcon({
  className: 'jazz-pin jazz-pin--active',
  html: '<span class="jazz-pin__dot"></span>',
  iconSize: [28, 28],
  iconAnchor: [14, 14],
  popupAnchor: [0, -14],
});

interface MapViewProps {
  events: JazzEvent[];
  selectedVenueId?: string | null;
  onSelectVenue: (venueId: string) => void;
  focusDate?: Date | null;
  /** Bump when opening map view so camera refits after layout. */
  focusToken?: number;
}

function MapCamera({
  venueIds,
  venueById,
  selectedVenueId,
  focusToken = 0,
}: {
  venueIds: string[];
  venueById: Record<string, Venue>;
  selectedVenueId?: string | null;
  focusToken?: number;
}) {
  const map = useMap();
  const venueKey = venueIds.slice().sort().join(',');

  useEffect(() => {
    map.invalidateSize();
    const t = window.setTimeout(() => map.invalidateSize(), 80);
    return () => window.clearTimeout(t);
  }, [map, focusToken]);

  useEffect(() => {
    const selected = selectedVenueId ? venueById[selectedVenueId] : undefined;
    if (selected) {
      map.flyTo([selected.lat, selected.lng], 14, { duration: 0.55 });
      return;
    }

    const points = venueIds
      .map((id) => venueById[id])
      .filter(Boolean)
      .map((v) => [v.lat, v.lng] as [number, number]);

    if (points.length === 0) {
      map.setView([32.85, -96.9], 10);
      return;
    }
    if (points.length === 1) {
      map.flyTo(points[0], 14, { duration: 0.45 });
      return;
    }

    const bounds = L.latLngBounds(points);
    map.flyToBounds(bounds, {
      padding: [64, 64],
      maxZoom: 13,
      duration: 0.55,
    });
  }, [map, venueKey, venueIds, venueById, selectedVenueId, focusToken]);

  return null;
}

export function MapView({
  events,
  selectedVenueId,
  onSelectVenue,
  focusDate,
  focusToken = 0,
}: MapViewProps) {
  const { catalog, venueById } = useCatalog();
  const markerRefs = useRef<Record<string, L.Marker>>({});

  const scopedEvents = useMemo(() => {
    if (!focusDate) return events;
    const key = format(focusDate, 'yyyy-MM-dd');
    return events.filter((e) => e.date === key);
  }, [events, focusDate]);

  const venueCounts = useMemo(() => {
    const counts = new Map<string, JazzEvent[]>();
    for (const event of scopedEvents) {
      const list = counts.get(event.venueId) ?? [];
      list.push(event);
      counts.set(event.venueId, list);
    }
    return counts;
  }, [scopedEvents]);

  const activeVenueIds = useMemo(() => [...venueCounts.keys()], [venueCounts]);
  const markers = catalog.venues.filter((v) => venueCounts.has(v.id));

  useEffect(() => {
    if (!selectedVenueId) return;
    const marker = markerRefs.current[selectedVenueId];
    if (!marker) return;
    const t = window.setTimeout(() => marker.openPopup(), 350);
    return () => window.clearTimeout(t);
  }, [selectedVenueId, focusToken]);

  const spreadHint =
    focusDate &&
    markers.length >= 2 &&
    !selectedVenueId &&
    (() => {
      const lats = markers.map((m) => m.lat);
      const lngs = markers.map((m) => m.lng);
      const latSpan = Math.max(...lats) - Math.min(...lats);
      const lngSpan = Math.max(...lngs) - Math.min(...lngs);
      return latSpan > 0.25 || lngSpan > 0.35;
    })();

  return (
    <section className="map-panel" aria-label="Venue map">
      <div className="map-panel__meta">
        <p>
          {focusDate ? (
            <>
              <strong>
                {markers.length} venue{markers.length === 1 ? '' : 's'}
              </strong>
              {` · ${format(focusDate, 'EEE, MMM d')} · ${scopedEvents.length} show${scopedEvents.length === 1 ? '' : 's'}`}
            </>
          ) : (
            <>
              <strong>
                {markers.length} venue{markers.length === 1 ? '' : 's'}
              </strong>
              {' across listed shows'}
            </>
          )}
        </p>
        {spreadHint && (
          <p className="map-panel__hint">
            Pins span the metro — click a show or pin to zoom in.
          </p>
        )}
        {selectedVenueId && venueById[selectedVenueId] && (
          <p className="map-panel__hint">
            Focused on {venueById[selectedVenueId].name}
          </p>
        )}
      </div>
      <MapContainer
        className="map-panel__map"
        center={[32.85, -96.9]}
        zoom={10}
        scrollWheelZoom
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
        />
        <MapCamera
          venueIds={activeVenueIds}
          venueById={venueById}
          selectedVenueId={selectedVenueId}
          focusToken={focusToken}
        />
        {markers.map((venue) => {
          const shows = venueCounts.get(venue.id) ?? [];
          const active = selectedVenueId === venue.id;
          return (
            <Marker
              key={venue.id}
              position={[venue.lat, venue.lng]}
              icon={active ? activePinIcon : pinIcon}
              ref={(ref) => {
                if (ref) markerRefs.current[venue.id] = ref;
                else delete markerRefs.current[venue.id];
              }}
              eventHandlers={{
                click: () => onSelectVenue(venue.id),
              }}
            >
              <Popup>
                <strong>{venue.name}</strong>
                <br />
                {venue.address}, {venue.city}
                <ul className="map-popup-list">
                  {shows.slice(0, 6).map((show) => (
                    <li key={show.id}>
                      {!focusDate && (
                        <span>{format(parseISO(show.date), 'MMM d')} · </span>
                      )}
                      {show.artist}
                    </li>
                  ))}
                  {shows.length > 6 && <li>+{shows.length - 6} more</li>}
                </ul>
              </Popup>
            </Marker>
          );
        })}
      </MapContainer>
    </section>
  );
}
