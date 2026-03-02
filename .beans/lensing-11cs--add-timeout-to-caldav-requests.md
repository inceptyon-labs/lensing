---
# lensing-11cs
title: Add timeout to CalDAV requests
status: todo
type: task
priority: normal
created_at: 2026-03-02T16:50:07Z
updated_at: 2026-03-02T16:50:07Z
parent: lensing-umpl
---

**Scan finding:** M-2

CalDAV client makes HTTP requests without AbortController timeout. A slow or non-responsive CalDAV server could hang indefinitely, consuming resources.

## Acceptance Criteria

- [ ] All CalDAV fetch calls use AbortController with configurable timeout (default 30s)
- [ ] Test verifies timeout behavior
- [ ] Pattern consistent with json-api-connector.ts and rss-connector.ts

## Files
- `packages/core/src/caldav-client.ts:228`

## Size: XS
## Area: backend
