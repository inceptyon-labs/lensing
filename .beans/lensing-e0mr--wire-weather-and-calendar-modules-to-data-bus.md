---
# lensing-e0mr
title: Wire weather and calendar modules to data bus
status: todo
type: task
priority: high
created_at: 2026-02-24T17:59:49Z
updated_at: 2026-02-24T17:59:49Z
parent: lensing-wbum
---

Weather and Calendar server modules don't receive dataBus in their options, so they never publish data. Every other module (crypto, news, sports, home-assistant, allergies, pir) does.

## Current State

- module-boot.ts passes dataBus to crypto, news, sports, home-assistant, allergies, pir
- Weather: createWeatherServer({apiKey, location, units}) — no dataBus param
- Calendar: createCalendarServer({serverUrl, username, password, calendarPath, rangeDays}) — no dataBus param
- WeatherServerOptions has no dataBus field
- CalendarServerOptions (in caldav-client.ts) has no dataBus field

## What to Do

- Add dataBus to WeatherServerOptions and CalendarServerOptions interfaces
- Publish weather data to channel 'weather.current' after each refresh
- Publish calendar events to channel 'calendar.events' after each refresh
- Update module-boot.ts to pass dataBus when creating weather and calendar
- Add tests

## Key Files

- packages/core/src/weather-server.ts
- packages/core/src/caldav-client.ts
- packages/core/src/module-boot.ts
- packages/types/src/index.ts (WeatherServerOptions if defined there)
