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
updated_at: 2026-02-24T14:45:51Z
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
