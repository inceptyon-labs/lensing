---
# lensing-3x4w
title: Implement JSON API connector
status: todo
type: task
priority: high
created_at: 2026-02-28T15:45:09Z
updated_at: 2026-02-28T15:45:09Z
parent: lensing-r333
---

Implement the JSON API connector that fetches data from a URL and maps response fields to named slots via JSONPath expressions.

## Acceptance Criteria

- [ ] Fetches JSON from configured URL with method/headers
- [ ] Parses response and extracts fields using JSONPath mapping
- [ ] Returns flat Record<string, unknown> of mapped slot values
- [ ] Handles HTTP errors gracefully (status codes, timeouts)
- [ ] 10s default timeout, configurable per connector
- [ ] Supports {{SECRET_NAME}} placeholder substitution in headers/URL
- [ ] Caches last successful response for stale data fallback

---

**Size:** M
**Area:** backend
