---
# lensing-wbum
title: 'Epic: Live Data Pipeline'
status: todo
type: epic
priority: high
created_at: 2026-02-24T17:59:25Z
updated_at: 2026-02-24T17:59:25Z
---

The entire data pipeline from server modules to display widgets is broken. No live data reaches the client. This epic covers every link in the chain: module refresh, data bus wiring, WebSocket forwarding, client-side stores, PluginRenderer data binding, and missing widget components.

## Pipeline Links (all broken)
1. Server modules never call refresh() — no polling, no timers
2. Weather & Calendar modules don't publish to data bus at all
3. Data bus → WebSocket bridge doesn't exist (dataBus.onMessage never wired to ws.broadcast)
4. Client WebSocket only handles layout_change, ignores plugin_data
5. No client-side reactive data store (Svelte stores)
6. PluginRenderer passes hardcoded empty arrays to all widgets
7. 5 of 8 modules have no widget component (weather, crypto, calendar, allergies, PIR)
