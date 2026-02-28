---
# lensing-jwka
title: 'Epic: Plugin Builder'
status: todo
type: epic
priority: high
created_at: 2026-02-28T15:43:59Z
updated_at: 2026-02-28T15:43:59Z
---

The no-code visual plugin builder — a GrapesJS-powered editor embedded in the admin UI that lets users create display widgets through a guided wizard: metadata → data source → visual design → preview → save.

## Vision

Make plugin creation accessible to non-technical users. The builder handles manifest generation, connector configuration, and visual layout — producing a standard plugin package identical to hand-crafted plugins.

## Features

- Step-by-step builder wizard (metadata, data source, design, preview)
- GrapesJS visual editor with constrained widget blocks
- Layout templates (single value, list, grid, etc.)
- Data binding (template placeholders mapped to connector fields)
- Live preview with real data at actual display size
- Local save and auto-recovery

## Success Criteria

- [ ] Builder wizard guides user through all steps
- [ ] GrapesJS editor renders with widget-appropriate blocks
- [ ] Layout templates provide starting points
- [ ] Data fields bindable as {{placeholder}} blocks
- [ ] Live preview shows widget with real fetched data
- [ ] Local save produces valid plugin package installable by PluginLoader
- [ ] Auto-save to localStorage for crash recovery
