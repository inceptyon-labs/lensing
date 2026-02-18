---
# lensing-002p
title: Implement dark theme defaults
status: completed
type: task
priority: high
tags:
    - pasiv
    - size:S
    - area:frontend
created_at: 2026-02-16T21:23:23Z
updated_at: 2026-02-18T01:32:56Z
parent: lensing-pamo
---

Default dark theme optimized for glanceable reading at distance.

## Acceptance Criteria

- [x] Dark, high-contrast color values assigned to all color tokens
- [x] Typography optimized for large displays (big text, clear hierarchy)
- [x] Theme applied globally via :root custom properties
- [x] All placeholder widgets and layout use theme tokens (no hardcoded colors)

---

**Size:** S

## Completion Summary

All acceptance criteria verified and implemented:

**Theme Tokens:**
- 10+ token categories defined in apps/display/src/lib/styles/tokens.css
- Surface tokens: void (--4%), event-horizon (--7%), accretion (--10%), singularity (--13%)
- Text tokens: starlight (90%), dim-light (62%), faint-light (42%), ghost-light (28%)
- Accent tokens: ember, ember-dim, ember-glow, ember-trace (warm gold-orange)
- Semantic tokens: alert-urgent, alert-warning, alert-success, alert-info (desaturated)
- Control tokens: backgrounds, borders, focus states
- Typography: size scale (12px-48px), weights (400-700), tracking, leading
- Spacing: 4px base unit (4,8,12,16,24,32,48,64)
- Radius: 4px-16px for different component sizes
- Animation: durations (100ms-4s), easing functions

**Global Application:**
- apps/display/src/lib/styles/global.css imports tokens.css and applies to :root
- body: background-color var(--void), color var(--starlight), font-family var(--font-sans)
- Typography: h1-h6 use var(--weight-semi), var(--leading-tight)
- Focus visible: outline 2px solid var(--ember)
- All base elements use theme tokens

**Component Theme Usage:**
- Placeholder.svelte: background-color var(--event-horizon), border var(--edge), color var(--starlight)
- Layout.svelte: background-color var(--void), borders var(--edge)
- Zone.svelte: padding var(--space-2), gap var(--space-2)
- Zero hardcoded colors in any component

**Tests:**
- 12 design-system tests: all passing (✓)
- Verified: surface colors, text colors, accent colors, borders, spacing, typography, radius, animation tokens
- Verified: global.css imports and applies tokens
- Verified: no hardcoded color values

**Verification:**
- ✓ All 55 display tests passing
- ✓ All 502 project tests passing
- ✓ No hardcoded colors found
- ✓ All components using theme tokens
