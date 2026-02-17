import { describe, it, expect, beforeEach } from 'vitest';
import { createCalendarStore, type CalendarStore } from '../calendar-store';
import type { CalendarEvent } from '@lensing/types';

function makeEvent(id: string, overrides?: Partial<CalendarEvent>): CalendarEvent {
  const now = new Date();
  const start = new Date(now.getTime() + 3600000); // 1 hour from now
  const end = new Date(now.getTime() + 7200000); // 2 hours from now
  return {
    id,
    title: `Event ${id}`,
    start: start.toISOString(),
    end: end.toISOString(),
    calendar: 'personal',
    ...overrides,
  };
}

function makeTodayEvent(
  id: string,
  hourOffset: number,
  overrides?: Partial<CalendarEvent>
): CalendarEvent {
  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const start = new Date(today.getTime() + hourOffset * 3600000);
  const end = new Date(start.getTime() + 3600000);
  return {
    id,
    title: `Event ${id}`,
    start: start.toISOString(),
    end: end.toISOString(),
    calendar: 'personal',
    ...overrides,
  };
}

function makeFutureEvent(
  id: string,
  daysFromNow: number,
  overrides?: Partial<CalendarEvent>
): CalendarEvent {
  const now = new Date();
  const start = new Date(now.getFullYear(), now.getMonth(), now.getDate() + daysFromNow, 10, 0);
  const end = new Date(start.getTime() + 3600000);
  return {
    id,
    title: `Event ${id}`,
    start: start.toISOString(),
    end: end.toISOString(),
    calendar: 'personal',
    ...overrides,
  };
}

