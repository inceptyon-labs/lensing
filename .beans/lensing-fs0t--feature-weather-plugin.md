---
# lensing-fs0t
title: 'Feature: Weather Plugin'
status: completed
type: feature
priority: high
tags:
  - pasiv
  - priority:high
  - area:backend
  - area:frontend
created_at: 2026-02-16T21:20:48Z
updated_at: 2026-02-17T22:48:06Z
parent: lensing-mrxz
---

Weather plugin with configurable provider, location, and units. Publishes to data bus.

## Goals

- Server module: fetch from weather API, cache, respect refresh intervals
- Widget: current conditions + forecast display
- Publishes weather.current and weather.forecast to data bus
- Config: location(s), units (imperial/metric), provider selection

## Scope

**In Scope:** Server fetch, caching, widget, data bus publishing
**Out of Scope:** Multiple simultaneous providers

## Summary

✓ All sub-tasks completed:

- lensing-t8oc: Weather widget component
- lensing-w1yd: Weather server module (API integration)

Feature ready for integration into display app.
