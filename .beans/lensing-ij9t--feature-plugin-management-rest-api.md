---
# lensing-ij9t
title: 'Feature: Plugin Management REST API'
status: in-progress
type: feature
priority: high
tags:
  - pasiv
  - area:backend
created_at: 2026-02-24T02:45:07Z
updated_at: 2026-02-24T13:23:54Z
parent: lensing-z2ez
---

Add plugin CRUD endpoints to the REST server so the admin UI can manage plugins.

## Goals

- GET /plugins — list all plugins with status, zone, config
- GET /plugins/:id — single plugin detail
- PUT /plugins/:id/enabled — enable/disable toggle
- PUT /plugins/:id/config — update plugin configuration
- PUT /plugins/:id/zone — assign plugin to a display zone
- POST /plugins/reload — reload all plugins from disk
- WebSocket broadcast on plugin state changes

## Acceptance Criteria

- [ ] All endpoints implemented with proper error handling
- [ ] Plugin state persisted to database
- [ ] WebSocket broadcasts plugin_data messages on changes
- [ ] Tests cover all endpoints
