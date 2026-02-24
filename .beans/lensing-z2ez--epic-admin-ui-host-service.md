---
# lensing-z2ez
title: 'Epic: Admin UI & Host Service'
status: in-progress
type: epic
priority: high
created_at: 2026-02-24T02:44:50Z
updated_at: 2026-02-24T02:47:57Z
---

Wire all core building blocks into a running system with admin UI for plugin management. Currently the display shows only placeholders and there's no way to boot or administer the system.

## Goals

- Host service entrypoint that boots REST + WS + DB + PluginLoader + DataBus
- Plugin CRUD REST endpoints
- Admin panel UI in the display app (/admin route)
- Dynamic plugin widget rendering in zones (replace placeholders)

## Architecture

- Host service lives in packages/core or apps/host
- Admin UI lives in apps/display/src/routes/admin/
- REST API extended with plugin management endpoints
- WebSocket pushes live updates to display
- Admin store syncs with REST API
