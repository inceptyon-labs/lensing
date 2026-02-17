---
# lensing-1kxh
title: Build plugin dev server for isolated development
status: completed
type: task
priority: high
tags:
  - pasiv
  - size:M
  - area:infra
created_at: 2026-02-16T21:24:07Z
updated_at: 2026-02-17T02:11:20Z
parent: lensing-lncc
---

Isolated dev server for rendering a single plugin with mock data.

## Acceptance Criteria

- [ ] Dev server renders a single plugin component in isolation
- [ ] Mock data payloads fed to the plugin (from JSON fixtures)
- [ ] Hot reload: plugin code changes reflected instantly
- [ ] Plugin manifest validated on startup
- [ ] No dependency on the full host service

---

**Size:** M

## Summary of Changes

Built plugin dev server (createDevServer) infrastructure for isolated plugin development:

- **Manifest Validator** (validateManifest): Validates plugin metadata with strict type checking, permissions validation, array element validation, finite-number checks
- **Fixture Loader** (createFixtureLoader): Injectable fixture loader with path traversal protection, graceful parse error handling, automatic .json key stripping
- **Dev Server** (createDevServer): Lifecycle manager composing validator + loader + file watcher, with reload callbacks, error isolation, and state management

Security fixes:

- Path traversal protection (rejects .. and / in fixture names)
- Finite-number validation (rejects NaN/Infinity)
- Array element type validation (dependencies, allowed_domains, secrets)
- Error handling isolation for watcher callbacks

58 comprehensive tests, all passing. Merged to main.
