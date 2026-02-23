---
# lensing-kd62
title: 'Feature: Backup & Restore'
status: completed
type: feature
priority: normal
tags:
  - pasiv
  - priority:medium
  - area:backend
created_at: 2026-02-16T21:22:02Z
updated_at: 2026-02-22T11:52:58Z
parent: lensing-oeoo
---

Config export/import with schema versioning for portability and recovery.

## Goals

- Export full config (layout, plugin settings, themes, scene schedules) as JSON
- Import and restore config on a new Pi
- Schema versioning with automatic migrations on import
- CLI commands: `lensing config export`, `lensing config import`

## Scope

**In Scope:** Export, import, schema versioning, CLI commands
**Out of Scope:** Incremental backup, cloud sync
