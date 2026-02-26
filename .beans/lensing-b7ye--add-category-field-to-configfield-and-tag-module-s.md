---
# lensing-b7ye
title: Add category field to ConfigField and tag MODULE_SCHEMAS
status: completed
type: task
priority: high
tags:
  - area:backend
created_at: 2026-02-26T02:30:20Z
updated_at: 2026-02-26T02:39:07Z
parent: lensing-wkqw
---

Add `category: 'integration' | 'widget'` to the ConfigField interface. Tag every field in MODULE_SCHEMAS with the correct category per the design doc classification.

Integration fields: credentials, API keys, server URLs (set up once)
Widget fields: display preferences, per-instance settings

## Files

- packages/types/src/index.ts (ConfigField interface)
- packages/types/src/module-settings.ts (MODULE_SCHEMAS)

## Acceptance Criteria

- [x] ConfigField has optional `category` field typed `'integration' | 'widget'`
- [x] All MODULE_SCHEMAS fields tagged correctly
- [x] Helper function: `getIntegrationFields(schema)` and `getWidgetFields(schema)`
- [x] Helper function: `moduleNeedsIntegration(schema)` — true if any field is 'integration'
- [x] Tests for helpers

## Summary of Changes

Added `ConfigFieldCategory = 'integration' | 'widget'` type to `packages/types/src/index.ts` and tagged all MODULE_SCHEMAS fields. Added three helpers: `getIntegrationFields`, `getWidgetFields`, `moduleNeedsIntegration`. 16 tests added. Merged in b14f645.
