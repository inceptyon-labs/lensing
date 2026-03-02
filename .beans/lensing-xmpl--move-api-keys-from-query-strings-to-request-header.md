---
# lensing-xmpl
title: Move API keys from query strings to request headers
status: todo
type: task
priority: high
created_at: 2026-03-02T16:49:22Z
updated_at: 2026-03-02T16:49:22Z
parent: lensing-umpl
---

**Scan finding:** MH-2

API keys are embedded in URL query parameters in allergies-server.ts and weather-server.ts. Keys in query strings can leak via server logs, browser history, referrer headers, or error reporting.

## Acceptance Criteria

- [ ] Ambee API: `x-api-key` moved from query param to request header
- [ ] OpenWeatherMap: `appid` moved to header if API supports it, or documented as vendor limitation
- [ ] Tests updated to verify header-based auth
- [ ] No API keys appear in constructed URLs

## Files
- `packages/core/src/allergies-server.ts:110`
- `packages/core/src/weather-server.ts:284`

## Size: S
## Area: backend
