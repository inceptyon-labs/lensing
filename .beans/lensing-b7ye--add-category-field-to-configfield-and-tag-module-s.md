---
# lensing-b7ye
title: Add category field to ConfigField and tag MODULE_SCHEMAS
status: in-progress
type: task
priority: high
tags:
  - area:backend
created_at: 2026-02-26T02:30:20Z
updated_at: 2026-02-26T02:30:54Z
parent: lensing-wkqw
---

Add `category: 'integration' | 'widget'` to the ConfigField interface. Tag every field in MODULE_SCHEMAS with the correct category per the design doc classification.

Integration fields: credentials, API keys, server URLs (set up once)
Widget fields: display preferences, per-instance settings

## Files

- packages/types/src/index.ts (ConfigField interface)
- packages/types/src/module-settings.ts (MODULE_SCHEMAS)

## Acceptance Criteria

- [ ] ConfigField has optional `category` field typed `'integration' | 'widget'`
- [ ] All MODULE_SCHEMAS fields tagged correctly
- [ ] Helper function: `getIntegrationFields(schema)` and `getWidgetFields(schema)`
- [ ] Helper function: `moduleNeedsIntegration(schema)` — true if any field is 'integration'
- [ ] Tests for helpers
