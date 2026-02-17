---
# lensing-q2h4
title: 'Feature: Plugin Scheduler & Caching'
status: completed
type: feature
priority: high
tags:
  - pasiv
  - priority:high
  - area:backend
created_at: 2026-02-16T21:20:26Z
updated_at: 2026-02-17T20:40:15Z
parent: lensing-oo03
---

Centralized plugin scheduler with configurable intervals and caching helpers.

## Goals

- Scheduler runs server-side plugins at configured intervals
- Centralized caching with staleness tracking (max_stale support)
- Request coalescing to prevent duplicate API calls
- Resource budget enforcement (refresh rate, request burst)

## Scope

**In Scope:** Scheduler, cache layer, staleness, request coalescing
**Out of Scope:** Individual plugin implementations
