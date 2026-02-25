---
# lensing-g44x
title: Add Open-Meteo as weather provider option
status: completed
type: feature
priority: normal
created_at: 2026-02-25T14:51:41Z
updated_at: 2026-02-25T15:14:12Z
---

Add Open-Meteo (api.open-meteo.com) as a free alternative to OpenWeatherMap. Open-Meteo requires no API key and has 10k calls/day free.

## Tasks

- [x] Add WeatherProvider type and optional provider field to WeatherServerOptions
- [x] Add provider select field to module settings schema
- [x] Add WMO code mapping and Open-Meteo URL builder/transformer to weather-server
- [x] Update module-boot to pass provider option
- [x] Add tests for Open-Meteo provider
- [x] Verify build, lint, tests pass

## Summary of Changes

Added Open-Meteo as a free weather provider alternative to OpenWeatherMap:

- `WeatherProvider` type (`openweathermap` | `open-meteo`) in types package
- WMO weather code → condition string mapping (28 codes)
- Open-Meteo URL builder and response transformer in weather-server
- Provider select field in module settings schema (defaults to open-meteo)
- API key is now optional (only required for OpenWeatherMap)
- module-boot passes provider option through to createWeatherServer
- 10 new tests for Open-Meteo provider + WMO code mapping
- All existing OWM tests pass unchanged (38 total weather tests)

## Additional Fix: Data delivery on WS connect

Root cause of 'no weather data showing': the data bus only pushed new messages over WebSocket. Modules published their initial data at boot before any browser connected, then the 1-hour staleness cache meant no re-publish. Browsers connecting after boot received nothing.

Fix: added a `connection` event handler on the WS server that replays all cached data bus messages to newly connected clients.
