---
# lensing-1u7p
title: Weather alerts banner, rain/UV hints, night mode
status: completed
type: feature
created_at: 2026-10-06T22:25:21Z
updated_at: 2026-10-06T22:25:21Z
---

Bathroom display additions.

- [x] NWS active alerts for the weather location, polled every 5 min, fixed banner on the kiosk (Extreme/Severe red, Moderate amber, dimmed at night except Extreme)
- [x] Open-Meteo 15-min rain and hourly UV nowcast; WeatherWidget hint pills (rain timing, UV >= 6 before 5pm)
- [x] Night mode system module (22:00-06:00 default): dim full-screen clock, day-ahead events and forecast

## Summary of Changes

Types: WeatherNowcast, WeatherAlert(s), WEATHER_ALERTS_* constants, night-mode schema. Core: weather-server nowcast + NWS alert poller. Display: WeatherAlertBanner, nowcast pills, NightView, night-mode helpers. Software dimming only: the ASUS VA249HG does not answer DDC/CI.
