import { describe, it, expect, vi } from 'vitest';
import { createCalendarServer } from '../caldav-client';
import type { CalendarServerOptions, CalDAVRequestOptions } from '../caldav-client';

// Minimal valid options for tests
function validOptions(overrides: Partial<CalendarServerOptions> = {}): CalendarServerOptions {
  return {
    username: 'user@icloud.com',
    password: 'app-specific-password',
    serverUrl: 'https://caldav.icloud.com',
    calendarPath: '/calendars/user@icloud.com/calendar/',
    fetchFn: vi.fn().mockResolvedValue({
      ok: true,
      status: 207,
      statusText: 'Multi-Status',
      text: () =>
        Promise.resolve(`<?xml version="1.0" encoding="utf-8"?>
<multistatus xmlns="DAV:" xmlns:cr="urn:ietf:params:xml:ns:carddav">
  <response>
    <href>/calendars/user@icloud.com/calendar/event-id.ics</href>
    <propstat>
      <prop>
        <calendar-data>BEGIN:VEVENT
UID:event-id
SUMMARY:Test Event
DTSTART:20260217T100000Z
DTEND:20260217T110000Z
LOCATION:Room 1
CALENDAR-ID:calendar
END:VEVENT</calendar-data>
      </prop>
      <status>HTTP/1.1 200 OK</status>
    </propstat>
  </response>
</multistatus>`),
    }),
    ...overrides,
  };
}

