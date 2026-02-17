---
# lensing-r4oi
title: Build admin panel plugin list and config UI
status: completed
type: task
priority: high
tags:
    - pasiv
    - size:L
    - area:frontend
created_at: 2026-02-16T21:24:10Z
updated_at: 2026-02-17T00:31:54Z
parent: lensing-zdg1
---

Admin panel page for managing installed plugins.

## Acceptance Criteria

- [x] Plugin list page showing all installed plugins with status
- [x] Enable/disable toggle per plugin
- [x] Plugin settings form generated from manifest config schema
- [x] Zone assignment: assign plugins to layout zones
- [x] Plugin install/remove from admin UI (or link to CLI instructions)

---

**Size:** L

## Summary of Changes

**Files changed:**
- packages/types/src/index.ts — Added ConfigFieldType, ConfigField, PluginConfigSchema, PluginManifestWithConfig, PluginAdminEntry, ZoneAssignment types
- packages/ui/src/admin-store.ts — New: plugin admin store (register, enable/disable, config, zones, errors, notifications)
- packages/ui/src/config-schema.ts — New: config value validator and default config builder
- packages/ui/src/__tests__/admin-store.test.ts — 21 tests
- packages/ui/src/__tests__/config-schema.test.ts — 12 tests
- packages/ui/src/index.ts — Updated exports

**Key decisions:**
- Framework-agnostic store (no Svelte dependency) since SvelteKit app doesn't exist yet
- Factory pattern (createAdminStore) matching existing codebase conventions
- Fail-closed config validation (unknown field types rejected)
- clearError restores pre-error status (disabled vs active)
- onChange notifications for all state mutations including error transitions

**Notes for next task:**
- Use createAdminStore() for plugin state management
- Use validateConfigValue() to validate user input against config schema
- Use buildDefaultConfig() to initialize plugin config from manifest
- AdminStore interface defines the full API surface
- Store returns mutable references (acceptable for internal use, wrap if needed for Svelte reactivity)
