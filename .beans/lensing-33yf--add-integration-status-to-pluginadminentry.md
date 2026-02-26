---
# lensing-33yf
title: Add integration_status to PluginAdminEntry
status: in-progress
type: task
priority: high
tags:
  - area:backend
created_at: 2026-02-26T02:30:26Z
updated_at: 2026-02-26T02:39:29Z
parent: lensing-wkqw
blocked_by:
  - lensing-b7ye
---

Add `integration_status: 'ready' | 'missing' | 'not_needed'` to PluginAdminEntry. Compute it in buildModuleEntry based on whether required integration fields have values in the DB.

## Files

- packages/types/src/index.ts (PluginAdminEntry)
- packages/core/src/plugin-admin-handlers.ts (buildModuleEntry)

## Acceptance Criteria

- [ ] PluginAdminEntry has `integration_status` field
- [ ] `not_needed` for modules with no integration fields (crypto, news, sports, pir)
- [ ] `ready` when all required integration fields have non-empty values
- [ ] `missing` when any required integration field is empty
- [ ] GET /plugins response includes integration_status
- [ ] Tests for status computation
