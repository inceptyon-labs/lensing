---
# lensing-xmpl
title: Move API keys from query strings to request headers
status: todo
type: task
priority: high
created_at: 2026-03-02T16:49:22Z
updated_at: 2026-03-02T22:57:48Z
parent: lensing-umpl
---

**Scan finding:** MH-2

API keys are embedded in URL query parameters in allergies-server.ts and weather-server.ts. Keys in query strings can leak via server logs, browser history, referrer headers, or error reporting.

## Acceptance Criteria

- [x] Ambee API: `x-api-key` moved from query param to request header
- [x] OpenWeatherMap: `appid` documented as vendor limitation (OneCall 3.0 requires query param)
- [x] Tests updated to verify header-based auth
- [x] No API keys appear in constructed URLs (except OWM vendor limitation)

## Files

- `packages/core/src/allergies-server.ts:110`
- `packages/core/src/weather-server.ts:284`

## Size: S

## Area: backend

## Completed

**Files changed:**
- packages/types/src/index.ts (modified) - Added FetchInit type, expanded FetchFn signature
- packages/core/src/allergies-server.ts (modified) - Removed x-api-key from URL, pass as header
- packages/core/src/weather-server.ts (modified) - Added vendor limitation comment
- packages/core/src/__tests__/allergies-server.test.ts (modified) - Tests verify header auth
- packages/core/src/__tests__/weather-server.test.ts (modified) - OWM vendor limitation test

**Key decisions:**
- FetchFn expanded with optional FetchInit (backward compatible)
- OWM appid stays in URL — documented as vendor limitation (no header auth supported)
- Ambee x-api-key moved to request header (their standard auth method)

**Notes for next task:**
- FetchFn now supports passing headers via optional init parameter
- weather-server has its own local FetchFn type that doesn't include init — consider unifying later
- Other modules (sports, news, home-assistant) use @lensing/types FetchFn and are backward compatible
