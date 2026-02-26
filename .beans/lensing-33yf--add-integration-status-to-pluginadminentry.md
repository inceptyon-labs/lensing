---
# lensing-33yf
title: Add integration_status to PluginAdminEntry
status: completed
type: task
priority: high
tags:
    - area:backend
created_at: 2026-02-26T02:30:26Z
updated_at: 2026-02-26T02:46:10Z
parent: lensing-wkqw
blocked_by:
    - lensing-b7ye
---

Add `integration_status: 'ready' | 'missing' | 'not_needed'` to PluginAdminEntry. Compute it in buildModuleEntry based on whether required integration fields have values in the DB.

## Files

- packages/types/src/index.ts (PluginAdminEntry)
- packages/core/src/plugin-admin-handlers.ts (buildModuleEntry)

## Acceptance Criteria

- [x] PluginAdminEntry has `integration_status` field
- [x] `not_needed` for modules with no integration fields (crypto, news, sports, pir)
- [x] `ready` when all required integration fields have non-empty values
- [x] `missing` when any required integration field is empty
- [x] GET /plugins response includes integration_status
- [x] Tests for status computation

## Summary of Changes

Added `integration_status?: 'ready' | 'missing' | 'not_needed'` to `PluginAdminEntry` in `packages/types/src/index.ts`. Computed in `buildModuleEntry` in `packages/core/src/plugin-admin-handlers.ts` using `getIntegrationFields` helper. Also re-exported helper functions from `@lensing/types` index. Merged in fd5b070.
