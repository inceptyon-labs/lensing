---
# lensing-r418
title: 'Feature: Agent Gateway'
status: todo
type: feature
priority: normal
tags:
    - pasiv
    - priority:medium
    - area:backend
created_at: 2026-02-16T21:21:38Z
updated_at: 2026-02-16T21:21:38Z
parent: lensing-5abn
---

Lightweight agent gateway client running on the Pi.

## Goals
- Send user requests to remote Agent Service
- Forward data bus snapshots to Agent Service on request
- Receive and display agent responses on kiosk display
- Trigger local UI events and notifications from agent commands

## Scope
**In Scope:** Gateway client, request/response forwarding, data bus snapshots
**Out of Scope:** AI model execution (runs remotely), voice capture
