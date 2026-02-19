---
# lensing-ixcs
title: Implement plugin loader with dynamic imports
status: completed
type: task
priority: high
tags:
  - pasiv
  - size:M
  - area:backend
created_at: 2026-02-16T21:23:41Z
updated_at: 2026-02-19T15:11:46Z
parent: lensing-q1cj
---

Dynamic plugin loader that discovers, validates, and imports plugins.

## Acceptance Criteria

- [x] Scan /plugins/<id>/ directories for plugin.json manifests
- [x] Validate manifest against schema before loading
- [x] Dynamic import of UI widget components (Svelte)
- [x] Dynamic import of server modules (Node)
- [x] Plugin registry: track loaded plugins, their state, and config
- [x] Graceful handling of missing or broken plugins

---

**Size:** M

## Summary of Changes

**Files Created:**

- `packages/core/src/plugin-loader.ts` (238 lines) - Core loader implementation
- `packages/core/src/__tests__/plugin-loader.test.ts` (416 lines) - 19 comprehensive tests

**Files Modified:**

- `packages/types/src/index.ts` - Added 5 new types (PluginLoader, LoadedPlugin, DiscoveredPlugin, etc.)
- `packages/core/src/index.ts` - Exported plugin loader

**Key Implementation:**

1. **Scanner** - Discovers plugin.json manifests in /plugins/<id>/ directories
2. **Validator** - Validates manifests before loading with clear error messages
3. **Dynamic Imports** - Safely imports UI components (Svelte) and server modules (Node.js)
4. **Registry** - Tracks loaded plugins by ID with manifest, modules, and status
5. **Error Isolation** - Plugin failures don't affect other plugins

**Tests:** 19 tests covering all acceptance criteria (all passing)

**Verification Results:**

- ✓ 554/554 tests passing (208 core tests)
- ✓ Build successful (all 5 packages)
- ✓ TypeScript: No errors
- ✓ Merged to main (commit e5d5f9e)

**Next Steps:** Ready to integrate with admin panel, plugin scheduler, and permission enforcer.
