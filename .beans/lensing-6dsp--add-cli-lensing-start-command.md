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
updated_at: 2026-02-24T14:36:39Z
parent: lensing-is1m
---

Add a start command to the CLI that boots the host service.

## What to build

- packages/cli/src/start.ts — imports createHostService, reads config, starts
- Default port: 3100
- Default pluginsDir: ./plugins
- Default dbPath: ./data/lensing.db
- Log startup info and listening address
