import type { CalendarEvent, CalendarWidgetSize } from '@lensing/types';

export interface CalendarStoreOptions {
  size?: CalendarWidgetSize;
  rangeDays?: number;
  staleness_ms?: number;
}

export interface CalendarStore {
  getEvents(): CalendarEvent[];
  setEvents(events: CalendarEvent[]): void;
  getTodayEvents(): CalendarEvent[];
  getUpcomingEvents(): CalendarEvent[];
  getSize(): CalendarWidgetSize;
  setSize(size: CalendarWidgetSize): void;
  isStale(): boolean;
  getLastUpdated(): number;
  isLoading(): boolean;
  setLoading(loading: boolean): void;
  getError(): string | undefined;
  setError(error: string): void;
  clearError(): void;
}

export function createCalendarStore(options: CalendarStoreOptions = {}): CalendarStore {
  const { size = 'small', rangeDays = 7, staleness_ms = 300000 } = options;

  let events: CalendarEvent[] = [];
  let widgetSize: CalendarWidgetSize = size;
  let lastUpdated = 0;
  let loading = false;
  let error: string | undefined;

  /** Parse date string, treating date-only strings (YYYY-MM-DD) as local time */
  function parseDate(dateStr: string): Date {
    // Date-only strings (no 'T') are parsed as UTC by spec, causing timezone issues
    if (/^\d{4}-\d{2}-\d{2}$/.test(dateStr)) {
      const [y, m, d] = dateStr.split('-').map(Number);
      return new Date(y, m - 1, d);
    }
    return new Date(dateStr);
  }

  function startOfDay(date: Date): Date {
    return new Date(date.getFullYear(), date.getMonth(), date.getDate());
  }

  function filterAndSort(predicate: (event: CalendarEvent) => boolean): CalendarEvent[] {
    return events
      .filter(predicate)
      .sort((a, b) => parseDate(a.start).getTime() - parseDate(b.start).getTime());
  }

  return {
    getEvents() {
      return events;
    },

    setEvents(newEvents) {
      events = newEvents;
      lastUpdated = Date.now();
      error = undefined;
    },

    getTodayEvents() {
      const todayStart = startOfDay(new Date());
      const tomorrowStart = new Date(
        todayStart.getFullYear(),
        todayStart.getMonth(),
        todayStart.getDate() + 1
      );
      // Event overlaps today if it starts before tomorrow AND ends after today starts
      return filterAndSort((event) => {
        const eventStart = parseDate(event.start);
        const eventEnd = parseDate(event.end);
        return eventStart < tomorrowStart && eventEnd > todayStart;
      });
    },

    getUpcomingEvents() {
      const now = new Date();
      const maxDate = new Date(now.getFullYear(), now.getMonth(), now.getDate() + rangeDays + 1);
      // Event overlaps range if it starts before maxDate AND ends after now
      return filterAndSort((event) => {
        const eventStart = parseDate(event.start);
        const eventEnd = parseDate(event.end);
        return eventStart < maxDate && eventEnd > now;
      });
    },

    getSize() {
      return widgetSize;
    },

    setSize(newSize) {
      widgetSize = newSize;
    },

    isStale() {
      if (lastUpdated === 0) return false;
      return Date.now() - lastUpdated > staleness_ms;
    },

    getLastUpdated() {
      return lastUpdated;
    },

    isLoading() {
      return loading;
    },

    setLoading(isLoading) {
      loading = isLoading;
    },

    getError() {
      return error;
    },

    setError(errorMsg) {
      error = errorMsg;
    },

    clearError() {
      error = undefined;
    },
  };
}
