import type { OngoingSeries } from '../types';
import { useCatalog } from '../lib/catalog';

interface OngoingPanelProps {
  items: OngoingSeries[];
  onSelectVenue?: (venueId: string) => void;
}

export function OngoingPanel({ items, onSelectVenue }: OngoingPanelProps) {
  const { venueById } = useCatalog();
  return (
    <section className="ongoing" aria-label="Ongoing series">
      <h2 className="ongoing__title">On-going</h2>
      <ul className="ongoing__list">
        {items.map((item) => {
          const venue = item.venueId ? venueById[item.venueId] : undefined;
          const canMap = Boolean(item.venueId && venue && onSelectVenue);
          return (
            <li key={item.id} className="ongoing__item">
              <button
                type="button"
                className={`ongoing__card${canMap ? ' is-mappable' : ''}`}
                disabled={!canMap}
                onClick={() => {
                  if (item.venueId && onSelectVenue) onSelectVenue(item.venueId);
                }}
              >
                <h3>{item.title}</h3>
                <p className="ongoing__schedule">{item.schedule}</p>
                {venue && (
                  <p className="ongoing__venue">
                    {venue.name} · {venue.city}
                  </p>
                )}
                {item.cover && <p className="ongoing__cover">{item.cover}</p>}
                {item.notes && <p className="ongoing__notes">{item.notes}</p>}
                {canMap && (
                  <span className="ongoing__map-hint">View on map →</span>
                )}
              </button>
              {item.url && (
                <a
                  className="ongoing__link"
                  href={item.url}
                  target="_blank"
                  rel="noreferrer"
                >
                  Link
                </a>
              )}
            </li>
          );
        })}
      </ul>
    </section>
  );
}
