import { useEffect, useMemo } from 'react';
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
}

function FitBounds({
  venueIds,
  venueById,
}: {
  venueIds: string[];
  venueById: Record<string, Venue>;
}) {
  const map = useMap();
  useEffect(() => {
    const points = venueIds
      .map((id) => venueById[id])
      .filter(Boolean)
      .map((v) => [v.lat, v.lng] as [number, number]);
    if (points.length === 0) {
      map.setView([32.85, -96.9], 10);
      return;
    }
    if (points.length === 1) {
      map.setView(points[0], 13);
      return;
    }
    map.fitBounds(L.latLngBounds(points), { padding: [48, 48], maxZoom: 12 });
  }, [map, venueIds, venueById]);
  return null;
}

export function MapView({ events, selectedVenueId, onSelectVenue, focusDate }: MapViewProps) {
  const { catalog, venueById } = useCatalog();

  const scopedEvents = useMemo(() => {
    if (!focusDate) return events;
    const key = format(focusDate, 'yyyy-MM-dd');
    return events.filter((e) => e.date === key);
  }, [events, focusDate]);

  const venueCounts = useMemo(() => {
    const map = new Map<string, JazzEvent[]>();
    for (const event of scopedEvents) {
      const list = map.get(event.venueId) ?? [];
      list.push(event);
      map.set(event.venueId, list);
    }
    return map;
  }, [scopedEvents]);

  const activeVenueIds = [...venueCounts.keys()];
  const markers = catalog.venues.filter((v) => venueCounts.has(v.id));

  return (
    <section className="map-panel" aria-label="Venue map">
      <div className="map-panel__meta">
        <p>
          {focusDate
            ? `${markers.length} venue${markers.length === 1 ? '' : 's'} on ${format(focusDate, 'MMM d')}`
            : `${markers.length} venues across listed shows`}
        </p>
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
        <FitBounds venueIds={activeVenueIds} venueById={venueById} />
        {markers.map((venue) => {
          const shows = venueCounts.get(venue.id) ?? [];
          const active = selectedVenueId === venue.id;
          return (
            <Marker
              key={venue.id}
              position={[venue.lat, venue.lng]}
              icon={active ? activePinIcon : pinIcon}
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