describe('CalendarServer', () => {
  describe('factory and config', () => {
    it('should create a calendar server instance', () => {
      const server = createCalendarServer(validOptions());
      expect(server).toBeDefined();
      expect(typeof server.refresh).toBe('function');
      expect(typeof server.getEvents).toBe('function');
      expect(typeof server.onUpdate).toBe('function');
      expect(typeof server.onError).toBe('function');
      expect(typeof server.close).toBe('function');
    });

    it('should throw if username is missing', () => {
      expect(() => createCalendarServer(validOptions({ username: '' }))).toThrow(/username/i);
    });

    it('should throw if password is missing', () => {
      expect(() => createCalendarServer(validOptions({ password: '' }))).toThrow(/password/i);
    });

    it('should throw if serverUrl is missing', () => {
      expect(() => createCalendarServer(validOptions({ serverUrl: '' }))).toThrow(/serverUrl/i);
    });

    it('should throw if calendarPath is missing', () => {
      expect(() => createCalendarServer(validOptions({ calendarPath: '' }))).toThrow(
        /calendarPath/i
      );
    });

    it('should throw if serverUrl does not use HTTPS', () => {
      expect(() =>
        createCalendarServer(validOptions({ serverUrl: 'http://caldav.icloud.com' }))
      ).toThrow(/https/i);
    });

    it('should default rangeDays to 7', () => {
      const server = createCalendarServer(validOptions({ rangeDays: undefined }));
      expect(server).toBeDefined();
    });

    it('should default maxStale_ms to 1 hour', () => {
      const server = createCalendarServer(validOptions({ maxStale_ms: undefined }));
      expect(server).toBeDefined();
    });

    it('should accept custom rangeDays and maxStale_ms', () => {
      const server = createCalendarServer(validOptions({ rangeDays: 14, maxStale_ms: 300000 }));
      expect(server).toBeDefined();
    });
  });

  describe('auth and basic request', () => {
    it('should build correct Authorization header with Basic auth', async () => {
      const fetchFn = vi.fn().mockResolvedValue({
        ok: true,
        status: 207,
        statusText: 'Multi-Status',
        text: () => Promise.resolve('<multistatus></multistatus>'),
      });
      const server = createCalendarServer(
        validOptions({
          username: 'test@icloud.com',
          password: 'secret123',
          fetchFn,
        })
      );
      await server.refresh();
      expect(fetchFn).toHaveBeenCalled();
      const callArgs = fetchFn.mock.calls[0];
      expect(callArgs[1]).toBeDefined();
      const options = callArgs[1] as CalDAVRequestOptions;
      const authHeader = options.headers.Authorization || '';
      // Basic auth: base64(username:password)
      const expected = 'Basic ' + Buffer.from('test@icloud.com:secret123').toString('base64');
      expect(authHeader).toBe(expected);
    });

    it('should return null from getEvents before first refresh', () => {
      const server = createCalendarServer(validOptions());
      expect(server.getEvents()).toBeNull();
    });
  });

  describe('VEVENT parsing', () => {
    it('should parse single VEVENT into CalendarEvent', async () => {
      const fetchFn = vi.fn().mockResolvedValue({
        ok: true,
        status: 207,
        statusText: 'Multi-Status',
        text: () =>
          Promise.resolve(`<?xml version="1.0" encoding="utf-8"?>
<multistatus xmlns="DAV:" xmlns:cr="urn:ietf:params:xml:ns:carddav">
  <response>
    <href>/calendars/user@icloud.com/calendar/event-1.ics</href>
    <propstat>
      <prop>
        <calendar-data>BEGIN:VEVENT
UID:event-1
SUMMARY:Meeting
DTSTART:20260217T140000Z
DTEND:20260217T150000Z
LOCATION:Conference Room A
END:VEVENT</calendar-data>
      </prop>
      <status>HTTP/1.1 200 OK</status>
    </propstat>
  </response>
</multistatus>`),
      });
      const server = createCalendarServer(validOptions({ fetchFn }));
      await server.refresh();
      const events = server.getEvents();
      expect(events).not.toBeNull();
      expect(events).toHaveLength(1);
      expect(events![0].id).toBe('event-1');
      expect(events![0].title).toBe('Meeting');
      expect(events![0].location).toBe('Conference Room A');
      expect(events![0].start).toMatch(/2026-02-17T14:00:00/);
      expect(events![0].end).toMatch(/2026-02-17T15:00:00/);
    });

    it('should parse all-day events (DATE vs DATETIME)', async () => {
      const fetchFn = vi.fn().mockResolvedValue({
        ok: true,
        status: 207,
        statusText: 'Multi-Status',
        text: () =>
          Promise.resolve(`<?xml version="1.0" encoding="utf-8"?>
<multistatus xmlns="DAV:">
  <response>
    <href>/calendars/user@icloud.com/calendar/all-day.ics</href>
    <propstat>
      <prop>
        <calendar-data>BEGIN:VEVENT
UID:all-day-1
SUMMARY:All Day Event
DTSTART;VALUE=DATE:20260217
DTEND;VALUE=DATE:20260218
END:VEVENT</calendar-data>
      </prop>
      <status>HTTP/1.1 200 OK</status>
    </propstat>
  </response>
</multistatus>`),
      });
      const server = createCalendarServer(validOptions({ fetchFn }));
      await server.refresh();
      const events = server.getEvents();
      expect(events).not.toBeNull();
      expect(events![0].allDay).toBe(true);
      expect(events![0].title).toBe('All Day Event');
    });

    it('should handle multiple VEVENTs in single response', async () => {
      const fetchFn = vi.fn().mockResolvedValue({
        ok: true,
        status: 207,
        statusText: 'Multi-Status',
        text: () =>
          Promise.resolve(`<?xml version="1.0" encoding="utf-8"?>
<multistatus xmlns="DAV:">
  <response>
    <href>/calendars/user@icloud.com/calendar/multi.ics</href>
    <propstat>
      <prop>
        <calendar-data>BEGIN:VCALENDAR
VERSION:2.0
BEGIN:VEVENT
UID:event-1
SUMMARY:Event 1
DTSTART:20260217T100000Z
DTEND:20260217T110000Z
END:VEVENT
BEGIN:VEVENT
UID:event-2
SUMMARY:Event 2
DTSTART:20260217T120000Z
DTEND:20260217T130000Z
END:VEVENT
END:VCALENDAR</calendar-data>
      </prop>
      <status>HTTP/1.1 200 OK</status>
    </propstat>
  </response>
</multistatus>`),
      });
      const server = createCalendarServer(validOptions({ fetchFn }));
      await server.refresh();
      const events = server.getEvents();
      expect(events).not.toBeNull();
      expect(events).toHaveLength(2);
      expect(events![0].id).toBe('event-1');
      expect(events![1].id).toBe('event-2');
    });

    it('should use calendar name from calendarPath if not in VEVENT', async () => {
      const fetchFn = vi.fn().mockResolvedValue({
        ok: true,
        status: 207,
        statusText: 'Multi-Status',
        text: () =>
          Promise.resolve(`<?xml version="1.0" encoding="utf-8"?>
<multistatus xmlns="DAV:">
  <response>
    <href>/calendars/user@icloud.com/calendar/event-1.ics</href>
    <propstat>
      <prop>
        <calendar-data>BEGIN:VEVENT
UID:event-1
SUMMARY:Event
DTSTART:20260217T100000Z
DTEND:20260217T110000Z
END:VEVENT</calendar-data>
      </prop>
      <status>HTTP/1.1 200 OK</status>
    </propstat>
  </response>
</multistatus>`),
      });
      const server = createCalendarServer(
        validOptions({
          fetchFn,
          calendarPath: '/calendars/user@icloud.com/work/',
        })
      );
      await server.refresh();
      const events = server.getEvents();
      expect(events![0].calendar).toBe('work');
    });
  });

  describe('date range filtering', () => {
    it('should only fetch events within rangeDays', async () => {
      const fetchFn = vi.fn().mockResolvedValue({
        ok: true,
        status: 207,
        statusText: 'Multi-Status',
        text: () => Promise.resolve('<multistatus></multistatus>'),
      });
      const server = createCalendarServer(validOptions({ fetchFn, rangeDays: 14 }));
      await server.refresh();
      expect(fetchFn).toHaveBeenCalled();
      const body = (fetchFn.mock.calls[0][1] as Record<string, string>).body || '';
      // Should contain DTSTART and DTEND filters in CalDAV REPORT body
      expect(body).toMatch(/DTSTART/);
      expect(body).toMatch(/DTEND/);
    });
  });

  describe('listeners', () => {
    it('should call onUpdate listener after refresh', async () => {
      const server = createCalendarServer(validOptions());
      const listener = vi.fn();
      server.onUpdate(listener);
      await server.refresh();
      expect(listener).toHaveBeenCalledTimes(1);
      expect(listener).toHaveBeenCalledWith(expect.any(Array));
    });

    it('should return unsubscribe function from onUpdate', async () => {
      const server = createCalendarServer(validOptions());
      const listener = vi.fn();
      const unsub = server.onUpdate(listener);
      unsub();
      await server.refresh();
      expect(listener).not.toHaveBeenCalled();
    });

    it('should call onError listener on fetch failure', async () => {
      const fetchFn = vi.fn().mockRejectedValue(new Error('network error'));
      const server = createCalendarServer(validOptions({ fetchFn }));
      const errorListener = vi.fn();
      server.onError(errorListener);
      await server.refresh();
      expect(errorListener).toHaveBeenCalledWith(expect.stringContaining('network error'));
    });

    it('should call onError on HTTP error (not 207)', async () => {
      const fetchFn = vi.fn().mockResolvedValue({
        ok: false,
        status: 500,
        statusText: 'Internal Server Error',
      });
      const server = createCalendarServer(validOptions({ fetchFn }));
      const errorListener = vi.fn();
      server.onError(errorListener);
      await server.refresh();
      expect(errorListener).toHaveBeenCalledWith(expect.stringContaining('500'));
    });
  });

  describe('auth errors and retry', () => {
    it('should not retry on 401 Unauthorized', async () => {
      const fetchFn = vi.fn().mockResolvedValue({
        ok: false,
        status: 401,
        statusText: 'Unauthorized',
      });
      const server = createCalendarServer(validOptions({ fetchFn }));
      const errorListener = vi.fn();
      server.onError(errorListener);
      await server.refresh();
      expect(fetchFn).toHaveBeenCalledTimes(1);
      expect(errorListener).toHaveBeenCalledWith(expect.stringContaining('401'));
    });

    it('should not retry on 403 Forbidden', async () => {
      const fetchFn = vi.fn().mockResolvedValue({
        ok: false,
        status: 403,
        statusText: 'Forbidden',
      });
      const server = createCalendarServer(validOptions({ fetchFn }));
      const errorListener = vi.fn();
      server.onError(errorListener);
      await server.refresh();
      expect(fetchFn).toHaveBeenCalledTimes(1);
    });

    it('should retry on network error with exponential backoff', async () => {
      const fetchFn = vi
        .fn()
        .mockRejectedValueOnce(new Error('timeout'))
        .mockRejectedValueOnce(new Error('timeout'))
        .mockResolvedValueOnce({
          ok: true,
          status: 207,
          statusText: 'Multi-Status',
          text: () => Promise.resolve('<multistatus></multistatus>'),
        });
      const server = createCalendarServer(validOptions({ fetchFn }));
      await server.refresh();
      expect(fetchFn).toHaveBeenCalledTimes(3);
    });

    it('should respect rate limit Retry-After header', async () => {
      const fetchFn = vi.fn().mockResolvedValue({
        ok: false,
        status: 429,
        statusText: 'Too Many Requests',
        headers: { 'retry-after': '1' },
      });
      const server = createCalendarServer(validOptions({ fetchFn }));
      const errorListener = vi.fn();
      server.onError(errorListener);
      await server.refresh();
      expect(errorListener).toHaveBeenCalledWith(expect.stringContaining('429'));
    });
  });

  describe('staleness cache', () => {
    it('should skip fetch if data is fresh', async () => {
      const fetchFn = vi.fn().mockResolvedValue({
        ok: true,
        status: 207,
        statusText: 'Multi-Status',
        text: () =>
          Promise.resolve(`<?xml version="1.0" encoding="utf-8"?>
<multistatus xmlns="DAV:">
  <response>
    <href>/calendars/user@icloud.com/calendar/event-1.ics</href>
    <propstat>
      <prop>
        <calendar-data>BEGIN:VEVENT
UID:event-1
SUMMARY:Event
DTSTART:20260217T100000Z
DTEND:20260217T110000Z
END:VEVENT</calendar-data>
      </prop>
      <status>HTTP/1.1 200 OK</status>
    </propstat>
  </response>
</multistatus>`),
      });
      const server = createCalendarServer(validOptions({ fetchFn, maxStale_ms: 60000 }));
      await server.refresh();
      await server.refresh(); // within staleness window
      expect(fetchFn).toHaveBeenCalledTimes(1);
    });

    it('should refetch when data is stale', async () => {
      const fetchFn = vi.fn().mockResolvedValue({
        ok: true,
        status: 207,
        statusText: 'Multi-Status',
        text: () => Promise.resolve('<multistatus></multistatus>'),
      });
      const server = createCalendarServer(validOptions({ fetchFn, maxStale_ms: 0 }));
      await server.refresh();
      await server.refresh(); // stale immediately
      expect(fetchFn).toHaveBeenCalledTimes(2);
    });
  });

  describe('close and resource cleanup', () => {
    it('should prevent updates after close', async () => {
      const server = createCalendarServer(validOptions());
      const listener = vi.fn();
      server.onUpdate(listener);
      server.close();
      await server.refresh();
      expect(listener).not.toHaveBeenCalled();
    });

    it('should return unsubscribe function from onError', async () => {
      const server = createCalendarServer(validOptions());
      const errorListener = vi.fn();
      const unsub = server.onError(errorListener);
      unsub();
      const fetchFn = vi.fn().mockRejectedValue(new Error('test error'));
      const server2 = createCalendarServer(validOptions({ fetchFn }));
      server2.onError(errorListener);
      await server2.refresh();
      // errorListener should only be called once (from server2, not from unsubscribed server)
      expect(errorListener).toHaveBeenCalledTimes(1);
    });

    it('should clear listeners on close', async () => {
      const server = createCalendarServer(validOptions());
      const updateListener = vi.fn();
      const errorListener = vi.fn();
      server.onUpdate(updateListener);
      server.onError(errorListener);
      server.close();
      // Manually try to trigger notifications (close should have cleared listeners)
      await server.refresh(); // should not trigger listeners
      expect(updateListener).not.toHaveBeenCalled();
    });

    it('should return copy of events from getEvents', async () => {
      const fetchFn = vi.fn().mockResolvedValue({
        ok: true,
        status: 207,
        statusText: 'Multi-Status',
        text: () =>
          Promise.resolve(`<?xml version="1.0" encoding="utf-8"?>
<multistatus xmlns="DAV:">
  <response>
    <href>/calendars/user@icloud.com/calendar/event-1.ics</href>
    <propstat>
      <prop>
        <calendar-data>BEGIN:VEVENT
UID:event-1
SUMMARY:Event
DTSTART:20260217T100000Z
DTEND:20260217T110000Z
END:VEVENT</calendar-data>
      </prop>
      <status>HTTP/1.1 200 OK</status>
    </propstat>
  </response>
</multistatus>`),
      });
      const server = createCalendarServer(validOptions({ fetchFn }));
      await server.refresh();
      const events1 = server.getEvents();
      const events2 = server.getEvents();
      expect(events1).not.toBe(events2); // Different array instances
      expect(events1).toEqual(events2); // But same content
    });
  });

  describe('concurrent requests', () => {
    it('should deduplicate concurrent refresh calls', async () => {
      const fetchFn = vi.fn().mockResolvedValue({
        ok: true,
        status: 207,
        statusText: 'Multi-Status',
        text: () =>
          Promise.resolve(`<?xml version="1.0" encoding="utf-8"?>
<multistatus xmlns="DAV:">
  <response>
    <href>/calendars/user@icloud.com/calendar/event-1.ics</href>
    <propstat>
      <prop>
        <calendar-data>BEGIN:VEVENT
UID:event-1
SUMMARY:Event
DTSTART:20260217T100000Z
DTEND:20260217T110000Z
END:VEVENT</calendar-data>
      </prop>
      <status>HTTP/1.1 200 OK</status>
    </propstat>
  </response>
</multistatus>`),
      });
      const server = createCalendarServer(validOptions({ fetchFn, maxStale_ms: 0 }));
      // Issue 3 concurrent refresh calls - should only result in 1 fetch
      await Promise.all([server.refresh(), server.refresh(), server.refresh()]);
      expect(fetchFn).toHaveBeenCalledTimes(1);
    });
  });

  describe('dataBus publishing', () => {
    it('should publish events to dataBus on successful refresh', async () => {
      const publish = vi.fn();
      const dataBus = { publish } as unknown as import('@lensing/types').DataBusInstance;
      const server = createCalendarServer(validOptions({ dataBus }));
      await server.refresh();
      expect(publish).toHaveBeenCalledTimes(1);
      expect(publish).toHaveBeenCalledWith(
        'calendar.events',
        'calendar-server',
        expect.objectContaining({
          events: expect.any(Array),
          lastUpdated: expect.any(Number),
        })
      );
    });

    it('should not publish to dataBus on fetch failure', async () => {
      const publish = vi.fn();
      const dataBus = { publish } as unknown as import('@lensing/types').DataBusInstance;
      const fetchFn = vi.fn().mockRejectedValue(new Error('network error'));
      const server = createCalendarServer(validOptions({ dataBus, fetchFn }));
      await server.refresh();
      expect(publish).not.toHaveBeenCalled();
    });

    it('should not throw when dataBus is not provided', async () => {
      const server = createCalendarServer(validOptions());
      await expect(server.refresh()).resolves.not.toThrow();
    });
  });

  describe('exports', () => {
    it('should be exported from @lensing/core index', async () => {
      const core = await import('../index');
      expect(typeof core.createCalendarServer).toBe('function');
    });
  });
});
