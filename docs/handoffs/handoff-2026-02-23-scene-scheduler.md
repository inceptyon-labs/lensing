# Session Handoff: Implement time-based scene triggers

Date: 2026-02-23 17:37:00Z
Issue: lensing-9uz2 - Implement time-based scene triggers
Parent Feature: lensing-js1y (Scene Scheduler)
Parent Epic: lensing-342l (Presence & Automation)

## What Was Done

### Step 1: Scene Schedule Types ✓ COMPLETED

- Created `packages/types/src/schedule-types.ts` with:
  - `CronTime` branded type for HH:MM format
  - `SceneScheduleEntry` interface with time and sceneName
  - `SceneSchedule` interface with id, name, entries[], createdAt, updatedAt
  - Helper functions: `cronTime()`, `isCronTimeReached()`, `getNextScheduleEntry()`
- Added 5 passing tests in `packages/types/src/__tests__/schedule-types.test.ts`
- Exported types and functions from `@lensing/types` index
- Commit: f0c1104

### Step 2: Database Migration & Methods ✓ COMPLETED

- Added migration v2 to `packages/core/src/database.ts`:
  - New table `scene_schedules` with id, name, schedule (JSON), created_at, updated_at
- Implemented CRUD methods in DatabaseInstance:
  - `getSchedule(id)` - retrieve with date parsing
  - `setSchedule(schedule)` - upsert with JSON storage
  - `getAllSchedules()` - returns Record<id, schedule>
  - `deleteSchedule(id)` - returns boolean
- Added method signatures to `DatabaseInstance` interface in types
- Added 8 passing tests in `packages/core/src/__tests__/scene-schedule-db.test.ts`
- Commit: 706f3e7

## Files Changed

```
packages/types/src/schedule-types.ts (NEW, 58 lines)
packages/types/src/__tests__/schedule-types.test.ts (NEW, 60 lines)
packages/types/src/index.ts (MODIFIED, +8 exports)

packages/core/src/database.ts (MODIFIED, +79 lines for migration and methods)
packages/core/src/__tests__/scene-schedule-db.test.ts (NEW, 155 lines)

Total: 5 files, ~400 insertions
```

## Current Branch

- `feature/lensing-9uz2` (2 commits ahead of main)
- All types tests passing (53 passed)
- All core tests passing on database schedule subset (8 passed)

## Next Steps (ordered, IN PROGRESS)

### Step 3: Scene Scheduler Factory

- **File**: `packages/core/src/scene-scheduler.ts` (NEW)
- **Tests**: `packages/core/src/__tests__/scene-scheduler.test.ts` (NEW)
- **Scope**:
  - Create `createSceneScheduler(options)` factory
  - Time evaluation: determine next scene based on current time
  - Integration with SceneManager
  - Automatic scene switching on timer tick
  - Database persistence for loading/saving schedules
  - Accept manual override flag
  - ~20-25 tests expected
- **Acceptance Criteria**:
  - Load schedules from database
  - Evaluate cron times and determine next entry
  - Switch scene at scheduled time
  - Manual override blocks automation
  - Handle edge cases (midnight crossing, no entries, etc.)

### Step 4: CLI Scene Commands

- **File**: `packages/cli/src/commands/scene.ts` (NEW)
- **Scope**:
  - `lensing scene list` - display available scenes and current schedule
  - `lensing scene <name>` - manual override to switch scene
  - Proper error handling for invalid scenes
- **Acceptance Criteria**:
  - Both commands implemented
  - Error handling for non-existent scenes
  - ~5-8 tests expected

### Step 5: Code Review (SC - Sonnet → Codex)

- Run full test suite
- Sonnet Pass: quick scan for bugs
- Fix any Sonnet findings
- Codex Pass: deep review for subtle issues
- Fix any Codex findings

### Step 6: Verification Gate

- Run full test suite (should be 1,100+ tests)
- Build verification
- Lint verification
- TypeCheck verification

### Step 7: Merge to main

## Key Decisions & Patterns

### Database Dates

- `created_at` stored as ISO string in database, parsed to Date on retrieval
- `updatedAt` stored as JSON within schedule object, parsed on retrieval
- Maintains TypeScript strong typing while using JSON storage

### Type Export Strategy

- Moved scene scheduling exports to appear BEFORE DatabaseInstance interface
- Used explicit `import + export` pattern for types (not just `export type { ... } from`)
- Ensures TypeScript can resolve types used in interface definitions

### CronTime Design

- Used branded string type for type safety: `string & { readonly __brand: 'CronTime' }`
- Helper function `cronTime(input)` validates HH:MM format at runtime
- Comparison logic: convert time to minutes-since-midnight for easy comparison

## Notes for Next Session

### Ready to Continue

- Branch is `feature/lensing-9uz2` with 2 commits
- All setup complete (types, database, tests all passing)
- Ready to jump straight to Step 3 TDD for Scene Scheduler
- No blockers or setup needed

### TDD Reminder

- RED: Write failing tests for scene scheduler (time evaluation, switching)
- GREEN: Implement createSceneScheduler factory
- Commit each step
- No refactoring needed if code is clean

### CLI Considerations

- Check existing CLI structure in `packages/cli/src/commands/`
- Look at existing command patterns (should follow same structure)
- Scene list should show: available scenes + current active scene + next scheduled entry

### Upcoming Review

- SC review tier already approved
- Sonnet pass will check for basic bugs
- Codex pass will look for subtle issues in scheduling logic

## Test Status

- Before starting: 1,081 tests passing
- After Step 1: 1,081 tests passing (added 5 new to types)
- After Step 2: 1,089 tests passing (added 8 new to core)
- Target: ~1,110+ after all steps (20-30 new tests)

## Resume Instructions

```bash
# Get back to this task
beans show lensing-9uz2 --json

# Check current branch
git branch

# See commits so far
git log --oneline -5

# Run tests to verify baseline
pnpm test
```
