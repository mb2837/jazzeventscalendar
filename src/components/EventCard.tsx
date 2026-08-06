import { format, parseISO } from 'date-fns';
import type { JazzEvent } from '../types';
import { venueById } from '../data/venues';

function formatTime(t?: string): string {
  if (!t) return '';
  const [h, m] = t.split(':').map(Number);
  const period = h >= 12 ? 'PM' : 'AM';
  const hour = h % 12 || 12;
  return `${hour}:${String(m).padStart(2, '0')} ${period}`;
}

function timeRange(event: JazzEvent): string {
  const start = formatTime(event.startTime);
  const end = formatTime(event.endTime);
  if (start && end) return `${start} – ${end}`;
  if (start) return start;
  return 'Time TBA';
}

interface EventCardProps {
  event: JazzEvent;
  selected?: boolean;
  onSelect?: (event: JazzEvent) => void;
  showDate?: boolean;
}

export function EventCard({ event, selected, onSelect, showDate }: EventCardProps) {
  const venue = venueById[event.venueId];

  return (
    <article
      className={`event-card${selected ? ' is-selected' : ''}`}
      onClick={() => onSelect?.(event)}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          onSelect?.(event);
        }
      }}
      role={onSelect ? 'button' : undefined}
      tabIndex={onSelect ? 0 : undefined}
    >
      <div className="event-card__time">{timeRange(event)}</div>
      {showDate && (
        <div className="event-card__date">{format(parseISO(event.date), 'EEE, MMM d')}</div>
      )}
      <h3 className="event-card__artist">{event.artist}</h3>
      <p className="event-card__venue">
        {venue?.name ?? 'Venue TBA'}
        {venue ? ` · ${venue.city}` : ''}
      </p>
      {event.cover && <p className="event-card__cover">{event.cover}</p>}
      {event.musicians && <p className="event-card__notes">{event.musicians}</p>}
      {event.notes && <p className="event-card__notes">{event.notes}</p>}
      {event.ticketUrl && (
        <a
          className="event-card__tickets"
          href={event.ticketUrl}
          target="_blank"
          rel="noreferrer"
          onClick={(e) => e.stopPropagation()}
        >
          Tickets / info
        </a>
      )}
    </article>
  );
}
