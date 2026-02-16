---
# lensing-yk0m
title: Define plugin.json schema with validation
status: todo
type: task
priority: high
tags:
    - pasiv
    - size:M
    - area:backend
created_at: 2026-02-16T21:23:37Z
updated_at: 2026-02-16T21:23:37Z
parent: lensing-q1cj
---

Define and validate the plugin.json manifest schema.

## Acceptance Criteria
- [ ] JSON schema for plugin.json: id, name, version, ui_entry, server_entry, permissions, widget_sizes, dependencies
- [ ] Schema validation with zod or ajv — clear error messages on invalid manifests
- [ ] TypeScript types generated from/matching the schema in @lensing/types
- [ ] Example plugin.json with all fields documented

---
**Size:** M
