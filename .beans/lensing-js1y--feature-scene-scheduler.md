---
# lensing-js1y
title: 'Feature: Scene Scheduler'
status: todo
type: feature
priority: normal
tags:
  - pasiv
  - priority:medium
  - area:backend
created_at: 2026-02-16T21:21:17Z
updated_at: 2026-02-16T21:21:17Z
parent: lensing-342l
---

Time-based and manual scene triggers.

## Goals

- Cron-style schedule for automatic scene changes (morning at 6am, evening at 6pm, sleep at 11pm)
- Manual scene switching from admin UI and CLI
- Scene schedule configuration in admin panel

## Scope

**In Scope:** Time triggers, manual switching, schedule config
**Out of Scope:** Presence triggers (separate feature), agent-driven changes (agent epic)
