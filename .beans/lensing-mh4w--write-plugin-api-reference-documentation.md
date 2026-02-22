---
# lensing-mh4w
title: Write plugin API reference documentation
status: completed
type: task
priority: normal
tags:
  - pasiv
  - size:M
  - area:infra
created_at: 2026-02-16T21:25:44Z
updated_at: 2026-02-21T22:53:20Z
parent: lensing-vrze
---

Comprehensive plugin API reference documentation.

## Acceptance Criteria

- [x] Plugin manifest spec (all plugin.json fields documented with examples)
- [x] SDK types reference (@lensing/types)
- [x] Plugin lifecycle (load → init → schedule → render → destroy)
- [x] Data bus API (publish, subscribe, channel types)
- [x] Permissions guide (domains, intervals, secrets declaration)

---

**Size:** M

## Summary of Changes

**Files changed:**

- docs/PLUGIN_API_REFERENCE.md (new, ~1000 lines)

**Key decisions:**

- Documented GridSpan as "planned but not yet validated" since manifest loader only accepts string arrays
- Noted config_schema lives on PluginManifestWithConfig, not base PluginManifest
- Clarified max_request_burst limits scheduler ticks, not individual HTTP requests
- Noted shallow freeze on data bus messages

**Notes for next task:**

- PLUGIN_DEVELOPMENT.md references PLUGIN_MANIFEST.md which doesn't exist as separate file (covered by API reference)
- Consider adding a PLUGIN_MANIFEST.md redirect or updating cross-references
