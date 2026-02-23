---
# lensing-a37a
title: Implement Home Assistant API client and widget
status: in-progress
type: task
priority: normal
tags:
    - pasiv
    - size:L
    - area:backend
    - area:frontend
created_at: 2026-02-16T21:25:07Z
updated_at: 2026-02-23T17:28:51Z
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
