---
# lensing-ra5p
title: 'Feature: Calendar Plugin (CalDAV/iCloud)'
status: todo
type: feature
priority: high
tags:
    - pasiv
    - priority:high
    - area:backend
    - area:frontend
created_at: 2026-02-16T21:21:02Z
updated_at: 2026-02-16T21:21:02Z
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
