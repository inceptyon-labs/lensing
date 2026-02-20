---
# lensing-hdi0
title: Build starter plugin template package
status: completed
type: task
priority: normal
tags:
  - pasiv
  - size:M
  - area:infra
created_at: 2026-02-16T21:25:56Z
updated_at: 2026-02-20T01:19:51Z
parent: lensing-7dtq
---

Best-practice plugin template published as @lensing/create-plugin.

## Acceptance Criteria

- [ ] Template plugin with: plugin.json, Svelte widget, server module, tests
- [ ] Comprehensive inline comments explaining SDK conventions
- [ ] Test harness with sample data payloads and assertions
- [ ] README with quickstart instructions
- [ ] Published as @lensing/create-plugin npm package

---

**Size:** M

## Completed

**Commit**: 6e5119d

**Summary**: Built @lensing/create-plugin starter template package with comprehensive documentation, Svelte 5 widget, server module with lifecycle hooks, and 32 tests covering all SDK conventions.

**Files changed**:

- packages/create-plugin/plugin.json (manifest)
- packages/create-plugin/src/server.ts (server module with initialize, handleRequest, lifecycle hooks)
- packages/create-plugin/src/widget.svelte (Svelte 5 component with loading/error/content states)
- packages/create-plugin/src/index.ts (package entry point)
- packages/create-plugin/src/**tests**/plugin.test.ts (32 comprehensive tests)
- packages/create-plugin/README.md (quickstart + SDK documentation)
- package.json, tsconfig.json, vitest.config.ts (build configuration)

**Key decisions**:

- Plugin.json in package root per loader conventions
- Real module imports in tests (not mocks)
- Payload validation returns errors instead of throwing
- Async-safe widget refresh handling
- Comprehensive inline documentation and SDK patterns

**Review**: SC (Sonnet → Codex), 8 issues found and fixed
**Tests**: 32 passing, all 759 total tests passing
**Build**: Compiles without errors
**Verification**: All gates passed
