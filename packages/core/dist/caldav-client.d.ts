import type { CalendarEvent } from '@lensing/types';
import type { DataBusInstance } from '@lensing/types';
export interface CalDAVRequestOptions {
    method: string;
    headers: Record<string, string>;
    body?: string;
    signal?: AbortSignal;
}
export interface CalDAVResponse {
    ok: boolean;
    status: number;
    statusText: string;
    text(): Promise<string>;
    headers?: Record<string, string> | {
        get(name: string): string | null;
    };
}
export type CalDAVFetchFn = (url: string, options: CalDAVRequestOptions) => Promise<CalDAVResponse>;
/** Options for createCalendarServer */
export interface CalendarServerOptions {
    /** iCloud / CalDAV account username */
    username: string;
    /** App-specific password (not the main Apple ID password) */
    password: string;
    /** CalDAV server base URL, e.g. 'https://caldav.icloud.com' */
    serverUrl: string;
    /** Calendar collection path — if omitted, auto-discovered via PROPFIND */
    calendarPath?: string;
    /** Number of days ahead to fetch (default: 7) */
    rangeDays?: number;
    /** Max staleness in ms before re-fetching (default: 3600000 = 1 hour) */
    maxStale_ms?: number;
    /** Injectable fetch function (defaults to global fetch) */
    fetchFn?: CalDAVFetchFn;
    /** Request timeout in milliseconds (default: 30000) */
    timeoutMs?: number;
    /** Optional data bus to publish calendar events after each refresh */
    dataBus?: DataBusInstance;
}
/** Instance returned by createCalendarServer */
export interface CalendarServerInstance {
    /** Manually trigger an event refresh */
    refresh(): Promise<void>;
    /** Get the last fetched events (null if not yet fetched); returns a copy */
    getEvents(): CalendarEvent[] | null;
    /** Register a listener called when new events arrive; returns unsubscribe fn */
    onUpdate(callback: (events: CalendarEvent[]) => void): () => void;
    /** Register a listener called when an error occurs; returns unsubscribe fn */
    onError(callback: (error: string) => void): () => void;
    /** Stop refresh and release resources; clears all listeners */
    close(): void;
}
/**
 * Discover the first available calendar collection path via CalDAV PROPFIND.
 * Steps: server root → current-user-principal → calendar-home-set → list calendars
 */
export interface DiscoveredCalendar {
    /** Base URL of the pod-specific server (may differ from original serverUrl) */
    baseUrl: string;
    /** Calendar collection path on that server */
    path: string;
    /** Display name from CalDAV server */
    name: string;
}
export declare function discoverCalendars(serverUrl: string, authHeader: string, fetchFn: CalDAVFetchFn, timeoutMs: number): Promise<DiscoveredCalendar[]>;
/**
 * Creates a CalDAV calendar server module that fetches, caches, and publishes
 * calendar events from Apple iCloud (or any CalDAV server) using app-specific
 * password authentication.
 *
 * If calendarPath is omitted, the first available calendar is auto-discovered.
 */
export declare function createCalendarServer(options: CalendarServerOptions): CalendarServerInstance;
//# sourceMappingURL=caldav-client.d.ts.map