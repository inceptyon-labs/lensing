---
# lensing-97w9
title: Grid-driven module lifecycle
status: in-progress
type: feature
priority: high
tags:
  - area:backend
created_at: 2026-02-26T02:30:07Z
updated_at: 2026-02-26T02:56:38Z
parent: lensing-ht6n
---

Replace enabled/disabled with grid-driven boot/stop. When a widget is added to the grid, boot the module. When the last widget for a module is removed, stop it.

## Acceptance Criteria

- [ ] New endpoint or mechanism to sync running modules with grid layout
- [ ] Modules boot when their widget is added to grid (if integration is ready)
- [ ] Modules stop when their last widget is removed from grid
- [ ] `enabled` field and `setPluginEnabled` handler removed
- [ ] `bootEnabledModules` replaced with grid-aware boot
