---
# lensing-0rn7
title: 'Feature: Data Bus'
status: completed
type: feature
priority: high
tags:
    - pasiv
    - priority:high
    - area:backend
created_at: 2026-02-16T21:20:30Z
updated_at: 2026-02-24T00:30:43Z
parent: lensing-oo03
---

Pub/sub data bus for inter-plugin communication.

## Goals

- Named channels (e.g., weather.current, calendar.today) for publish/subscribe
- Read-only immutable snapshots for subscribers
- Agent integration point (agent subscribes to build composite summaries)
- Typed channel contracts via @lensing/types

## Scope

**In Scope:** Bus implementation, channel types, snapshot immutability
**Out of Scope:** Agent service subscription (agent epic), specific plugin channels
