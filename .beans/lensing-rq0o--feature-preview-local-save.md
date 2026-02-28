---
# lensing-rq0o
title: 'Feature: Preview & Local Save'
status: todo
type: feature
priority: high
created_at: 2026-02-28T15:44:31Z
updated_at: 2026-02-28T15:48:01Z
parent: lensing-jwka
blocked_by:
    - lensing-alyh
---

Live preview of the widget with real data and local save that produces a standard plugin package installable by the existing PluginLoader.

## Goals
- Live preview pane rendering widget at actual display size with real connector data
- Plugin packaging: manifest + HTML/CSS + connector.json → plugin directory
- Wire local save to existing PluginLoader install flow
- Auto-save GrapesJS state to localStorage for crash recovery

## Scope
**In Scope:** Preview rendering, data injection, packaging, local install, auto-save
**Out of Scope:** Thumbnail generation (done at publish time), marketplace publishing
