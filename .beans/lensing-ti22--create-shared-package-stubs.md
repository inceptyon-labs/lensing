---
# lensing-ti22
title: Create shared package stubs
status: completed
type: task
priority: high
tags:
  - pasiv
  - size:M
  - area:infra
created_at: 2026-02-16T21:22:49Z
updated_at: 2026-02-16T21:50:57Z
parent: lensing-fgdd
---

Create stub packages for @lensing/types, @lensing/ui, @lensing/core, @lensing/cli.

## Acceptance Criteria

- [x] packages/types with base TypeScript types and plugin SDK interfaces
- [x] packages/ui with empty Svelte component library structure
- [x] packages/core with Node host service entry point
- [x] packages/cli with CLI entry point
- [x] Each package has package.json with correct name, main, types fields
- [x] Cross-package imports resolve correctly

---

**Size:** M

## Completed

**Files changed:**

- tsconfig.base.json (new) — shared TS config with strict mode, ES2022, bundler moduleResolution, composite
- packages/types/package.json, tsconfig.json, src/index.ts (new) — Plugin SDK interfaces
- packages/types/vitest.config.ts, src/**tests**/index.test.ts (new) — 8 type contract tests
- packages/ui/package.json, tsconfig.json, src/index.ts, vitest.config.ts (new) — UI primitives stub
- packages/core/package.json, tsconfig.json, src/index.ts, vitest.config.ts (new) — Host service stub
- packages/core/src/**tests**/imports.test.ts (new) — 2 cross-package import tests
- packages/cli/package.json, tsconfig.json, src/index.ts, vitest.config.ts (new) — CLI stub
- .gitignore — Fixed dist/ pattern, added \*.tsbuildinfo, unblocked pnpm-lock.yaml
- turbo.json — Fixed pipeline→tasks for Turborepo v2, interactive→persistent, .next→.svelte-kit
- package.json — Added typescript and vitest devDependencies
- pnpm-lock.yaml (new)

**Key decisions:**

- Used bundler moduleResolution (appropriate for SvelteKit target, revisit if pure Node packages need node16)
- composite: true for TS project references across packages
- passWithNoTests: true in vitest configs to allow packages without tests to pass CI
- CLI shebang deferred to tsup build tool configuration (future task)
- Type re-exports in core/ui establish the public API surface for each package

**Notes for next task:**

- All 4 packages build and test successfully via `pnpm build` and `pnpm test`
- Cross-package imports verified working: core re-exports PluginManifest/PluginInstance/PluginStatus, ui re-exports ZoneName/ZoneConfig
- TypeScript version: ^5.5.0, Vitest version: ^2.0.0, Turborepo: ^2.1.0
- ESLint/Prettier not yet configured (that's the next task lensing-4587)
