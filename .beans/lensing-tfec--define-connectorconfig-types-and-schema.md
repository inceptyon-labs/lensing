---
# lensing-tfec
title: Define ConnectorConfig types and schema
status: completed
type: task
priority: high
created_at: 2026-02-28T15:45:08Z
updated_at: 2026-03-01T01:30:50Z
parent: lensing-r333
---

Define the ConnectorConfig TypeScript types in @lensing/types for JSON API, RSS, and static connector configurations.

## Acceptance Criteria

- [ ] ConnectorConfig union type with discriminated `type` field
- [ ] JsonApiConnectorConfig: url, method, headers, refresh_ms, mapping (Record<string, string> using JSONPath)
- [ ] RssConnectorConfig: url, refresh_ms, mapping for title/description/image/date/link
- [ ] StaticConnectorConfig: data (Record<string, unknown>)
- [ ] ConnectorMapping type for field name → JSONPath/selector mapping
- [ ] Validation function for ConnectorConfig (url format, required fields)

---

**Size:** S
**Area:** backend

## Completed

**Files changed:**

- packages/types/src/index.ts (107 lines added) — ConnectorConfig types and validation function
- packages/types/src/**tests**/connector-config.test.ts (362 lines, new) — 20 comprehensive tests

**Key decisions:**

- ConnectorConfig as discriminated union (json-api | rss | static)
- URL validation via URL constructor (http/https protocol enforcement)
- ConnectorMapping as Record<string, string> (JSONPath/CSS selectors as strings)
- Optional headers for JSON API configuration
- Validation ensures refresh_ms > 0 and all required fields present

**Notes for next task:**

- Use isValidConnectorConfig() before instantiating connectors
- ConnectorConfig types ready for JSON API, RSS, and static connector implementations
- Tests provide comprehensive coverage of all union variants and edge cases
