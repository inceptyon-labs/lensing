---
# lensing-mb8p
title: 'Feature: Builder Wizard'
status: todo
type: feature
priority: high
created_at: 2026-02-28T15:44:23Z
updated_at: 2026-02-28T15:48:00Z
parent: lensing-jwka
blocked_by:
    - lensing-r333
---

The step-by-step wizard that guides users through plugin creation: metadata → data source → design → preview. Handles the non-visual parts of the builder flow.

## Goals
- Multi-step wizard shell with step navigation and validation
- Metadata step: name, description, category, icon picker
- Data source step: connector type picker, URL/auth/headers config
- Connector test endpoint (proxy fetch + sample data return)
- Field mapping UI (map API response fields to named template slots)

## Scope
**In Scope:** Wizard navigation, metadata form, connector config form, test fetch, field mapping
**Out of Scope:** GrapesJS editor (separate feature), preview rendering (separate feature)
