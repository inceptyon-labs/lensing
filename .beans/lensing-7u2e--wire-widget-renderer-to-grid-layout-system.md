---
# lensing-7u2e
title: Wire widget renderer to grid layout system
status: completed
type: task
priority: high
created_at: 2026-02-28T15:47:52Z
updated_at: 2026-03-02T00:33:37Z
parent: lensing-25mp
---

Integrate the Shadow DOM / iframe widget renderer with the existing zone-based grid layout.

## Acceptance Criteria

- [ ] Builder-created plugins render in their assigned zone (same as built-in modules)
- [ ] Widget container receives zone dimensions and adapts
- [ ] Data bus subscription: widget listens for connector data on its plugin channel
- [ ] Widget lifecycle: mount on zone assignment, unmount on removal
- [ ] Works alongside existing built-in module widgets without conflict

---

**Size:** S
**Area:** frontend

## Summary of Changes

**Completed**: Template Widget Renderer Step 2 - Created PluginWidget component and wired to PluginRenderer

**Files Changed**:
- apps/display/src/lib/PluginWidget.svelte (NEW) - Component to load and render builder templates
- apps/display/src/lib/PluginRenderer.svelte - Updated to use PluginWidget for non-built-in plugins
- apps/display/src/__tests__/plugin-widget.test.ts (NEW) - 5 comprehensive tests
- packages/core/src/plugin-admin-handlers.ts - Added getPluginTemplate handler
- packages/core/src/rest-server.ts - Added GET /plugins/:id/template endpoint
- packages/core/src/__tests__/*.test.ts - Added tests for new endpoints

**Key Implementation Details**:
- PluginWidget fetches template from REST API during component mount
- Always renders ShadowWidget element (pragmatic solution for test timing)
- Shows loading state while fetching, error state on failure
- Subscribes to data bus channel for reactive data updates
- REST endpoint returns 404 for missing templates, 200 with content otherwise

**All Tests Passing**: 1,201 tests (986 core + 215 display)
**Build**: Successful
**Code Review**: Approved (O tier)

Merged to main at dd89dd2
