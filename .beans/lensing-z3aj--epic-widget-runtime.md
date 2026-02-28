---
# lensing-z3aj
title: 'Epic: Widget Runtime'
status: todo
type: epic
priority: high
created_at: 2026-02-28T15:44:09Z
updated_at: 2026-02-28T15:44:09Z
---

The rendering layer that displays builder-created plugins on the smart display. Hybrid sandboxing: Shadow DOM for trusted template widgets, iframe sandbox for custom JS.

## Vision
Render builder-created plugins safely and performantly on the display. Template-only widgets (the common case) use lightweight Shadow DOM. Anything with custom JS gets full iframe isolation.

## Features
- Shadow DOM widget container for template-only plugins
- Template variable injection ({{placeholder}} → live data)
- iframe sandbox for custom JS widgets
- Stale data indicator and loading placeholders
- Integration with existing grid layout system

## Success Criteria
- [ ] Template widgets render in Shadow DOM with scoped CSS
- [ ] {{placeholder}} variables replaced with connector data
- [ ] Stale data shows indicator, missing data shows placeholder
- [ ] Custom JS widgets render in sandboxed iframe
- [ ] Widgets integrate with existing zone/grid layout system
