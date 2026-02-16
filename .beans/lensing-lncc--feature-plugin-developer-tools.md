---
# lensing-lncc
title: 'Feature: Plugin Developer Tools'
status: todo
type: feature
priority: high
tags:
  - pasiv
  - priority:high
  - area:infra
created_at: 2026-02-16T21:20:34Z
updated_at: 2026-02-16T21:20:34Z
parent: lensing-oo03
---

CLI scaffolding, isolated dev server, and test harness for plugin development.

## Goals

- `lensing plugin create <name>` scaffolds plugin from template
- Isolated dev server renders a single plugin with mock data
- Hot reload: change plugin code, see updates without host restart
- Test harness: feed sample payloads, validate manifest schema

## Scope

**In Scope:** Scaffolding CLI, dev server, hot reload, test harness
**Out of Scope:** DevTools panel in admin UI (later), plugin registry
