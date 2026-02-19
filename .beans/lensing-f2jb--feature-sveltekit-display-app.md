---
# lensing-f2jb
title: 'Feature: SvelteKit Display App'
status: completed
type: feature
priority: high
tags:
  - pasiv
  - priority:high
  - area:frontend
created_at: 2026-02-16T21:20:00Z
updated_at: 2026-02-18T02:06:47Z
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

## Summary of Changes

SvelteKit display app with zone-based layout and per-widget error boundaries completed successfully.

**Features Delivered:**

1. Zone-based layout (Layout.svelte)
   - 5 configurable zones: top-bar, left-col, center, right-col, bottom-bar
   - CSS grid with flexible rows/columns per zone
   - Full design system integration

2. Per-widget error boundaries
   - ErrorBoundary.svelte using Svelte 5 `<svelte:boundary>`
   - Graceful error display with retry mechanism
   - 13 widget slots wrapped for isolation

**Files Created:**

- apps/display/ (full SvelteKit app)
- Layout.svelte, Placeholder.svelte, ErrorBoundary.svelte
- 13 comprehensive test files (68 tests)
- Design system (tokens, system.md)

**Tests:** 68/68 passing ✓
**Build:** Successful ✓
**Design:** Complete token coverage ✓

Ready for plugin integration.
