---
# lensing-f2jb
title: 'Feature: SvelteKit Display App'
status: todo
type: feature
priority: high
tags:
    - pasiv
    - priority:high
    - area:frontend
created_at: 2026-02-16T21:20:00Z
updated_at: 2026-02-16T21:20:00Z
parent: lensing-u2k6
---

SvelteKit app with zone-based layout system for the kiosk display.

## Goals
- Zone-based layout with named regions (top-bar, left-col, center, right-col, bottom-bar)
- CSS grid with configurable rows/columns within zones
- Per-widget error boundaries — a bad plugin never crashes the whole display
- Minimal client JS for Pi 3B performance

## Scope
**In Scope:** Layout system, routing, error boundaries, placeholder widgets
**Out of Scope:** Plugin rendering (depends on SDK), admin panel
