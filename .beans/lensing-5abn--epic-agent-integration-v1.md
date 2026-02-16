---
# lensing-5abn
title: 'Epic: Agent Integration v1'
status: todo
type: epic
priority: normal
tags:
  - pasiv
  - priority:medium
created_at: 2026-02-16T21:19:35Z
updated_at: 2026-02-16T21:19:35Z
---

AI agent system: gateway on Pi, orchestration service remote, morning brief generation, Ask Lensing, and agent-driven scene/alert control.

## Vision

An AI agent that reasons across plugin data — generating summaries, proactive alerts, and contextual scene changes. Heavy AI work runs off-device; the Pi is just a lightweight gateway.

## Features

- Agent Gateway (Pi-side client)
- Agent Service (remote orchestration)
- Ask Lensing (question/answer from admin UI)

## Success Criteria

- [ ] Agent Gateway connects to remote Agent Service
- [ ] Morning Brief generated from data bus (weather + calendar + news + crypto)
- [ ] "Ask" flow works from admin UI to display
- [ ] Agent triggers scene changes and cross-plugin alerts
- [ ] Audit log records agent actions
