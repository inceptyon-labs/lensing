---
# lensing-sehv
title: Switch allergies module from Ambee API to free pollen.com API
status: completed
type: task
priority: normal
created_at: 2026-03-06T02:31:33Z
updated_at: 2026-03-06T02:36:50Z
---

Replace the Ambee-based allergies server with pollen.com API. Changes: zip code config instead of API key + lat/lon, 0-12 index scale, trigger-based allergen display, color-coded severity levels.

## Summary of Changes

Replaced the Ambee-based allergies module with the free pollen.com API:

### Types (`packages/types/src/index.ts`)

- Removed: `AllergenLevel`, `AllergyLocation`
- Added: `PollenTrigger`, `PollenPeriod`, `PollenLevel`
- Updated `AllergyData`: now includes `level`, `color`, `location`, `periods`, `triggers` (0-12 scale)
- Updated `AllergiesServerOptions`: `zipCode` replaces `apiKey` + `location`

### Server (`packages/core/src/allergies-server.ts`)

- Rewrote to fetch from `pollen.com/api/forecast/current/pollen/{zip}`
- Requires Referer + User-Agent headers (pollen.com requirement)
- Returns Yesterday/Today/Tomorrow periods with trigger allergens
- Color-coded severity: green→yellow-green→yellow→orange→red
- Alert threshold default: 7.3 (Medium-High)

### Module Settings (`packages/types/src/module-settings.ts`)

- Simplified config: just zip code + alert threshold (no API key needed)
- Updated description and setup guide

### Module Boot (`packages/core/src/module-boot.ts`)

- Updated to pass `zipCode` instead of `apiKey` + `location`

### Widget (`apps/display/src/lib/AllergiesWidget.svelte`)

- Shows pollen index on 0-12 scale with color-coded gauge
- Displays trigger allergens with plant type labels
- 3-period forecast (Yesterday/Today/Tomorrow)
- Location display

### Store (`packages/ui/src/allergies-store.ts`)

- Updated for new data model with `getPollenLevel()` and `getPollenColor()`

### Tests

- 31 server tests passing (core)
- 24 store tests passing (ui)
- Widget structural tests updated
