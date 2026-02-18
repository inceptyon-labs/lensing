---
# lensing-yk0m
title: Define plugin.json schema with validation
status: completed
type: task
priority: high
tags:
  - pasiv
  - size:M
  - area:backend
created_at: 2026-02-16T21:23:37Z
updated_at: 2026-02-17T23:34:39Z
parent: lensing-q1cj
---

Define and validate the plugin.json manifest schema.

## Acceptance Criteria

- [x] JSON schema for plugin.json: id, name, version, ui_entry, server_entry, permissions, widget_sizes, dependencies
- [x] Schema validation with zod or ajv — clear error messages on invalid manifests
- [x] TypeScript types generated from/matching the schema in @lensing/types
- [x] Example plugin.json with all fields documented

---

**Size:** M

## Summary of Changes

Created comprehensive plugin.json schema validation and documentation:

**Files Created:**

- packages/cli/src/**tests**/manifest-validator.test.ts: Added 5 new tests for max_request_burst validation
- docs/examples/plugin.json.example: Complete working example with all fields
- docs/examples/PLUGIN_MANIFEST_SCHEMA.md: Detailed documentation of schema fields

**Files Modified:**

- packages/cli/src/manifest-validator.ts: Added max_request_burst validation

**Key Features:**

- Zod-based validation for plugin.json manifest structure
- Covers all fields: id, name, version, ui_entry, server_entry, permissions, widget_sizes, dependencies, config_schema
- Clear error messages for invalid manifests
- TypeScript types in @lensing/types already defined (PluginManifest interface)
- 33 tests (28 original + 5 new) validating schema

**Tests:** 471/471 passing (86 CLI tests including 33 validator tests)

Commits:

- feat: add plugin.json schema validation and documentation (lensing-yk0m)
- style: format documentation and bean files (lensing-yk0m)
