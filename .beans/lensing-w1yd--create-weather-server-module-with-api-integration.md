---
# lensing-w1yd
title: Create weather server module with API integration
status: completed
type: task
priority: high
tags:
    - pasiv
    - size:M
    - area:backend
created_at: 2026-02-16T21:24:14Z
updated_at: 2026-02-17T22:47:54Z
parent: lensing-fs0t
---

Weather plugin server module: fetch, cache, and publish weather data.

## Acceptance Criteria

- [ ] Server module fetches from weather API (OpenWeatherMap or similar)
- [ ] Config: location(s), units (imperial/metric), API key, refresh interval
- [ ] Caching with staleness tracking
- [ ] Publishes weather.current and weather.forecast to data bus
- [ ] Error handling for API failures with graceful degradation

---

**Size:** M

## Summary

✓ Created weather server module with staleness-based caching
✓ OpenWeatherMap API integration with injectable fetch
✓ 24 tests covering factory, listeners, fetch/transform, cache, exports
✓ Error handling: graceful degradation, listener isolation, payload validation
✓ SC review (Sonnet → Codex): payload validation fix applied
✓ All verification gates passed: 365/365 tests, build, lint, typecheck

Commit: 0f54300 (merged to main)
