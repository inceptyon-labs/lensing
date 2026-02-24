---
# lensing-qrpo
title: Build CalendarWidget.svelte
status: completed
type: task
priority: normal
created_at: 2026-02-24T18:00:33Z
updated_at: 2026-02-24T23:33:05Z
parent: lensing-wbum
blocked_by:
    - lensing-zl2i
    - lensing-e0mr
---

No calendar display widget exists. PluginRenderer has no 'calendar' branch — it falls through to Placeholder.

## What to Build

- apps/display/src/lib/CalendarWidget.svelte
- Props: CalendarEvent[]
- Show upcoming events: title, time, location, calendar color
- Group by day (Today, Tomorrow, etc.)
- Highlight all-day events differently
- Support compact mode (just next 3-5 events)
- Use lensing design system tokens

## Data Shape (from @lensing/types)

```ts
interface CalendarEvent {
  id: string;
  title: string;
  start: string;
  end: string;
  location?: string;
  calendar: string;
  color?: string;
  allDay?: boolean;
}
```

Channel: calendar.events (after lensing-e0mr wires calendar to data bus)

## Blocked By

- lensing-zl2i (PluginRenderer data wiring)
- lensing-e0mr (calendar data bus wiring)

## Key Files

- apps/display/src/lib/CalendarWidget.svelte (NEW)
- apps/display/src/lib/PluginRenderer.svelte (add branch)

## Completed

**Files created:**
- apps/display/src/lib/CalendarWidget.svelte (257 lines)
- apps/display/__tests__/calendar-widget.test.ts (99 lines)

**Files modified:**
- apps/display/src/lib/PluginRenderer.svelte (wired calendar channel + component)
- apps/display/__tests__/plugin-renderer.test.ts (4 new integration tests)
- packages/types/src/index.ts (added CalendarData interface inline)

**Key decisions:**
- Three layout modes: empty state, compact (next 5 events), full (grouped by day)
- Day grouping: Today/Tomorrow/weekday+date using locale string comparison
- All-day events show ember-glow badge
- Calendar color dot renders per-event via inline style
- CalendarData added inline to types/index.ts (avoids circular dependency)

**Test results:**
- 22 new tests passing (18 widget + 4 integration)
- All 268 display tests passing
- Build: clean, no type errors
- Code review: O-level complete, no errors

**Branch:** feature/lensing-qrpo merged to main at 9917d0b
