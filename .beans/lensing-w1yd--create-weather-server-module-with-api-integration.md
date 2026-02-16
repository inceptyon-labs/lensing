---
# lensing-w1yd
title: Create weather server module with API integration
status: todo
type: task
priority: high
tags:
    - pasiv
    - size:M
    - area:backend
created_at: 2026-02-16T21:24:14Z
updated_at: 2026-02-16T21:24:14Z
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
