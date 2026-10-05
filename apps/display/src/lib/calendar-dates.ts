import type { CalendarEvent } from '@lensing/types';

const DATE_ONLY = /^\d{4}-\d{2}-\d{2}$/;

function localDateStr(d: Date): string {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
}

/** Check if an event is still relevant (not in the past) */
export function isUpcoming(e: CalendarEvent, now: Date): boolean {
  if (e.allDay) {
    // All-day events: compare date strings to avoid timezone issues
    // DTEND in iCal is exclusive, so an all-day event on Mar 10 has end "2026-03-11"
    // Show it if end date string > today string (meaning it hasn't fully passed)
    return e.end.slice(0, 10) > localDateStr(now);
  }
  // Timed events: compare timestamps
  return new Date(e.end).getTime() >= now.getTime();
}

export function getDayLabel(isoStr: string, now: Date): string {
  // Date-only values are parsed by component to avoid a UTC shift; timed values
  // (UTC ISO strings) use the local date of the instant.
  const dateStr =
    DATE_ONLY.test(isoStr.slice(0, 10)) && isoStr.length === 10
      ? isoStr
      : localDateStr(new Date(isoStr));
  const today = localDateStr(now);
  const tom = new Date(now);
  tom.setDate(tom.getDate() + 1);
  const tomorrowStr = localDateStr(tom);

  if (dateStr === today) return 'Today';
  if (dateStr === tomorrowStr) return 'Tomorrow';

  const [y, m, d] = dateStr.split('-').map(Number);
  const display = new Date(y, m - 1, d);
  return display.toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' });
}
