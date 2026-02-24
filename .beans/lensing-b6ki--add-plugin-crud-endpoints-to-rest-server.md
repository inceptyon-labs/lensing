---
# lensing-b6ki
title: Add plugin CRUD endpoints to REST server
status: in-progress
type: task
priority: high
tags:
  - area:backend
  - size:M
created_at: 2026-02-24T02:45:48Z
updated_at: 2026-02-24T03:28:30Z
parent: lensing-ij9t
---

Extend createRestServer with plugin management endpoints.

## What to build

- Extend RestServerHandlers with plugin callbacks:
  - getPlugins: () => PluginAdminEntry[]
  - getPlugin: (id: string) => PluginAdminEntry | undefined
  - setPluginEnabled: (id: string, enabled: boolean) => void
  - updatePluginConfig: (id: string, config: Record<string, unknown>) => void
  - assignPluginZone: (id: string, zone: ZoneName | undefined) => void
  - reloadPlugins: () => Promise<void>
- Register routes:
  - GET /plugins → list all
  - GET /plugins/:id → single plugin
  - PUT /plugins/:id/enabled → { enabled: boolean }
  - PUT /plugins/:id/config → { config: {...} }
  - PUT /plugins/:id/zone → { zone: ZoneName | null }
  - POST /plugins/reload → trigger reload
- Broadcast WS message on mutations

## Notes

- Follow existing route registration pattern (Map-based)
- Parse :id from URL path manually (no router library)
- Return 404 for unknown plugin IDs
