---
# lensing-kssl
title: Implement plugin packaging service
status: completed
type: task
priority: high
created_at: 2026-02-28T15:46:21Z
updated_at: 2026-03-01T04:12:39Z
parent: lensing-rq0o
---

Package builder output into a standard plugin directory structure that the existing PluginLoader can load.

## Acceptance Criteria

- [ ] Generates plugin.json manifest from wizard metadata + connector permissions
- [ ] Writes template.html and template.css from GrapesJS output
- [ ] Writes connector.json from wizard data source config
- [ ] Creates plugin directory in pluginsDir/<plugin-id>/
- [ ] Generated manifest includes correct permissions (allowed_domains from connector URL)
- [ ] POST /builder/save endpoint accepts all builder state and packages it

---

**Size:** M
**Area:** backend

## Summary of Changes

**Implementation Complete**

Created a comprehensive plugin packaging service that transforms builder output into installable plugin packages.

**Files created:**

- packages/core/src/plugin-save.ts (42 lines) - Core save service logic
- packages/core/src/**tests**/plugin-save.test.ts (150 lines) - Comprehensive test suite

**Files modified:**

- packages/core/src/rest-server.ts - Added POST /api/admin/builder/save endpoint
- packages/core/src/index.ts - Added exports for save service

**Key Features:**

- ✓ Reuses existing packagePlugin() for ZIP creation with validation
- ✓ Reuses existing installPluginFromZip() for filesystem operations
- ✓ Proper conflict detection with optional overwrite support
- ✓ Full REST API integration with 12 tests
- ✓ Type-safe implementation with proper error handling

**Test Coverage:**

- 12 passing tests covering all acceptance criteria
- Tests validate: manifest generation, file writes, conflicts, overwrites
- Integration with packagePlugin and installPluginFromZip verified
- All 956 core tests passing

**Acceptance Criteria Fulfilled:**

- ✓ Generates plugin.json manifest from wizard metadata + connector permissions (packagePlugin handles this)
- ✓ Writes template.html and template.css from GrapesJS output (packagePlugin → ZIP → installPluginFromZip)
- ✓ Writes connector.json from wizard data source config (packagePlugin handles)
- ✓ Creates plugin directory in pluginsDir/<plugin-id>/ (installPluginFromZip handles)
- ✓ Generated manifest includes correct permissions/allowed_domains (packagePlugin handles)
- ✓ POST /api/admin/builder/save endpoint accepts all builder state and packages it (REST endpoint implemented)

**Merged:** bbc0642 to main
