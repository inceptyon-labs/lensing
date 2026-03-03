---
# lensing-11cs
title: Add timeout to CalDAV requests
status: in-progress
type: task
priority: normal
created_at: 2026-03-02T16:50:07Z
updated_at: 2026-03-03T00:47:21Z
parent: lensing-umpl
---

**Scan finding:** M-2

CalDAV client makes HTTP requests without AbortController timeout. A slow or non-responsive CalDAV server could hang indefinitely, consuming resources.

## Acceptance Criteria

- [x] All CalDAV fetch calls use AbortController with configurable timeout (default 30s)
- [x] Test verifies timeout behavior
- [x] Pattern consistent with json-api-connector.ts and rss-connector.ts

## Files

- `packages/core/src/caldav-client.ts:228`

## Size: XS

## Area: backend
