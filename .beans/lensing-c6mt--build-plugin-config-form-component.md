---
# lensing-c6mt
title: Build plugin config form component
status: in-progress
type: task
priority: normal
tags:
    - area:frontend
    - size:S
created_at: 2026-02-24T02:46:02Z
updated_at: 2026-02-24T14:54:35Z
parent: lensing-aim8
---

Dynamic config form that renders from a plugin's config_schema.

## What to build

- apps/display/src/lib/AdminConfigForm.svelte
- Reads config_schema.fields from the plugin manifest
- Renders appropriate input for each field type:
  - string → text input
  - number → number input (with min/max)
  - boolean → checkbox/toggle
  - select → dropdown from options[]
- Submit calls PUT /plugins/:id/config
- Show required indicator, labels, descriptions
- Design system compliant

## Completed

**Files changed:**
- apps/display/src/lib/AdminConfigForm.svelte (NEW)
- apps/display/__tests__/admin-config-form.test.ts (NEW, 14 tests)
- apps/display/src/lib/AdminPluginCard.svelte (MODIFIED)
- apps/display/src/lib/AdminPluginList.svelte (MODIFIED)
- apps/display/__tests__/admin-plugin.test.ts (MODIFIED, +5 tests)

**Key decisions:**
- Component reads config_schema.fields from PluginAdminEntry.manifest
- Values initialized from plugin.config with type-appropriate defaults (false/0/'')
- Configure button only shown when plugin.manifest.config_schema.fields.length > 0
- Form closes after successful Save (closes=configOpen=false in handleConfigSave)
- API call (PUT /plugins/:id/config) lives in AdminPluginList, not the form itself
- Design tokens: --control-bg/--control-border for inputs, --ember for Save button

**Notes for next task:**
- AdminConfigForm is fully wired: AdminPluginList → AdminPluginCard → AdminConfigForm
- PUT /plugins/:id/config sends { config: Record<string, string|number|boolean> }
- Server merges config with existing state (doesn't replace — partial updates OK)
- 1359 total tests passing

---
*Task completed via TDD (test-first)*
