---
# lensing-aim8
title: 'Feature: Admin Panel UI'
status: todo
type: feature
priority: high
tags:
    - pasiv
    - area:frontend
created_at: 2026-02-24T02:45:14Z
updated_at: 2026-02-24T02:45:14Z
parent: lensing-z2ez
---

Build an admin panel in the display app for managing plugins, zones, and settings.

## Goals
- /admin route with plugin management interface
- Plugin list with enable/disable toggles and status indicators
- Zone assignment (drag or select which zone a plugin renders in)
- Plugin config forms (dynamic from config_schema)
- Navigation between display and admin views
- Design system compliant (gravitational lensing theme)

## Acceptance Criteria
- [ ] /admin route renders admin panel
- [ ] Plugin list shows all discovered plugins
- [ ] Enable/disable toggles call REST API
- [ ] Zone assignment dropdown works
- [ ] Config form renders from plugin config_schema
- [ ] Navigation between / and /admin
