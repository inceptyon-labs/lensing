---
# lensing-zi5d
title: Port Framerr grid CSS and handle styling
status: completed
type: task
priority: high
created_at: 2026-02-25T16:12:32Z
updated_at: 2026-02-25T16:13:51Z
parent: lensing-yoif
---

Port Framerr's grid visual styling, adapted to lensing's gravitational theme.

## Checklist

- [x] Create grid-layout.css with GridStack item styling
- [x] Implement L-bracket corner resize handles via CSS ::after pseudo-elements
- [x] Implement side resize handles (straight lines with rounded caps)
- [x] Style placeholder/ghost: semi-transparent ember fill + dashed ember border
- [x] Style edit mode widget chrome: dashed border with --ember-dim, hover brightens to --ember
- [x] Style drag-ready elevation shadow
- [x] Implement view mode (.locked): no handles, no border, default cursor
- [x] Mobile handle adjustments: 44px touch targets, SVG data URI L-brackets
- [x] Hide side handles on small widgets (h < 2)
- [x] Add @media (hover: hover) for hover-only states

## Summary of Changes

**Files Created:**

- apps/display/src/lib/styles/grid-layout.css (461 lines)

**Files Modified:**

- apps/display/src/lib/styles/global.css (added grid-layout.css import)

All CSS variables cross-referenced against tokens.css — zero undefined references. Build passes cleanly.
