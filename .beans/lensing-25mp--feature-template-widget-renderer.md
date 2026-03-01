---
# lensing-25mp
title: 'Feature: Template Widget Renderer'
status: in-progress
type: feature
priority: high
created_at: 2026-02-28T15:44:45Z
updated_at: 2026-03-01T00:57:45Z
parent: lensing-z3aj
blocked_by:
    - lensing-r333
---

Renders builder-created plugins on the display with hybrid sandboxing: Shadow DOM for template-only widgets, iframe for custom JS.

## Goals

- Shadow DOM widget container with scoped CSS
- Template variable injection ({{placeholder}} → connector data)
- Stale data indicator and loading/error placeholders
- iframe sandbox for custom JS widgets (postMessage communication)
- Integration with existing zone/grid layout system

## Scope

**In Scope:** Shadow DOM rendering, variable injection, placeholders, iframe sandbox, grid integration
**Out of Scope:** Custom JS editing in builder (v1 is HTML/CSS only, iframe is future-proofing)
