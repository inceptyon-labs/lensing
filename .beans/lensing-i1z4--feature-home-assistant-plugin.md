---
# lensing-i1z4
title: 'Feature: Home Assistant Plugin'
status: in-progress
type: feature
priority: normal
tags:
  - pasiv
  - priority:medium
  - area:backend
  - area:frontend
created_at: 2026-02-16T21:21:30Z
updated_at: 2026-02-23T15:57:38Z
parent: lensing-342l
---

Home Assistant integration via REST/WebSocket API.

## Goals

- Connect to HA REST and WebSocket API
- Show device states: lights, locks, thermostat, sensors
- Publishes home.devices and home.sensors to data bus
- Agent can trigger HA automations via data bus (future)

## Scope

**In Scope:** HA API client, device state display, data bus publishing
**Out of Scope:** Direct automation triggers from dashboard UI