describe('CalendarStore', () => {
  let store: CalendarStore;

  beforeEach(() => {
    store = createCalendarStore();
  });

  describe('event management', () => {
    it('should create an empty store', () => {
      expect(store.getEvents()).toEqual([]);
    });

    it('should set events', () => {
      const events = [makeEvent('1'), makeEvent('2')];
      store.setEvents(events);
      expect(store.getEvents().length).toBe(2);
    });

    it('should replace events on subsequent setEvents', () => {
      store.setEvents([makeEvent('1'), makeEvent('2')]);
      store.setEvents([makeEvent('3')]);
      expect(store.getEvents().length).toBe(1);
      expect(store.getEvents()[0].id).toBe('3');
    });
  });

  describe('today filtering', () => {
    it('should return only today events', () => {
      const todayEvent = makeTodayEvent('today', 10);
      const futureEvent = makeFutureEvent('future', 3);

      store.setEvents([todayEvent, futureEvent]);
      const today = store.getTodayEvents();

      expect(today.length).toBe(1);
      expect(today[0].id).toBe('today');
    });

    it('should sort today events by start time', () => {
      const morning = makeTodayEvent('morning', 8);
      const evening = makeTodayEvent('evening', 18);
      const noon = makeTodayEvent('noon', 12);

      store.setEvents([evening, morning, noon]);
      const today = store.getTodayEvents();

      expect(today.map((e) => e.id)).toEqual(['morning', 'noon', 'evening']);
    });

    it('should include multi-day events that span today', () => {
      const now = new Date();
      const yesterday = new Date(now.getFullYear(), now.getMonth(), now.getDate() - 1, 10);
      const tomorrow = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1, 10);
      const spanning: CalendarEvent = {
        id: 'spanning',
        title: 'Multi-day',
        start: yesterday.toISOString(),
        end: tomorrow.toISOString(),
        calendar: 'work',
      };

      store.setEvents([spanning]);
      const today = store.getTodayEvents();
      expect(today.map((e) => e.id)).toContain('spanning');
    });

    it('should handle date-only strings as local dates', () => {
      const now = new Date();
      const todayStr = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;
      const tomorrowDate = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1);
      const tomorrowStr = `${tomorrowDate.getFullYear()}-${String(tomorrowDate.getMonth() + 1).padStart(2, '0')}-${String(tomorrowDate.getDate()).padStart(2, '0')}`;

      const allDay: CalendarEvent = {
        id: 'allday',
        title: 'All Day',
        start: todayStr,
        end: tomorrowStr,
        calendar: 'personal',
        allDay: true,
      };

      store.setEvents([allDay]);
      const today = store.getTodayEvents();
      expect(today.map((e) => e.id)).toContain('allday');
    });
  });

  describe('upcoming range filtering', () => {
    it('should return events within default range (7 days)', () => {
      const tomorrow = makeFutureEvent('tomorrow', 1);
      const nextWeek = makeFutureEvent('nextWeek', 5);
      const tooFar = makeFutureEvent('tooFar', 10);

      store.setEvents([tomorrow, nextWeek, tooFar]);
      const upcoming = store.getUpcomingEvents();

      expect(upcoming.map((e) => e.id)).toContain('tomorrow');
      expect(upcoming.map((e) => e.id)).toContain('nextWeek');
      expect(upcoming.map((e) => e.id)).not.toContain('tooFar');
    });

    it('should support configurable range', () => {
      store = createCalendarStore({ rangeDays: 3 });
      const day2 = makeFutureEvent('day2', 2);
      const day5 = makeFutureEvent('day5', 5);

      store.setEvents([day2, day5]);
      const upcoming = store.getUpcomingEvents();

      expect(upcoming.map((e) => e.id)).toContain('day2');
      expect(upcoming.map((e) => e.id)).not.toContain('day5');
    });

    it('should sort upcoming events by start time', () => {
      const day3 = makeFutureEvent('day3', 3);
      const day1 = makeFutureEvent('day1', 1);
      const day2 = makeFutureEvent('day2', 2);

      store.setEvents([day3, day1, day2]);
      const upcoming = store.getUpcomingEvents();

      expect(upcoming.map((e) => e.id)).toEqual(['day1', 'day2', 'day3']);
    });
  });

  describe('widget size modes', () => {
    it('should default to small size', () => {
      expect(store.getSize()).toBe('small');
    });

    it('should switch between sizes', () => {
      store.setSize('large');
      expect(store.getSize()).toBe('large');

      store.setSize('small');
      expect(store.getSize()).toBe('small');
    });

    it('should allow initial size configuration', () => {
      store = createCalendarStore({ size: 'large' });
      expect(store.getSize()).toBe('large');
    });
  });

  describe('calendar color-coding', () => {
    it('should preserve calendar source on events', () => {
      const work = makeEvent('1', { calendar: 'work', color: '#4285f4' });
      const personal = makeEvent('2', {
        calendar: 'personal',
        color: '#34a853',
      });

      store.setEvents([work, personal]);
      const events = store.getEvents();

      expect(events.find((e) => e.id === '1')?.calendar).toBe('work');
      expect(events.find((e) => e.id === '1')?.color).toBe('#4285f4');
      expect(events.find((e) => e.id === '2')?.calendar).toBe('personal');
    });
  });

  describe('staleness tracking', () => {
    it('should not be stale initially', () => {
      expect(store.isStale()).toBe(false);
    });

    it('should mark as stale after threshold', () => {
      store = createCalendarStore({ staleness_ms: 100 });
      store.setEvents([makeEvent('1')]);

      // Not stale immediately
      expect(store.isStale()).toBe(false);
    });

    it('should track last updated timestamp', () => {
      const before = Date.now();
      store.setEvents([makeEvent('1')]);
      const after = Date.now();

      const lastUpdated = store.getLastUpdated();
      expect(lastUpdated).toBeGreaterThanOrEqual(before);
      expect(lastUpdated).toBeLessThanOrEqual(after);
    });

    it('should return 0 for lastUpdated when never set', () => {
      expect(store.getLastUpdated()).toBe(0);
    });
  });

  describe('loading/error states', () => {
    it('should not be loading initially', () => {
      expect(store.isLoading()).toBe(false);
    });

    it('should track loading state', () => {
      store.setLoading(true);
      expect(store.isLoading()).toBe(true);

      store.setLoading(false);
      expect(store.isLoading()).toBe(false);
    });

    it('should have no error initially', () => {
      expect(store.getError()).toBeUndefined();
    });

    it('should track error state', () => {
      store.setError('Failed to fetch calendar');
      expect(store.getError()).toBe('Failed to fetch calendar');
    });

    it('should clear error', () => {
      store.setError('error');
      store.clearError();
      expect(store.getError()).toBeUndefined();
    });

    it('should clear error when setEvents succeeds', () => {
      store.setError('previous error');
      store.setEvents([makeEvent('1')]);
      expect(store.getError()).toBeUndefined();
    });
  });
});
