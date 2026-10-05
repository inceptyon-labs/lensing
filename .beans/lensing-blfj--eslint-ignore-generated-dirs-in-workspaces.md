---
# lensing-blfj
title: 'ESLint: ignore generated dirs in workspaces'
status: completed
type: task
created_at: 2026-10-05T02:27:32Z
updated_at: 2026-10-05T02:27:32Z
---

Flat-config ignore patterns like 'dist/' only matched at the repo root, so apps/display/build, packages/*/dist and .svelte-kit were linted.

- [x] Prefix generated-dir ignores with **/ and ignore vite timestamp files

## Summary of Changes

ignores now use **/node_modules/, **/dist/, **/.svelte-kit/, **/build/, **/.turbo/ and **/*.timestamp-*.mjs. Lint problems 2323 -> 240, all in source.
