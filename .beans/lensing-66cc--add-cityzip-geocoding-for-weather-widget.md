---
# lensing-66cc
title: Add city/zip geocoding for weather widget
status: completed
type: feature
priority: normal
created_at: 2026-03-06T00:34:29Z
updated_at: 2026-03-06T00:47:17Z
---

Allow users to enter a city name or zip code instead of lat/lon coordinates for the weather module. Add geocoding via Open-Meteo's free geocoding API to resolve location text to coordinates.

## Summary of Changes

- Added `locationQuery` option to `WeatherServerOptions` — accepts city name or zip code
- Geocoding via Open-Meteo's free geocoding API (`geocoding-api.open-meteo.com`), resolved lazily on first `refresh()`
- Coordinates cached after resolution (no re-geocode on subsequent refreshes)
- `location` (lat/lon) is now optional when `locationQuery` is provided
- `locationQuery` takes precedence over `location` when both are set
- Updated weather module settings schema with new Location field
- Updated `module-boot.ts` to wire `locationQuery` through to `createWeatherServer`
- 10 new tests covering geocoding success, caching, error cases, zip codes, and precedence
