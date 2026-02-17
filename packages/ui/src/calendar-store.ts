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

  function isSameDay(date1: Date, date2: Date): boolean {
    return (
      date1.getFullYear() === date2.getFullYear() &&
      date1.getMonth() === date2.getMonth() &&
      date1.getDate() === date2.getDate()
    );
  }

  function filterAndSort(predicate: (event: CalendarEvent) => boolean): CalendarEvent[] {
    return events
      .filter(predicate)
      .sort((a, b) => new Date(a.start).getTime() - new Date(b.start).getTime());
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
      const today = new Date();
      return filterAndSort((event) => isSameDay(new Date(event.start), today));
    },

    getUpcomingEvents() {
      const now = new Date();
      const maxDate = new Date(now.getFullYear(), now.getMonth(), now.getDate() + rangeDays + 1);
      return filterAndSort((event) => {
        const eventStart = new Date(event.start);
        return eventStart >= now && eventStart < maxDate;
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
