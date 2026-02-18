---
# lensing-9wza
title: Implement CalDAV client with iCloud auth
status: completed
type: task
priority: high
tags:
  - pasiv
  - size:L
  - area:backend
created_at: 2026-02-16T21:24:34Z
updated_at: 2026-02-18T00:20:04Z
parent: lensing-ra5p
---

CalDAV client for Apple Calendar with app-specific password authentication.

## Acceptance Criteria

- [x] CalDAV client implemented (no external library, uses native CalDAV REPORT) (tsdav or similar)
- [x] iCloud app-specific password authentication (Basic auth over HTTPS)
- [x] Fetch today and upcoming N days (configurable rangeDays, default 7)
- [x] Publishes events via onUpdate callbacks (data bus integration separate)
- [x] Robust error handling: auth (401/403 no-retry), rate limits (429), malformed responses
- [x] Retry logic with exponential backoff (2 retries, 50ms base, 2x growth)

---

**Size:** L

## Summary of Changes

**Files created:**

- packages/core/src/caldav-client.ts (337 lines) - CalDAV client factory, VEVENT parsing, auth, retry logic, listeners
- packages/core/src/**tests**/caldav-client.test.ts (437 lines) - 37 comprehensive tests

**Files modified:**

- packages/core/src/index.ts - Added exports for CalendarServer types and factory

**Key features:**

- Factory pattern: createCalendarServer(options) returns CalendarServerInstance
- HTTPS-only connections with validation
- Basic auth header generation
- CalDAV REPORT query building with XML
- VEVENT parsing with all-day and datetime support
- Event staleness cache (configurable maxStale_ms, default 1 hour)
- Exponential backoff retry (2 retries, 50ms base, 2x growth)
- Concurrent request deduplication (in-flight tracking)
- Event listener with unsubscribe function
- Error listener with unsubscribe function
- Resource cleanup on close()

**Security & reliability:**

- HTTPS validation prevents credential leakage
- Auth errors (401/403) not retried
- Rate limit detection (429)
- Listener error isolation (try-catch)
- Event array copy returned to prevent mutation
- Listener cleanup on close

**Tests:** 37 passing (502/502 total project tests)
**Code review:** OC tier (Opus + Codex) - all findings addressed
