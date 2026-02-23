---
# lensing-jnf0
title: 'Feature: Presence Detection'
status: completed
type: feature
priority: normal
tags:
    - pasiv
    - priority:medium
    - area:backend
    - area:infra
created_at: 2026-02-16T21:21:21Z
updated_at: 2026-02-23T22:19:20Z
parent: lensing-342l
---

PIR sensor GPIO integration for presence-based display wake/sleep.

## Goals

- PIR sensor reading via GPIO on Raspberry Pi
- Presence-based wake from ambient mode when motion detected
- Auto-dim to ambient after N minutes of no motion (configurable)
- Graceful fallback when no PIR sensor is available

## Scope

**In Scope:** GPIO integration, wake/sleep logic, configurable timeout
**Out of Scope:** Camera-based motion detection, USB sensor support
