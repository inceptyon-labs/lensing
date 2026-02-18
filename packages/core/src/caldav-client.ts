import type { CalendarEvent } from '@lensing/types';

// ── Types ─────────────────────────────────────────────────────────────────────

export interface CalDAVRequestOptions {
  method: string;
  headers: Record<string, string>;
  body?: string;
}

export interface CalDAVResponse {
  ok: boolean;
  status: number;
  statusText: string;
  text(): Promise<string>;
  headers?: Record<string, string> | { get(name: string): string | null };
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
  /** Calendar collection path, e.g. '/calendars/user@icloud.com/calendar/' */
  calendarPath: string;
  /** Number of days ahead to fetch (default: 7) */
  rangeDays?: number;
  /** Max staleness in ms before re-fetching (default: 3600000 = 1 hour) */
  maxStale_ms?: number;
  /** Injectable fetch function (defaults to global fetch) */
  fetchFn?: CalDAVFetchFn;
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

// ── Constants ─────────────────────────────────────────────────────────────────

const DEFAULT_RANGE_DAYS = 7;
const DEFAULT_MAX_STALE_MS = 3_600_000; // 1 hour
const MAX_RETRIES = 2;
const RETRY_BASE_DELAY_MS = 50;

// ── Helpers ───────────────────────────────────────────────────────────────────

function buildBasicAuth(username: string, password: string): string {
  return 'Basic ' + Buffer.from(`${username}:${password}`).toString('base64');
}

function formatICalDate(d: Date): string {
  return d.toISOString().replace(/[-:.]/g, '').slice(0, 15) + 'Z';
}

function buildCalendarQuery(start: Date, end: Date): string {
  return `<?xml version="1.0" encoding="utf-8"?>
<C:calendar-query xmlns:D="DAV:" xmlns:C="urn:ietf:params:xml:ns:caldav">
  <D:prop>
    <D:getetag/>
    <C:calendar-data/>
  </D:prop>
  <C:filter>
    <C:comp-filter name="VCALENDAR">
      <C:comp-filter name="VEVENT">
        <C:time-range DTSTART="${formatICalDate(start)}" DTEND="${formatICalDate(end)}"/>
      </C:comp-filter>
    </C:comp-filter>
  </C:filter>
</C:calendar-query>`;
}

function deriveCalendarName(calendarPath: string): string {
  const segments = calendarPath.split('/').filter(Boolean);
  return segments[segments.length - 1] ?? 'calendar';
}

function extractCalendarData(xml: string): string[] {
  const results: string[] = [];
  const re = /<[a-zA-Z]*:?calendar-data[^>]*>([\s\S]*?)<\/[a-zA-Z]*:?calendar-data>/gi;
  let match: RegExpExecArray | null;
  while ((match = re.exec(xml)) !== null) {
    const content = match[1].trim();
    if (content) results.push(content);
  }
  return results;
}

function getICalProp(vevent: string, prop: string): string | undefined {
  const re = new RegExp(`^${prop}(?:;[^:]*)?:(.*)$`, 'm');
  const m = vevent.match(re);
  return m ? m[1].trim() : undefined;
}

interface ICalDateResult {
  isoStr: string;
  allDay: boolean;
}

function parseICalDate(val: string, params: string): ICalDateResult {
  const isDate = params.includes('VALUE=DATE');
  if (isDate) {
    const y = val.slice(0, 4);
    const mo = val.slice(4, 6);
    const d = val.slice(6, 8);
    return { isoStr: `${y}-${mo}-${d}`, allDay: true };
  }
  // DATETIME: YYYYMMDDTHHmmss[Z]
  const y = val.slice(0, 4);
  const mo = val.slice(4, 6);
  const d = val.slice(6, 8);
  const h = val.slice(9, 11);
  const min = val.slice(11, 13);
  const s = val.slice(13, 15);
  const utc = val.endsWith('Z') ? 'Z' : '';
  return { isoStr: `${y}-${mo}-${d}T${h}:${min}:${s}${utc}`, allDay: false };
}

function parseVEvent(veventStr: string, calendarName: string): CalendarEvent {
  const uid = getICalProp(veventStr, 'UID') ?? '';
  const summary = getICalProp(veventStr, 'SUMMARY') ?? 'Untitled';
  const location = getICalProp(veventStr, 'LOCATION');

  // DTSTART may be "DTSTART:..." or "DTSTART;VALUE=DATE:..."
  const dtStartRaw = veventStr.match(/^DTSTART(?:;([^:]*))?: *(.*)$/m);
  const dtEndRaw = veventStr.match(/^DTEND(?:;([^:]*))?: *(.*)$/m);

  const startParams = dtStartRaw?.[1] ?? '';
  const startVal = dtStartRaw?.[2]?.trim() ?? '';
  const endParams = dtEndRaw?.[1] ?? '';
  const endVal = dtEndRaw?.[2]?.trim() ?? '';

  const { isoStr: start, allDay } = parseICalDate(startVal, startParams);
  const { isoStr: end } = parseICalDate(endVal, endParams);

  const event: CalendarEvent = { id: uid, title: summary, start, end, calendar: calendarName };
  if (location) event.location = location;
  if (allDay) event.allDay = true;
  return event;
}

function parseCalendarData(icalData: string, calendarName: string): CalendarEvent[] {
  const veventBlocks = icalData.match(/BEGIN:VEVENT[\s\S]*?END:VEVENT/g) ?? [];
  return veventBlocks.map((block) => parseVEvent(block, calendarName));
}

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

// ── Factory ───────────────────────────────────────────────────────────────────

/**
 * Creates a CalDAV calendar server module that fetches, caches, and publishes
 * calendar events from Apple iCloud (or any CalDAV server) using app-specific
 * password authentication.
 */
export function createCalendarServer(options: CalendarServerOptions): CalendarServerInstance {
  const { username, password, serverUrl, calendarPath } = options;

  if (!username) throw new Error('CalendarServer: username is required');
  if (!password) throw new Error('CalendarServer: password is required');
  if (!serverUrl) throw new Error('CalendarServer: serverUrl is required');
  if (!calendarPath) throw new Error('CalendarServer: calendarPath is required');
  if (!serverUrl.startsWith('https://'))
    throw new Error('CalendarServer: serverUrl must use HTTPS');

  const rangeDays = options.rangeDays ?? DEFAULT_RANGE_DAYS;
  const maxStale_ms = options.maxStale_ms ?? DEFAULT_MAX_STALE_MS;
  const fetchFn = options.fetchFn ?? (fetch as unknown as CalDAVFetchFn);

  const calendarName = deriveCalendarName(calendarPath);
  const authHeader = buildBasicAuth(username, password);

  let lastEvents: CalendarEvent[] | null = null;
  let lastFetchedAt: number | null = null;
  let closed = false;
  let refreshInFlight: Promise<void> | null = null;

  const updateListeners: Array<(events: CalendarEvent[]) => void> = [];
  const errorListeners: Array<(error: string) => void> = [];

  function notifyUpdate(events: CalendarEvent[]): void {
    for (const cb of updateListeners) {
      try {
        cb(events);
      } catch {
        // isolate listener errors
      }
    }
  }

  function notifyError(message: string): void {
    for (const cb of errorListeners) {
      try {
        cb(message);
      } catch {
        // isolate listener errors
      }
    }
  }

  async function doFetch(attempt: number = 0): Promise<void> {
    const now = new Date();
    const end = new Date(now.getTime() + rangeDays * 24 * 60 * 60 * 1000);
    const url = `${serverUrl}${calendarPath}`;
    const body = buildCalendarQuery(now, end);

    let response: CalDAVResponse;
    try {
      response = await fetchFn(url, {
        method: 'REPORT',
        headers: {
          Authorization: authHeader,
          'Content-Type': 'application/xml; charset=utf-8',
          Depth: '1',
        },
        body,
      });
    } catch (err) {
      const message = err instanceof Error ? err.message : String(err);
      if (attempt < MAX_RETRIES) {
        await sleep(RETRY_BASE_DELAY_MS * Math.pow(2, attempt));
        return doFetch(attempt + 1);
      }
      notifyError(`CalDAV fetch failed: ${message}`);
      return;
    }

    // Auth errors: never retry
    if (response.status === 401 || response.status === 403) {
      notifyError(`CalDAV auth error ${response.status}: ${response.statusText}`);
      return;
    }

    // Rate limit: report and stop
    if (response.status === 429) {
      notifyError(`CalDAV rate limited ${response.status}: ${response.statusText}`);
      return;
    }

    // Other HTTP errors
    if (!response.ok) {
      notifyError(`CalDAV error ${response.status}: ${response.statusText}`);
      return;
    }

    let xml: string;
    try {
      xml = await response.text();
    } catch (err) {
      const message = err instanceof Error ? err.message : String(err);
      notifyError(`CalDAV response parse error: ${message}`);
      return;
    }

    const events: CalendarEvent[] = [];
    const calDataBlocks = extractCalendarData(xml);
    for (const block of calDataBlocks) {
      const parsed = parseCalendarData(block, calendarName);
      events.push(...parsed);
    }

    lastEvents = events;
    lastFetchedAt = Date.now();
    notifyUpdate(events);
  }

  async function refresh(): Promise<void> {
    if (closed) return;

    // If a refresh is already in flight, wait for it instead of issuing duplicate request
    if (refreshInFlight) {
      await refreshInFlight;
      return;
    }

    // Return cached data if still fresh
    if (lastFetchedAt !== null && maxStale_ms > 0 && Date.now() - lastFetchedAt < maxStale_ms) {
      return;
    }

    // Mark that refresh is in flight, run it, then clear flag
    const fetchPromise = doFetch();
    refreshInFlight = fetchPromise;
    try {
      await fetchPromise;
    } finally {
      refreshInFlight = null;
    }
  }

  return {
    refresh,

    getEvents(): CalendarEvent[] | null {
      return lastEvents ? [...lastEvents] : null;
    },

    onUpdate(callback: (events: CalendarEvent[]) => void): () => void {
      updateListeners.push(callback);
      return () => {
        const idx = updateListeners.indexOf(callback);
        if (idx !== -1) updateListeners.splice(idx, 1);
      };
    },

    onError(callback: (error: string) => void): () => void {
      errorListeners.push(callback);
      return () => {
        const idx = errorListeners.indexOf(callback);
        if (idx !== -1) errorListeners.splice(idx, 1);
      };
    },

    close(): void {
      closed = true;
      updateListeners.length = 0;
      errorListeners.length = 0;
    },
  };
}
