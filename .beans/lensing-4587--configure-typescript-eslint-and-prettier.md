---
# lensing-4587
title: Configure TypeScript, ESLint, and Prettier
status: in-progress
type: task
priority: high
tags:
  - pasiv
  - size:S
  - area:infra
created_at: 2026-02-16T21:22:53Z
updated_at: 2026-02-16T22:09:40Z
parent: lensing-fgdd
---

Shared tooling configuration at the monorepo root.

## Acceptance Criteria

- [x] tsconfig.base.json with strict mode, path aliases
- [x] Per-package tsconfig.json extending base
- [x] ESLint config with TypeScript and Svelte support
- [x] Prettier config with consistent formatting rules
- [x] Lint and format scripts in root package.json

---

**Size:** S

## Completed

**Files changed:**

- eslint.config.js (new) — ESLint 10 flat config with TypeScript + Svelte + Prettier compat
- .prettierrc (new) — Prettier config: singleQuote, 100 width, es5 trailing commas, svelte plugin
- .prettierignore (new) — Excludes build artifacts, deps, env files
- tooling.test.ts (new) — 3 integration tests for ESLint + Prettier configs
- package.json (modified) — Added 8 devDeps, lint/lint:fix/format/format:check scripts
- packages/cli/tsconfig.json, core/tsconfig.json, ui/tsconfig.json (modified) — Prettier formatting
- packages/types/src/index.ts (modified) — Prettier formatting
- packages/types/src/**tests**/index.test.ts (modified) — Removed unused PluginPermissions import
- packages/core/src/**tests**/imports.test.ts (modified) — Removed unused PluginInstance import
- turbo.json (modified) — Prettier formatting
- All .beans/ markdown files — Prettier formatting (first pass)

**Key decisions:**

- ESLint 10 with flat config (eslint.config.js), not legacy .eslintrc
- typescript-eslint recommended (not strictTypeChecked) to avoid needing per-package tsconfig
- eslint-config-prettier disables all formatting rules (Prettier handles formatting)
- Lint scripts at root level (not per-package via Turborepo) since ESLint config is monorepo-wide
- trailingComma: es5 (safe for all environments)

**Notes for next task:**

- Run `pnpm lint` for ESLint, `pnpm format:check` for Prettier
- `pnpm lint:fix` and `pnpm format` for auto-fixing
- ESLint ignores \*.config.js/ts files
- Root tooling.test.ts must be run separately: `npx vitest run tooling.test.ts`
- When adding Svelte files, they'll be linted by eslint-plugin-svelte and formatted by prettier-plugin-svelte
