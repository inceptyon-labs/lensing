---
# lensing-j4k2
title: 'Feature: Display Modes (Scenes)'
status: completed
type: feature
priority: high
tags:
  - pasiv
  - priority:high
  - area:backend
  - area:frontend
created_at: 2026-02-16T21:21:14Z
updated_at: 2026-02-19T15:39:13Z
parent: lensing-342l
---

Scene system with named display modes and transitions.

## Goals

- Scene data model: morning, evening, ambient, focus, alert modes
- Scene switcher with smooth transitions
- Scene persistence in SQLite
- Each scene defines layout profile, active plugins, and visual settings

## Scope

**In Scope:** Scene model, switcher, default scenes, transitions
**Out of Scope:** Time-based triggers (scheduler feature), presence detection

## Summary

All sub-tasks completed. Scene data model and switcher implemented in @lensing/core with persistence callback interface. HTTP Scene API and SQLite wiring deferred to future integration tasks.
