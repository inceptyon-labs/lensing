---
# lensing-pamo
title: 'Feature: Theming Foundation'
status: todo
type: feature
priority: high
tags:
    - pasiv
    - priority:high
    - area:frontend
created_at: 2026-02-16T21:20:08Z
updated_at: 2026-02-16T21:20:08Z
parent: lensing-u2k6
---

CSS custom property design token system with dark theme defaults.

## Goals
- Design token system: colors, typography, spacing, depth, opacity
- Dark, high-contrast default theme optimized for glanceable reading
- All UI primitives consume tokens automatically
- Plugins must use theme tokens (no custom palettes)

## Scope
**In Scope:** Token definitions, dark theme, @lensing/ui primitives foundation
**Out of Scope:** Accent color picker, user-created themes, time-adaptive tones (later)
