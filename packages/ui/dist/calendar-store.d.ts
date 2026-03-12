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
export declare function createCalendarStore(options?: CalendarStoreOptions): CalendarStore;
//# sourceMappingURL=calendar-store.d.ts.map