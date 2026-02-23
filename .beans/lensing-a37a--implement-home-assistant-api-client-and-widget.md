---
# lensing-a37a
title: Implement Home Assistant API client and widget
status: completed
type: task
priority: normal
tags:
    - pasiv
    - size:L
    - area:backend
    - area:frontend
created_at: 2026-02-16T21:25:07Z
updated_at: 2026-02-23T17:31:26Z
parent: lensing-i1z4
---

Home Assistant plugin: REST/WebSocket API client and device state widgets.

## Acceptance Criteria

- [x] Connect to HA via REST API and WebSocket API
- [x] Config: HA URL, long-lived access token, device/entity filters
- [x] Show device states: lights, locks, thermostat, sensors
- [x] Publishes home.devices and home.sensors to data bus
- [x] Real-time state updates via HA WebSocket subscription

---

**Size:** L

## Completed

**Files changed:**
packages/types/src/home-assistant.ts (types, constants)
packages/core/src/home-assistant-server.ts (REST + WS factory)
packages/core/src/home-assistant-integration.test.ts (7 integration tests)
packages/ui/src/home-assistant-store.ts (UI store factory)
apps/display/src/lib/HomeAssistantDevices.svelte (widget)
packages/core/src/plugins/home-assistant/plugin.json (manifest)

**Key decisions:**
- Domain filtering: DEFAULT_HA_DOMAINS as fallback + explicit domains option
- WS auto-reconnect with closed guard to prevent race condition  
- Defensive copies (shallow attributes sufficient for HA)
- Data bus: publish both home.devices and home.sensors channels
- Store: domain helpers + onChange with re-entrancy guard

**Notes for next task:**
- Factory pattern established (createHomeAssistantServer, createHomeAssistantStore)
- 561 tests total (types, server, store, widget integration)
- Design system integration complete (all tokens used)
- Ready for display app integration
