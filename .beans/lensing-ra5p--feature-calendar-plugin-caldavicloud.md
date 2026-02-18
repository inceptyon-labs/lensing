---
# lensing-ra5p
title: 'Feature: Calendar Plugin (CalDAV/iCloud)'
status: completed
type: feature
priority: high
tags:
    - pasiv
    - priority:high
    - area:backend
    - area:frontend
created_at: 2026-02-16T21:21:02Z
updated_at: 2026-02-18T00:20:21Z
parent: lensing-mrxz
---

Apple Calendar integration via CalDAV with app-specific password authentication.

## Goals

- Server module: CalDAV client with iCloud app-specific password auth
- Widget: today's events + next 7 days (configurable range)
- Publishes calendar.today and calendar.upcoming to data bus
- Robust error handling for iCloud quirks (auth edge cases, rate limits)

## Scope

**In Scope:** CalDAV fetch, iCloud auth, event rendering, error handling
**Out of Scope:** Google Calendar, event creation/editing

## Summary of Changes

**Tasks completed:**
1. lensing-9wza: CalDAV client with iCloud auth - 337 lines, 37 tests
2. lensing-o2up: Calendar widget component - UI integration

**Deliverables:**
- CalDAV server module in packages/core (createCalendarServer factory)
- Calendar widget component in packages/ui
- Full test coverage with 37 CalDAV tests + widget tests
- Documentation and examples

**All acceptance criteria met:**
- ✓ CalDAV client with iCloud app-specific password auth
- ✓ Event fetching for today + configurable range
- ✓ Listener-based event publishing
- ✓ Robust error handling and retry logic
- ✓ Widget UI component with event display
- ✓ Integration ready for data bus

**Status:** Feature complete and merged to main
