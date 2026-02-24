---
# lensing-q1cj
title: 'Feature: Plugin Manifest & Loader'
status: completed
type: feature
priority: high
tags:
    - pasiv
    - priority:high
    - area:backend
created_at: 2026-02-16T21:20:22Z
updated_at: 2026-02-24T00:30:43Z
parent: lensing-oo03
---

Plugin manifest schema, validation, dynamic loading, and permission enforcement.

## Goals

- plugin.json schema: id, name, version, ui_entry, server_entry, permissions, widget_sizes, dependencies
- Schema validation on load with clear error messages
- Dynamic import of plugin UI components and server modules
- Permission enforcement (allowed domains, refresh caps, secrets)

## Scope

**In Scope:** Manifest spec, validation, loader, permissions
**Out of Scope:** Scaffolding CLI (separate feature), admin UI (separate feature)
