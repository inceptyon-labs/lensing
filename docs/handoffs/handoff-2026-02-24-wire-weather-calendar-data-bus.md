# Session Handoff: Wire weather and calendar modules to data bus

Date: 2026-02-24
Issue: lensing-e0mr - Wire weather and calendar modules to data bus

## What Was Done

- Completed Task: lensing-zl2i — Wire PluginRenderer to live data from data bus store
- Started Task: lensing-e0mr — Wire weather and calendar modules to data bus
- Created feature branch: feature/lensing-e0mr (on it now)
- Moved bean to in-progress
- Created implementation plan (approved by user)
- Created native tasks #19-#22 (RED → GREEN → Review → Verification)
- Review tier: O (Opus)
- NO implementation work done yet — starting from RED phase

## Current State

- On branch: feature/lensing-e0mr (no commits yet, identical to main)
- Bean status: in-progress
- Native tasks: #19 (pending), #20 (blocked by #19), #21 (blocked by #20), #22 (blocked by #21)

## Approved Plan

### Problem

Weather and calendar server modules don't receive dataBus in their options, so they never publish data. Every other module (crypto, news, sports, home-assistant, allergies, pir) does.

### Step 1: RED — Write failing tests

Add to existing test files:

**packages/core/src/__tests__/weather-server.test.ts**
- Test that weather-server publishes WeatherData to dataBus on successful refresh
- Verify channel = 'weather.current', plugin_id = 'weather-server'
- Mock dataBus as `{ publish: vi.fn() }`

**packages/core/src/__tests__/caldav-client.test.ts**
- Test that calendar-server publishes events to dataBus on successful refresh
- Verify channel = 'calendar.events', plugin_id = 'calendar-server'
- Mock dataBus as `{ publish: vi.fn() }`

### Step 2: GREEN — Implement

**packages/core/src/weather-server.ts**
- Add `dataBus?: DataBusInstance` to `WeatherServerOptions` (line 43-56)
- Extract dataBus in `createWeatherServer` (line 133-134)
- After refresh success (around line 170), add:
  ```typescript
  if (dataBus) {
    (dataBus as DataBusInstance).publish('weather.current', 'weather-server', publishData);
  }
  ```
- Pattern: same as news-server.ts line ~58

**packages/core/src/caldav-client.ts**
- Add `dataBus?: DataBusInstance` to `CalendarServerOptions` (line 22-37)
- Extract dataBus in `createCalendarServer`
- After refresh success, add:
  ```typescript
  if (dataBus) {
    (dataBus as DataBusInstance).publish('calendar.events', 'calendar-server', { events: eventsCopy, lastUpdated: Date.now() });
  }
  ```

**packages/core/src/module-boot.ts**
- In `case 'weather':` (around line where createWeatherServer is called), add `dataBus` to options
- In `case 'calendar':` (around line where createCalendarServer is called), add `dataBus` to options

### Step 3: REFACTOR — Skip (unlikely needed)

### Step 4: Review — O (Opus single-pass)

### Step 5: Verification — Tests, Build, Format, Types

## Files to Load Next Session

- packages/core/src/weather-server.ts — target: add dataBus publishing
- packages/core/src/caldav-client.ts — target: add dataBus publishing
- packages/core/src/module-boot.ts — target: pass dataBus to weather + calendar
- packages/core/src/__tests__/weather-server.test.ts — add RED tests
- packages/core/src/__tests__/caldav-client.test.ts — add RED tests

## What NOT to Re-Read

- apps/display/src/lib/PluginRenderer.svelte (done in lensing-zl2i)
- apps/display/src/lib/stores/dataBusStore.ts (done in lensing-gi9v)
- apps/display/src/routes/+page.svelte (done in lensing-gi9v)

## Reference: How Other Modules Publish to dataBus

Pattern from news-server.ts:
```typescript
const PLUGIN_ID = 'news-server';
const DATA_BUS_HEADLINES_CHANNEL = 'news.headlines';

// In options interface:
dataBus?: DataBusInstance;

// In factory function:
const { dataBus } = options;

// After successful refresh:
(dataBus as DataBusInstance).publish(DATA_BUS_HEADLINES_CHANNEL, PLUGIN_ID, publishData);
```

Pattern from module-boot.ts:
```typescript
case 'crypto':
  return createCryptoServer({
    watchlist: csvToArray(values['watchlist']),
    dataBus,  // <-- just pass it through from BootDeps
    notifications,
  });
```

## DataBusInstance Type

Import from: `import type { DataBusInstance } from './data-bus';`

## Completed in Epic lensing-wbum (Live Data Pipeline)

- ✓ lensing-f305: Wire data bus to WebSocket broadcast (server-side)
- ✓ lensing-7vxu: Add auto-refresh polling to module boot (server-side polling)
- ✓ lensing-gi9v: Client-side data bus store + WebSocket subscription
- ✓ lensing-zl2i: Wire PluginRenderer to live data from data bus store
- → lensing-e0mr: Wire weather and calendar modules to data bus (IN PROGRESS — this task)

## Remaining After This Task

- lensing-bxi7: Build CryptoWidget.svelte
- lensing-oekr: Build WeatherWidget.svelte
- lensing-qrpo: Build CalendarWidget.svelte
- lensing-8ic3: Build AllergiesWidget.svelte
- lensing-35n4: Photo slideshow data pipeline
