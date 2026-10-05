import { describe, it, expect } from 'vitest';
import { getDayLabel, isUpcoming } from '../lib/calendar-dates';

describe('getDayLabel', () => {
  const now = new Date(2026, 2, 10, 12, 0); // local noon, Mar 10

  it('labels a timed UTC event by its local date', () => {
    const tonight = new Date(2026, 2, 10, 20, 30).toISOString(); // 8:30pm local, may be next day in UTC
    expect(getDayLabel(tonight, now)).toBe('Today');
    const tomorrow = new Date(2026, 2, 11, 0, 30).toISOString();
    expect(getDayLabel(tomorrow, now)).toBe('Tomorrow');
  });

  it('does not shift date-only values', () => {
    expect(getDayLabel('2026-03-10', now)).toBe('Today');
    expect(getDayLabel('2026-03-11', now)).toBe('Tomorrow');
    expect(getDayLabel('2026-03-14', now)).toBe('Saturday, Mar 14');
  });

  it('goes stale-free when now moves past midnight', () => {
    const after = new Date(2026, 2, 11, 0, 5);
    expect(getDayLabel('2026-03-11', after)).toBe('Today');
  });
});

describe('isUpcoming', () => {
  const now = new Date(2026, 2, 10, 12, 0);
  const base = { id: '1', title: 't', start: '', end: '', allDay: false, calendar: 'c' };

  it('drops timed events that ended before now', () => {
    const end = new Date(2026, 2, 10, 11, 0).toISOString();
    expect(isUpcoming({ ...base, start: end, end }, now)).toBe(false);
    const later = new Date(2026, 2, 10, 13, 0).toISOString();
    expect(isUpcoming({ ...base, start: later, end: later }, now)).toBe(true);
  });

  it('keeps all-day events until their exclusive end date', () => {
    expect(isUpcoming({ ...base, allDay: true, start: '2026-03-10', end: '2026-03-11' }, now)).toBe(
      true
    );
    expect(isUpcoming({ ...base, allDay: true, start: '2026-03-09', end: '2026-03-10' }, now)).toBe(
      false
    );
  });
});
