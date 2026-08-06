import { useEffect, useState } from 'react';

const HOURS = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];
const MINUTES = ['00', '05', '10', '15', '20', '25', '30', '35', '40', '45', '50', '55'];

function parseTime(value?: string): {
  hour12: number;
  minute: string;
  period: 'AM' | 'PM';
} | null {
  if (!value) return null;
  const match = value.trim().match(/^(\d{1,2}):(\d{2})$/);
  if (!match) return null;
  let hour24 = Number(match[1]);
  let minute = Number(match[2]);
  if (Number.isNaN(hour24) || Number.isNaN(minute) || hour24 > 23 || minute > 59) {
    return null;
  }
  minute = Math.round(minute / 5) * 5;
  if (minute === 60) {
    minute = 0;
    hour24 = (hour24 + 1) % 24;
  }
  const period: 'AM' | 'PM' = hour24 >= 12 ? 'PM' : 'AM';
  const hour12 = hour24 % 12 || 12;
  return {
    hour12,
    minute: String(minute).padStart(2, '0'),
    period,
  };
}

function toMilitary(hour12: number, minute: string, period: 'AM' | 'PM'): string {
  let hour24 = hour12 % 12;
  if (period === 'PM') hour24 += 12;
  return `${String(hour24).padStart(2, '0')}:${minute}`;
}

function useNativeTimeInput(): boolean {
  const [native, setNative] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia('(max-width: 720px), (pointer: coarse)');
    const sync = () => setNative(mq.matches);
    sync();
    mq.addEventListener('change', sync);
    return () => mq.removeEventListener('change', sync);
  }, []);
  return native;
}

interface TimeFieldProps {
  value?: string;
  onChange: (value: string | undefined) => void;
  allowEmpty?: boolean;
}

/** 12-hour selects on desktop; native time input on phone/coarse pointers. */
export function TimeField({ value, onChange, allowEmpty = true }: TimeFieldProps) {
  const useNative = useNativeTimeInput();
  const parsed = parseTime(value);
  const empty = !parsed;
  const hour12 = parsed?.hour12 ?? 7;
  const minute = parsed?.minute ?? '30';
  const period = parsed?.period ?? 'PM';

  function emit(nextHour: number, nextMinute: string, nextPeriod: 'AM' | 'PM') {
    onChange(toMilitary(nextHour, nextMinute, nextPeriod));
  }

  if (useNative) {
    return (
      <div className="time-field time-field--native">
        <input
          type="time"
          aria-label="Time"
          value={value ?? ''}
          step={300}
          onChange={(e) => onChange(e.target.value || undefined)}
        />
        {allowEmpty && value && (
          <button
            type="button"
            className="time-field__clear"
            onClick={() => onChange(undefined)}
          >
            Clear
          </button>
        )}
      </div>
    );
  }

  return (
    <div className="time-field">
      <select
        aria-label="Hour"
        value={allowEmpty && empty ? '' : String(hour12)}
        onChange={(e) => {
          if (e.target.value === '') {
            onChange(undefined);
            return;
          }
          emit(Number(e.target.value), minute, period);
        }}
      >
        {allowEmpty && <option value="">—</option>}
        {HOURS.map((h) => (
          <option key={h} value={h}>
            {h}
          </option>
        ))}
      </select>
      <span className="time-field__colon" aria-hidden="true">
        :
      </span>
      <select
        aria-label="Minute"
        disabled={empty && allowEmpty}
        value={minute}
        onChange={(e) => emit(empty ? 7 : hour12, e.target.value, empty ? 'PM' : period)}
      >
        {MINUTES.map((m) => (
          <option key={m} value={m}>
            {m}
          </option>
        ))}
      </select>
      <select
        aria-label="AM or PM"
        disabled={empty && allowEmpty}
        value={period}
        onChange={(e) =>
          emit(empty ? 7 : hour12, minute, e.target.value as 'AM' | 'PM')
        }
      >
        <option value="AM">AM</option>
        <option value="PM">PM</option>
      </select>
    </div>
  );
}
