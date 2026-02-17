---
# lensing-2fvm
title: Create SvelteKit app with zone-based layout
status: completed
type: task
priority: high
tags:
    - pasiv
    - size:L
    - area:frontend
created_at: 2026-02-16T21:22:57Z
updated_at: 2026-02-17T22:16:54Z
parent: lensing-f2jb
---

SvelteKit display app with named layout zones and CSS grid.

## Acceptance Criteria

- [x] SvelteKit app in apps/display (or apps/web)
- [x] Zone-based layout component with named regions: top-bar, left-col, center, right-col, bottom-bar
- [x] CSS grid with configurable rows/columns within each zone
- [x] Layout reads zone config from host API (initially hardcoded)
- [x] Placeholder widgets render in each zone
- [x] Responsive: fills available screen space for kiosk fullscreen

---

**Size:** L
