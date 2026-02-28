---
# lensing-tfec
title: Define ConnectorConfig types and schema
status: todo
type: task
priority: high
created_at: 2026-02-28T15:45:08Z
updated_at: 2026-02-28T15:45:08Z
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
