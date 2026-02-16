---
# lensing-9wza
title: Implement CalDAV client with iCloud auth
status: todo
type: task
priority: high
tags:
    - pasiv
    - size:L
    - area:backend
created_at: 2026-02-16T21:24:34Z
updated_at: 2026-02-16T21:24:34Z
parent: lensing-ra5p
---

CalDAV client for Apple Calendar with app-specific password authentication.

## Acceptance Criteria
- [ ] CalDAV client using battle-tested adapter library (tsdav or similar)
- [ ] iCloud app-specific password authentication
- [ ] Fetch today's events and upcoming N days (configurable)
- [ ] Publishes calendar.today and calendar.upcoming to data bus
- [ ] Robust error handling: auth edge cases, rate limits, inconsistent responses
- [ ] Retry logic with exponential backoff

---
**Size:** L
