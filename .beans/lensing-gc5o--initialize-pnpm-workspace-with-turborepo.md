---
# lensing-gc5o
title: Initialize pnpm workspace with Turborepo
status: completed
type: task
priority: high
tags:
  - pasiv
  - size:M
  - area:infra
created_at: 2026-02-16T21:22:45Z
updated_at: 2026-02-16T21:34:59Z
parent: lensing-fgdd
---

Set up the pnpm + Turborepo monorepo structure with workspace packages.

## Acceptance Criteria

- [x] pnpm-workspace.yaml defines all package paths
- [x] turbo.json configures build/dev/test pipelines
- [x] Root package.json with workspace scripts (dev, build, test, lint)
- [x] .gitignore, .nvmrc (Node LTS), .editorconfig

---

**Size:** M

## Summary of Changes

**Files Created:**

- `pnpm-workspace.yaml` — Workspace configuration with packages and apps directories
- `turbo.json` — Turborepo pipeline config with build, dev, test, lint tasks
- `package.json` — Root monorepo package with workspace scripts
- `.nvmrc` — Node version lock (v20 LTS)
- `.editorconfig` — Consistent editor formatting across all IDEs
- `.gitignore` — Comprehensive Node/monorepo/build file exclusions
- `packages/.gitkeep` and `apps/.gitkeep` — Workspace directory structure

**Key Decisions:**

- Used pnpm as package manager (faster, better workspace support than npm)
- Turborepo for build orchestration (caching, task parallelization)
- Node 20 LTS for Raspberry Pi compatibility
- Separate packages/ (shared libs) and apps/ (executable projects) directories

**Notes for Next Task:**

- Shared packages go in packages/ (types, ui, core, cli)
- Applications go in apps/ (display app, host service, etc.)
- Run `npm install` or `pnpm install` to bootstrap the workspace
- Scripts: dev, build, lint, test, clean all work at root level via Turbo
- Each package can have its own package.json with local dependencies
