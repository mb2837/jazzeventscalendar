import {
  addMonths,
  eachDayOfInterval,
  endOfMonth,
  endOfWeek,
  format,
  isSameDay,
  isSameMonth,
  parseISO,
  startOfMonth,
  startOfWeek,
} from 'date-fns';
import type { JazzEvent } from '../types';

interface CalendarViewProps {
  month: Date;
  onMonthChange: (month: Date) => void;
  events: JazzEvent[];
  selectedDate: Date;
  onSelectDate: (date: Date) => void;
}

export function CalendarView({
  month,
  onMonthChange,
  events,
  selectedDate,
  onSelectDate,
}: CalendarViewProps) {
  const monthStart = startOfMonth(month);
  const days = eachDayOfInterval({
    start: startOfWeek(monthStart),
    end: endOfWeek(endOfMonth(monthStart)),
  });

  const counts = new Map<string, number>();
  for (const event of events) {
    counts.set(event.date, (counts.get(event.date) ?? 0) + 1);
  }

  return (
    <section className="calendar" aria-label="Event calendar">
      <header className="calendar__header">
        <button
          type="button"
          className="calendar__nav"
          onClick={() => onMonthChange(addMonths(month, -1))}
          aria-label="Previous month"
        >
          ‹
        </button>
        <h2 className="calendar__title">{format(month, 'MMMM yyyy')}</h2>
        <button
          type="button"
          className="calendar__nav"
          onClick={() => onMonthChange(addMonths(month, 1))}
          aria-label="Next month"
        >
          ›
        </button>
      </header>

      <div className="calendar__weekdays">
        {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((d) => (
          <div key={d} className="calendar__weekday">
            {d}
          </div>
        ))}
      </div>

      <div className="calendar__grid">
        {days.map((day) => {
          const key = format(day, 'yyyy-MM-dd');
          const count = counts.get(key) ?? 0;
          const inMonth = isSameMonth(day, month);
          const selected = isSameDay(day, selectedDate);
          const today = isSameDay(day, new Date());

          return (
            <button
              key={key}
              type="button"
              className={[
                'calendar__day',
                inMonth ? '' : 'is-outside',
                selected ? 'is-selected' : '',
                today ? 'is-today' : '',
                count > 0 ? 'has-events' : '',
              ]
                .filter(Boolean)
                .join(' ')}
              onClick={() => onSelectDate(day)}
            >
              <span className="calendar__day-num">{format(day, 'd')}</span>
              {count > 0 && (
                <span className="calendar__day-count" aria-label={`${count} events`}>
                  {count}
                </span>
              )}
            </button>
          );
        })}
      </div>
    </section>
  );
}

export function eventsOnDate(events: JazzEvent[], date: Date): JazzEvent[] {
  const key = format(date, 'yyyy-MM-dd');
  return events
    .filter((e) => e.date === key)
    .sort((a, b) => (a.startTime ?? '').localeCompare(b.startTime ?? ''));
}

export function parseEventDate(iso: string): Date {
  return parseISO(iso);
}
