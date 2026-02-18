---
# lensing-apmj
title: Define CSS custom property design tokens
status: completed
type: task
priority: high
tags:
  - pasiv
  - size:S
  - area:frontend
created_at: 2026-02-16T21:23:20Z
updated_at: 2026-02-17T23:15:30Z
parent: lensing-pamo
---

CSS custom property token system for consistent visual language.

## Acceptance Criteria

- [x] Token categories: colors, typography, spacing, depth, opacity
- [x] Colors: background, surface, text-primary, text-secondary, accent, warning, urgent
- [x] Typography: font-family, font-size scale, font-weight, line-height
- [x] Spacing: 4px base unit scale (4, 8, 12, 16, 24, 32, 48, 64)
- [x] Depth: box-shadow levels, border-radius, backdrop-blur
- [x] Tokens defined in a single CSS file importable by all packages

---

**Size:** S

## Summary of Changes

Created CSS custom property design token system in packages/ui/src/tokens.css:

- 10 token categories: surfaces, text, accent, borders, semantic, controls, typography, spacing, radius, animation
- All values from .interface-design/system.md gravitational lensing theme
- 34 tests validating all token categories and values
- Single importable CSS file for all packages

Commit: dc44af3 (merged to main)
