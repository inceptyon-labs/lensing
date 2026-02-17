---
# lensing-o2up
title: Build calendar widget component
status: in-progress
type: task
priority: high
tags:
    - pasiv
    - size:M
    - area:frontend
created_at: 2026-02-16T21:24:37Z
updated_at: 2026-02-17T01:10:07Z
parent: lensing-ra5p
---

Svelte calendar widget: today's events and upcoming schedule.

## Acceptance Criteria

- [x] Today's events with time, title, and location
- [x] Upcoming events for configurable range (default 7 days)
- [x] Color-coded by calendar
- [x] Supports small (today only) and large (full week) widget sizes
- [x] Staleness indicator and loading/error states

---

**Size:** M

## Completed

**Files changed:**
- packages/types/src/index.ts — Added CalendarWidgetSize, CalendarEvent types
- packages/ui/src/calendar-store.ts — New: calendar widget state store
- packages/ui/src/__tests__/calendar-store.test.ts — 24 tests
- packages/ui/src/index.ts — Updated exports

**Key decisions:**
- Framework-agnostic store (no Svelte dependency) matching admin-store pattern
- Overlap-based filtering for getTodayEvents/getUpcomingEvents (handles multi-day events)
- Date-only strings (YYYY-MM-DD) parsed as local time to prevent timezone shift
- Configurable rangeDays (default 7) and staleness_ms (default 300s)
- setEvents auto-clears error state

**Notes for next task:**
- Use createCalendarStore() for calendar widget state
- getTodayEvents() returns events overlapping today, sorted by start time
- getUpcomingEvents() returns events within configured range
- isStale() returns true when data older than staleness_ms threshold
- Widget size modes: 'small' (today only) and 'large' (full week)
