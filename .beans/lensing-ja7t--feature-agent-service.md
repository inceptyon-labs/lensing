---
# lensing-ja7t
title: 'Feature: Agent Service'
status: completed
type: feature
priority: normal
tags:
    - pasiv
    - priority:medium
    - area:backend
created_at: 2026-02-16T21:21:43Z
updated_at: 2026-02-19T19:36:14Z
parent: lensing-5abn
---

Remote agent orchestration service with tool calling and data bus integration.

## Goals

- Orchestration service with LLM tool calling
- Morning Brief generation from data bus (weather + calendar + news + crypto + sports)
- Cross-plugin reasoning (e.g., pollen high + outdoor event → alert)
- Agent-driven scene changes and notification routing
- Audit log of all agent actions and tool calls

## Scope

**In Scope:** Orchestration, Morning Brief, cross-plugin alerts, scene control, audit log
**Out of Scope:** Voice transcription, HA automation triggers



## Completed

Implemented full agent orchestration service with LLM integration, tool calling, Morning Brief generation, cross-plugin reasoning, and comprehensive audit logging.

Merged at d4cc1e8.
