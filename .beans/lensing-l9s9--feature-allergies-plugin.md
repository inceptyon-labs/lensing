---
# lensing-l9s9
title: 'Feature: Allergies Plugin'
status: completed
type: feature
priority: normal
tags:
    - pasiv
    - priority:medium
    - area:backend
    - area:frontend
created_at: 2026-02-16T21:20:52Z
updated_at: 2026-02-20T03:00:51Z
parent: lensing-mrxz
---

Allergies/pollen plugin with location-based data and configurable thresholds.

## Goals

- Server module: fetch allergy/pollen data, cache
- Widget: current allergy levels with threshold alerts
- Publishes allergies.current to data bus
- Config: location(s), alert thresholds

## Scope

**In Scope:** Server fetch, caching, widget, threshold alerts
**Out of Scope:** Historical trend charts
