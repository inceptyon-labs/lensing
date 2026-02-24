---
# lensing-gi9v
title: Client-side data bus store + WebSocket subscription
status: todo
type: task
priority: critical
created_at: 2026-02-24T17:59:59Z
updated_at: 2026-02-24T17:59:59Z
parent: lensing-wbum
---

Create a Svelte reactive store that subscribes to WebSocket plugin_data messages and provides per-channel data to components.

## Current State

- +page.svelte creates a WebSocket but only handles 'layout_change'
- No Svelte stores exist for data bus channels
- No mechanism to pass live data from WS to widget components
- Widget components (NewsHeadlines, SportsScores) accept data as props but get empty arrays

## What to Do

- Create apps/display/src/lib/stores/dataBusStore.ts
- Svelte writable store: Map<channel, latestMessage>
- Subscribe to WS 'plugin_data' messages, update store on each message
- Export derived stores or a getChannel(channel) helper
- Use in +page.svelte or PluginRenderer to feed data to widgets

## Data Bus Channels (from server modules)

- crypto.prices → CryptoData
- news.headlines → NewsData
- sports.scores → SportsData
- home.devices / home.sensors → HomeAssistantData
- allergies.current → AllergyData
- presence.pir → PresenceData
- weather.current → (after weather is wired)
- calendar.events → (after calendar is wired)

## Key Files

- apps/display/src/lib/stores/dataBusStore.ts (NEW)
- apps/display/src/routes/+page.svelte (wire WS to store)
- apps/display/src/lib/PluginRenderer.svelte (consume store)
