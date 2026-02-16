---
# lensing-995t
title: 'Feature: Node Host Service'
status: todo
type: feature
priority: high
tags:
  - pasiv
  - priority:high
  - area:backend
created_at: 2026-02-16T21:20:03Z
updated_at: 2026-02-16T21:20:03Z
parent: lensing-u2k6
---

Node.js host service with REST API, WebSocket push, and SQLite persistence.

## Goals

- REST API for admin actions and configuration
- WebSocket server pushing updates to display UI
- Auto-reconnect handling for network hiccups and Pi sleep
- SQLite for settings, layout, and plugin state persistence

## Scope

**In Scope:** REST endpoints, WebSocket server, SQLite schema, auto-reconnect
**Out of Scope:** Plugin scheduler (SDK feature), notification queue (later epic)
