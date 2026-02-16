---
# lensing-s32t
title: 'Feature: Sports Scores Plugin'
status: todo
type: feature
priority: normal
tags:
    - pasiv
    - priority:medium
    - area:backend
    - area:frontend
created_at: 2026-02-16T21:21:06Z
updated_at: 2026-02-16T21:21:06Z
parent: lensing-mrxz
---

Sports scores plugin with league/team configuration and throttled polling.

## Goals
- Server module: sports API integration with league/team config
- Widget: live scores and upcoming schedule
- Publishes sports.scores and sports.schedule to data bus
- Throttled polling with diff updates to minimize load

## Scope
**In Scope:** Score fetching, league/team config, diff updates
**Out of Scope:** Detailed game stats, play-by-play
