import type { CalendarEvent } from '@lensing/types';
import type { DataBusInstance } from '@lensing/types';

// ── Types ─────────────────────────────────────────────────────────────────────

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

// ── Constants ─────────────────────────────────────────────────────────────────

const DEFAULT_RANGE_DAYS = 7;
const DEFAULT_MAX_STALE_MS = 3_600_000; // 1 hour
const DEFAULT_TIMEOUT_MS = 30_000; // 30 seconds
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
        <C:time-range start="${formatICalDate(start)}" end="${formatICalDate(end)}"/>
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
  return m ? unescapeICalText(m[1].trim()) : undefined;
}

/** Unescape RFC 5545 text escape sequences */
function unescapeICalText(text: string): string {
  return text
    .replace(/\\n/gi, '\n')
    .replace(/\\,/g, ',')
    .replace(/\\;/g, ';')
    .replace(/\\\\/g, '\\');
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

/** Unfold RFC 5545 line folding (continuation lines start with a space or tab). */
function unfoldICalLines(text: string): string {
  return text.replace(/\r?\n[ \t]/g, '');
}

function parseCalendarData(icalData: string, calendarName: string): CalendarEvent[] {
  const unfolded = unfoldICalLines(icalData);
  const veventBlocks = unfolded.match(/BEGIN:VEVENT[\s\S]*?END:VEVENT/g) ?? [];
  return veventBlocks.map((block) => parseVEvent(block, calendarName));
}

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

// ── CalDAV Discovery ──────────────────────────────────────────────────────────

/** Extract an XML text element value by tag name (handles namespace prefixes). */
function extractXmlValue(xml: string, tagName: string): string | undefined {
  const re = new RegExp(`<[a-zA-Z]*:?${tagName}[^>]*>([^<]*)<\\/[a-zA-Z]*:?${tagName}>`, 'i');
  const m = xml.match(re);
  return m?.[1]?.trim() || undefined;
}

/** Extract href from inside an XML element (handles nested <D:href>). */
function extractHref(xml: string, wrapperTag: string): string | undefined {
  const wrapperRe = new RegExp(
    `<[a-zA-Z]*:?${wrapperTag}[^>]*>([\\s\\S]*?)<\\/[a-zA-Z]*:?${wrapperTag}>`,
    'i'
  );
  const wrapper = xml.match(wrapperRe);
  if (!wrapper) return undefined;
  return extractXmlValue(wrapper[1], 'href');
}

/** PROPFIND request body for discovering the current user principal. */
const PROPFIND_PRINCIPAL = `<?xml version="1.0" encoding="utf-8"?>
<D:propfind xmlns:D="DAV:">
  <D:prop>
    <D:current-user-principal/>
  </D:prop>
</D:propfind>`;

/** PROPFIND request body for discovering calendar home set. */
const PROPFIND_CALENDAR_HOME = `<?xml version="1.0" encoding="utf-8"?>
<D:propfind xmlns:D="DAV:" xmlns:C="urn:ietf:params:xml:ns:caldav">
  <D:prop>
    <C:calendar-home-set/>
  </D:prop>
</D:propfind>`;

/** PROPFIND request body for listing calendars (resourcetype + displayname). */
const PROPFIND_CALENDARS = `<?xml version="1.0" encoding="utf-8"?>
<D:propfind xmlns:D="DAV:" xmlns:C="urn:ietf:params:xml:ns:caldav">
  <D:prop>
    <D:resourcetype/>
    <D:displayname/>
  </D:prop>
</D:propfind>`;

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

export async function discoverCalendars(
  serverUrl: string,
  authHeader: string,
  fetchFn: CalDAVFetchFn,
  timeoutMs: number
): Promise<DiscoveredCalendar[]> {
  const propfind = async (url: string, body: string): Promise<string> => {
    const controller = new AbortController();
    const tid = setTimeout(() => controller.abort(), timeoutMs);
    try {
      const res = await fetchFn(url, {
        method: 'PROPFIND',
        headers: {
          Authorization: authHeader,
          'Content-Type': 'application/xml; charset=utf-8',
          Depth: '0',
        },
        body,
        signal: controller.signal,
      });
      if (!res.ok && res.status !== 207) throw new Error(`PROPFIND ${url} returned ${res.status}`);
      return await res.text();
    } finally {
      clearTimeout(tid);
    }
  };

  const propfindList = async (url: string, body: string): Promise<string> => {
    const controller = new AbortController();
    const tid = setTimeout(() => controller.abort(), timeoutMs);
    try {
      const res = await fetchFn(url, {
        method: 'PROPFIND',
        headers: {
          Authorization: authHeader,
          'Content-Type': 'application/xml; charset=utf-8',
          Depth: '1',
        },
        body,
        signal: controller.signal,
      });
      if (!res.ok && res.status !== 207) throw new Error(`PROPFIND ${url} returned ${res.status}`);
      return await res.text();
    } finally {
      clearTimeout(tid);
    }
  };

  // Step 1: Find current-user-principal
  const principalXml = await propfind(serverUrl, PROPFIND_PRINCIPAL);
  const principalHref = extractHref(principalXml, 'current-user-principal');
  if (!principalHref) throw new Error('CalDAV discovery: could not find current-user-principal');

  const principalUrl = principalHref.startsWith('http')
    ? principalHref
    : `${serverUrl}${principalHref}`;

  // Step 2: Find calendar-home-set
  const homeXml = await propfind(principalUrl, PROPFIND_CALENDAR_HOME);
  const homeHref = extractHref(homeXml, 'calendar-home-set');
  if (!homeHref) throw new Error('CalDAV discovery: could not find calendar-home-set');

  // iCloud returns a full URL with a pod-specific host (e.g. p64-caldav.icloud.com)
  // We must use that host for subsequent requests, not the original serverUrl.
  const homeUrl = homeHref.startsWith('http') ? homeHref : `${serverUrl}${homeHref}`;
  let baseUrl = serverUrl;
  if (homeHref.startsWith('http')) {
    try {
      const parsed = new URL(homeHref);
      baseUrl = `${parsed.protocol}//${parsed.host}`;
    } catch {
      // fall back to original serverUrl
    }
  }

  // Step 3: List calendars under home set
  const listXml = await propfindList(homeUrl, PROPFIND_CALENDARS);

  // Extract the home path for comparison (to skip the home collection itself)
  let homePath = homeHref;
  if (homeHref.startsWith('http')) {
    try {
      homePath = new URL(homeHref).pathname;
    } catch {
      /* keep as-is */
    }
  }

  // Find <response> blocks that contain <calendar/> resourcetype (i.e. actual calendars)
  const calendars: DiscoveredCalendar[] = [];
  const responseBlocks =
    listXml.match(/<[a-zA-Z]*:?response\b[\s\S]*?<\/[a-zA-Z]*:?response>/gi) ?? [];
  for (const block of responseBlocks) {
    // Must have <calendar .../> or <calendar/> in resourcetype
    if (!/<[a-zA-Z]*:?calendar[\s/]/i.test(block)) continue;
    const href = extractXmlValue(block, 'href');
    // Skip the calendar home itself (Depth:1 includes the target)
    if (!href || href === homePath) continue;
    const calPath = href.startsWith('http') ? new URL(href).pathname : href;
    const displayName = extractXmlValue(block, 'displayname') ?? deriveCalendarName(calPath);
    calendars.push({ baseUrl, path: calPath, name: displayName });
  }

  if (calendars.length === 0) throw new Error('CalDAV discovery: no calendars found');
  return calendars;
}

// ── Factory ───────────────────────────────────────────────────────────────────

/**
 * Creates a CalDAV calendar server module that fetches, caches, and publishes
 * calendar events from Apple iCloud (or any CalDAV server) using app-specific
 * password authentication.
 *
 * If calendarPath is omitted, the first available calendar is auto-discovered.
 */
export function createCalendarServer(options: CalendarServerOptions): CalendarServerInstance {
  const { username, password, serverUrl, dataBus } = options;

  if (!username) throw new Error('CalendarServer: username is required');
  if (!password) throw new Error('CalendarServer: password is required');
  if (!serverUrl) throw new Error('CalendarServer: serverUrl is required');
  if (!serverUrl.startsWith('https://'))
    throw new Error('CalendarServer: serverUrl must use HTTPS');

  const rangeDays = options.rangeDays ?? DEFAULT_RANGE_DAYS;
  const maxStale_ms = options.maxStale_ms ?? DEFAULT_MAX_STALE_MS;
  const timeoutMs = options.timeoutMs ?? DEFAULT_TIMEOUT_MS;
  const fetchFn = options.fetchFn ?? (fetch as unknown as CalDAVFetchFn);

  const authHeader = buildBasicAuth(username, password);

  // Calendar targets: either a single explicit path, or all discovered calendars
  let resolvedTargets: Array<{ baseUrl: string; path: string; name: string }> | null = null;
  if (options.calendarPath) {
    resolvedTargets = [
      {
        baseUrl: serverUrl,
        path: options.calendarPath,
        name: deriveCalendarName(options.calendarPath),
      },
    ];
  }

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

  async function fetchOneCalendar(
    target: { baseUrl: string; path: string; name: string },
    now: Date,
    end: Date,
    attempt: number = 0
  ): Promise<CalendarEvent[]> {
    const url = `${target.baseUrl}${target.path}`;
    const body = buildCalendarQuery(now, end);

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), timeoutMs);

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
        signal: controller.signal,
      });
    } catch (err) {
      const isTimeout = err instanceof DOMException && err.name === 'AbortError';
      const message = isTimeout
        ? `CalDAV request timeout after ${timeoutMs}ms`
        : err instanceof Error
          ? err.message
          : String(err);
      if (attempt < MAX_RETRIES) {
        await sleep(RETRY_BASE_DELAY_MS * Math.pow(2, attempt));
        return fetchOneCalendar(target, now, end, attempt + 1);
      }
      notifyError(`CalDAV fetch failed (${target.name}): ${message}`);
      return [];
    } finally {
      clearTimeout(timeoutId);
    }

    if (response.status === 401 || response.status === 403) {
      console.log(`[CalDAV] ${target.name}: AUTH ERROR ${response.status}`);
      notifyError(`CalDAV auth error ${response.status}: ${response.statusText}`);
      return [];
    }
    if (response.status === 429) {
      notifyError(`CalDAV rate limited ${response.status}: ${response.statusText}`);
      return [];
    }
    if (!response.ok && response.status !== 207) {
      console.log(`[CalDAV] ${target.name}: HTTP ERROR ${response.status}`);
      notifyError(`CalDAV error ${response.status} (${target.name}): ${response.statusText}`);
      return [];
    }

    let xml: string;
    try {
      xml = await response.text();
    } catch (err) {
      const message = err instanceof Error ? err.message : String(err);
      notifyError(`CalDAV response parse error (${target.name}): ${message}`);
      return [];
    }

    console.log(`[CalDAV] ${target.name}: status=${response.status}, body=${xml.slice(0, 500)}`);

    const events: CalendarEvent[] = [];
    const calDataBlocks = extractCalendarData(xml);
    for (const block of calDataBlocks) {
      events.push(...parseCalendarData(block, target.name));
    }
    return events;
  }

  async function doFetch(): Promise<void> {
    // Auto-discover calendars if not set
    if (!resolvedTargets) {
      const discovered = await discoverCalendars(serverUrl, authHeader, fetchFn, timeoutMs);
      resolvedTargets = discovered;
    }

    const now = new Date();
    const end = new Date(now.getTime() + rangeDays * 24 * 60 * 60 * 1000);

    // Fetch all calendars in parallel
    console.log(
      `[CalDAV] Fetching ${resolvedTargets.length} calendars:`,
      resolvedTargets.map((t) => t.name)
    );
    const results = await Promise.all(resolvedTargets.map((t) => fetchOneCalendar(t, now, end)));
    const events = results.flat();
    console.log(
      `[CalDAV] Total events found: ${events.length}`,
      events.map((e) => `${e.calendar}: ${e.title}`)
    );

    lastEvents = events;
    lastFetchedAt = Date.now();
    notifyUpdate(events);
    if (dataBus) {
      dataBus.publish('calendar.events', 'calendar-server', {
        events: [...events],
        lastUpdated: Date.now(),
      });
    }
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
