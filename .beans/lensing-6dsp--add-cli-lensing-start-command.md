---
# lensing-6dsp
title: Add CLI lensing start command
status: in-progress
type: task
priority: normal
tags:
    - area:backend
    - size:S
created_at: 2026-02-24T02:45:35Z
updated_at: 2026-02-24T14:43:42Z
parent: lensing-is1m
---

Add a start command to the CLI that boots the host service.

## What to build

- packages/cli/src/start.ts — imports createHostService, reads config, starts
- Default port: 3100
- Default pluginsDir: ./plugins
- Default dbPath: ./data/lensing.db
- Log startup info and listening address

## Completed

**Files changed:**
- packages/cli/src/commands/start.ts (NEW)
- packages/cli/src/__tests__/start.test.ts (NEW)
- packages/cli/src/index.ts (MODIFIED)

**Key decisions:**
- CLI defaults differ from core: port 3100 (vs 0), dbPath './data/lensing.db' (vs ':memory:')
- Factory pattern consistent with project (createHostService wrapper)
- Mock strategy: vi.mock() at module level for clean test isolation

**Notes for next task:**
- startServer exported from @lensing/cli for use by CLI commands
- Requires host.ready to resolve before returning (boot complete)
- Optional logger parameter for startup messages
- Error propagation: host.ready rejections bubble to caller

---
*Task completed via TDD (test-first)*
