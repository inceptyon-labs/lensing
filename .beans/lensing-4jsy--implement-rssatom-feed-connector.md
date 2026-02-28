---
# lensing-4jsy
title: Implement RSS/Atom feed connector
status: todo
type: task
priority: normal
created_at: 2026-02-28T15:45:12Z
updated_at: 2026-02-28T15:45:12Z
parent: lensing-r333
---

Implement the RSS/Atom connector that fetches feeds and maps standard fields to named slots.

## Acceptance Criteria

- [ ] Fetches and parses RSS 2.0 and Atom feeds
- [ ] Maps standard fields: title, description, image, date, link, author
- [ ] Returns array of items (configurable limit, default 10)
- [ ] Handles malformed feeds gracefully
- [ ] Caches last successful response for stale data fallback

---

**Size:** M
**Area:** backend
