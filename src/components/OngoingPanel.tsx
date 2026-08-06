import type { OngoingSeries } from '../types';
import { venueById } from '../data/venues';

interface OngoingPanelProps {
  items: OngoingSeries[];
}

export function OngoingPanel({ items }: OngoingPanelProps) {
  return (
    <section className="ongoing" aria-label="Ongoing series">
      <h2 className="ongoing__title">On-going</h2>
      <ul className="ongoing__list">
        {items.map((item) => {
          const venue = item.venueId ? venueById[item.venueId] : undefined;
          return (
            <li key={item.id} className="ongoing__item">
              <h3>{item.title}</h3>
              <p className="ongoing__schedule">{item.schedule}</p>
              {venue && (
                <p className="ongoing__venue">
                  {venue.name} · {venue.city}
                </p>
              )}
              {item.cover && <p className="ongoing__cover">{item.cover}</p>}
              {item.notes && <p className="ongoing__notes">{item.notes}</p>}
              {item.url && (
                <a href={item.url} target="_blank" rel="noreferrer">
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
