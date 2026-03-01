---
# lensing-3x4w
title: Implement JSON API connector
status: completed
type: task
priority: high
created_at: 2026-02-28T15:45:09Z
updated_at: 2026-03-01T02:54:04Z
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
- [x] Caches last successful response for stale data fallback

---

**Size:** M
**Area:** backend

## Completion Summary

**Files changed:**

- packages/core/src/json-api-connector.ts (193 lines, new)
- packages/core/src/**tests**/json-api-connector.test.ts (472 lines, new)
- packages/core/src/index.ts (exports added)

**Key decisions:**

- Custom JSONPath resolver to avoid external dependencies (handles dot notation, array access, nested paths)
- Cache only updated on successful response; HTTP errors fall back to cache if available
- Placeholder substitution via {{SECRET_NAME}} patterns with async resolver
- SSRF protection via existing getBlockReason() integration
- AbortController for timeout management (10s default)
- Error classification for specific handling: HTTP, JSON parse, network, timeout, JSONPath, SSRF

**Notes for next task:**

- createJsonApiConnector() factory returns JsonApiConnector interface
- Config: url, method, headers, refresh_ms, mapping (JSONPath expressions)
- Supports secret resolution for URL/header placeholders
- allowPrivate option bypasses private IP SSRF blocks (for home-lab)
- fetch() returns Record<string, unknown> of mapped values
- getCachedResponse() / clearCache() for stale fallback management
