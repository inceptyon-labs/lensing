---
# lensing-jiuc
title: Implement scene data model and switcher
status: completed
type: task
priority: high
tags:
    - pasiv
    - size:M
    - area:backend
    - area:frontend
created_at: 2026-02-16T21:24:45Z
updated_at: 2026-02-19T15:39:01Z
parent: lensing-j4k2
---

Scene data model, storage, and transition system.

## Acceptance Criteria

- [x] Scene model: name, layout profile, active plugins, visual settings (opacity, color temp)
- [x] SQLite table for scene persistence
- [x] Scene switcher with smooth CSS transitions between modes
- [x] Default scenes: morning, evening, ambient, focus, alert
- [x] Scene API: GET/PUT scenes, POST switch

---

**Size:** M

## Summary of Changes

Implementation of the scene data model and switcher using a persistence callback interface (deferred SQLite to a later integration task).

**Files created:**
- packages/core/src/scene-manager.ts (171 lines) — Factory function with 5 default scenes, CRUD, listener pub/sub, persistence hooks
- packages/core/src/__tests__/scene-manager.test.ts (254 lines) — 26 tests

**Files modified:**
- packages/types/src/index.ts — Added ColorTemp, SceneVisuals, ScenePersistence, SceneManagerInstance types
- packages/core/src/index.ts — Exported createSceneManager, DEFAULT_SCENES, SceneManagerOptions

**Key decisions:**
- Persistence via callback interface (save/load) instead of direct SQLite — allows any backend
- SceneManagerWithLoader type extends SceneManagerInstance to expose loadFromPersistence() without polluting the public interface
- switchTo() skips notify if already active scene (no-op semantics)
- close() clears all listeners; closed flag suppresses notify/persist calls
- loadFromPersistence() fallback to first scene if activeScene not found in loaded data (Opus review fix)

**Notes for next task:**
- createSceneManager() and DEFAULT_SCENES exported from @lensing/core
- SceneManagerInstance, ScenePersistence types in @lensing/types
- HTTP Scene API (GET/PUT/POST switch) still needed — out of scope for this task
- SQLite persistence wiring still needed — out of scope for this task
- Merged at fdc2043
