---
# lensing-wkqw
title: Config field categories + integration status types
status: in-progress
type: feature
priority: high
tags:
  - area:backend
created_at: 2026-02-26T02:30:07Z
updated_at: 2026-02-26T02:30:54Z
parent: lensing-ht6n
---

Split MODULE_SCHEMAS fields into integration vs widget categories. Add integration_status to PluginAdminEntry. This is the foundation all other features build on.

## Acceptance Criteria

- [ ] ConfigField has a `category: 'integration' | 'widget'` field
- [ ] Every field in MODULE_SCHEMAS is tagged with the correct category
- [ ] PluginAdminEntry has `integration_status: 'ready' | 'missing' | 'not_needed'`
- [ ] Existing tests updated/passing
- [ ] New tests for field categorization helpers
