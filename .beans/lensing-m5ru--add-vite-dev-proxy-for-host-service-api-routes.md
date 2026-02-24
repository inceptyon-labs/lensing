---
# lensing-m5ru
title: Add Vite dev proxy for host service API routes
status: completed
type: task
created_at: 2026-02-24T15:04:37Z
updated_at: 2026-02-24T15:04:37Z
---

## Problem

During development, `GET /plugins` returns 404 because the SvelteKit dev server (port 5173) doesn't know about the host service API routes. The API is served by `@lensing/core`'s REST server on a separate port (CLI default: 3100).

## Fix

Added Vite `server.proxy` config to forward `/plugins`, `/settings`, `/layout`, and `/ask` to the host service. Defaults to `http://localhost:3100`, overridable via `LENSING_API_URL` env var.

## Summary of Changes

- Modified `apps/display/vite.config.ts` to add proxy config
- Proxy target defaults to `http://localhost:3100` (CLI startServer default port)
- Override with `LENSING_API_URL=http://localhost:XXXX`
