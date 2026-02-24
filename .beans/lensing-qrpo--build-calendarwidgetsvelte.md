---
# lensing-qrpo
title: Build CalendarWidget.svelte
status: in-progress
type: task
priority: normal
created_at: 2026-02-24T18:00:33Z
updated_at: 2026-02-24T22:52:43Z
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
