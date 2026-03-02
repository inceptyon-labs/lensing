---
# lensing-4jsy
title: Implement RSS/Atom feed connector
status: completed
type: task
priority: normal
created_at: 2026-02-28T15:45:12Z
updated_at: 2026-03-02T13:46:17Z
parent: lensing-r333
---

Implement the RSS/Atom connector that fetches feeds and maps standard fields to named slots.

## Acceptance Criteria

- [x] Fetches and parses RSS 2.0 and Atom feeds
- [x] Maps standard fields: title, description, image, date, link, author
- [x] Returns array of items (configurable limit, default 10)
- [x] Handles malformed feeds gracefully
- [x] Caches last successful response for stale data fallback

---

**Size:** M
**Area:** backend

## Completed

**Files changed:**

- packages/core/src/rss-connector.ts (308 lines, new) — RSS/Atom feed parser with flexible field mapping
- packages/core/src/**tests**/rss-connector.test.ts (488 lines, new) — 24 comprehensive tests
- packages/core/src/index.ts (2 lines added) — Exports for RssConnector interface
- packages/types/src/index.ts (1 line added) — Optional limit field in RssConnectorConfig

**Key decisions:**

- Regex-based XML parser (no external dependencies, Node.js compatible) instead of DOM parser
- Namespace stripping for feed compatibility (stores both qualified and unqualified names)
- SSRF protection via existing getBlockReason() integration
- Cache strategy: store on success, return cached on error, clear on explicit call
- Timeout enforcement with AbortController (10s default, configurable)
- Flexible field mapping: simple paths (title), nested (author > name), attributes (enclosure @url)

**Notes for next task:**

- XML parser uses regex patterns; handles RSS 2.0 and Atom 1.0 feeds
- All 24 tests passing; 1831 total tests across project
- For Atom feeds: description→summary, date→published, link→href attribute
- Optional enhancements: CDATA block handling, XML entity decoding, real-world feed integration tests
- Sibling tasks (lensing-tfec, lensing-3x4w, lensing-odrh) provide ConnectorConfig types and runner integration
