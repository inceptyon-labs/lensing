---
# lensing-o5do
title: 'Feature: Dynamic Plugin Rendering'
status: todo
type: feature
priority: high
tags:
  - pasiv
  - area:frontend
created_at: 2026-02-24T02:45:21Z
updated_at: 2026-02-24T02:45:21Z
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

- [ ] Zones render assigned plugin widgets instead of placeholders
- [ ] Unassigned zones show placeholder
- [ ] WebSocket layout_change messages trigger re-render
- [ ] Plugin widget errors are caught by ErrorBoundary
