# Session Handoff: Client-side data bus store + WebSocket subscription

Date: 2026-02-24
Issue: lensing-gi9v - Client-side data bus store + WebSocket subscription

## What Was Done

- Completed Task: lensing-gi9v — Client-side data bus store + WebSocket subscription
- Created dataBusStore.ts: Svelte writable<Map<string, DataBusMessage>>, keyed by plugin_id
- Wired +page.svelte WebSocket handler to dispatch plugin_data messages to the store
- Added memoized getChannelData() to avoid subscription leaks
- 10 new tests (8 store unit + 2 WS wiring). All 1,450 tests passing.

## Files Changed (this session — all on main)

- apps/display/src/lib/stores/dataBusStore.ts (NEW)
- apps/display/src/routes/+page.svelte (MODIFIED — added plugin_data WS handler)
- apps/display/**tests**/data-bus-store.test.ts (NEW)
- apps/display/**tests**/page.test.ts (MODIFIED — 2 new WS tests)

## Completed in Epic lensing-wbum (Live Data Pipeline)

- ✓ lensing-f305: Wire data bus to WebSocket broadcast (server-side)
- ✓ lensing-7vxu: Add auto-refresh polling to module boot (server-side polling)
- ✓ lensing-gi9v: Client-side data bus store + WebSocket subscription (this task)

## Next Steps (ordered)

1. **lensing-zl2i**: Wire PluginRenderer to live data from data bus store
   - Import getChannelData from dataBusStore in PluginRenderer.svelte
   - Subscribe to per-plugin data, pass to widget component props
   - Key: call getChannelData ONCE per component (not in reactive block) — memoized but still good practice
2. **lensing-e0mr**: Wire weather and calendar modules to data bus (server-side)
3. **lensing-bxi7**: Build CryptoWidget.svelte
4. **lensing-oekr**: Build WeatherWidget.svelte
5. **lensing-qrpo**: Build CalendarWidget.svelte
6. **lensing-8ic3**: Build AllergiesWidget.svelte
7. **lensing-35n4**: Photo slideshow data pipeline

## Files to Load Next Session

- apps/display/src/lib/stores/dataBusStore.ts — new store
- apps/display/src/lib/PluginRenderer.svelte — next file to modify
- apps/display/src/routes/+page.svelte — current WS wiring

## Key API Notes for lensing-zl2i

```typescript
// In PluginRenderer.svelte:
import { getChannelData } from './stores/dataBusStore';

// CORRECT: call once, assign to variable
const channelStore = getChannelData(plugin.plugin_id);
// Then use $channelStore in template

// WRONG: don't call in reactive block
// $: data = getChannelData(plugin.plugin_id); // BAD - creates new store each evaluation
```

Data shape per plugin (what modules publish to dataBus):

- weather: WeatherData (from weather-server, channel 'weather.current')
- crypto: CryptoData (from crypto-server, channel 'crypto.prices')
- news: NewsData (from news-server, channel 'news.headlines')
- sports: SportsData (from sports-server, channel 'sports.scores')
- home-assistant: HAData (channel 'home.devices', 'home.sensors')
- allergies: AllergyData (channel 'allergies.current')
- pir: PresenceData (channel 'presence.pir', event-driven)
