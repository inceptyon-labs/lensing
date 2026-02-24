---
# lensing-o5do
title: 'Feature: Dynamic Plugin Rendering'
status: in-progress
type: feature
priority: high
tags:
    - pasiv
    - area:frontend
created_at: 2026-02-24T02:45:21Z
updated_at: 2026-02-24T14:08:28Z
parent: lensing-z2ez
---

Replace hardcoded Placeholder components with dynamic plugin widget rendering based on zone assignments.

## Goals

- Display app fetches zone assignments from REST API on load
- Each zone renders the assigned plugin widget (or placeholder if none)
- WebSocket updates trigger live zone re-rendering
- Plugin widgets loaded dynamically from plugin ui_entry
- Error boundaries per-widget (already exist)

## Acceptance Criteria

- [x] Zones render assigned plugin widgets instead of placeholders
- [x] Unassigned zones show placeholder
- [x] WebSocket layout_change messages trigger re-render
- [x] Plugin widget errors are caught by ErrorBoundary
