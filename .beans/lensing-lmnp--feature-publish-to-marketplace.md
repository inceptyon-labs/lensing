---
# lensing-lmnp
title: 'Feature: Publish to Marketplace'
status: in-progress
type: feature
priority: high
created_at: 2026-02-28T15:44:42Z
updated_at: 2026-03-01T00:40:56Z
parent: lensing-023a
blocked_by:
  - lensing-rq0o
---

Publish plugins from the device to the GitHub-based marketplace. Creates a PR with the plugin ZIP, thumbnail, and updated index.json.

## Goals

- GitHub token configuration in admin Settings (encrypted storage)
- Plugin packaging as ZIP with manifest + template + connector + thumbnail
- GitHub API integration: fork detection, branch creation, commit, PR creation
- Publish UI: button, progress, status ("awaiting review"), PR link
- Validation: ID uniqueness check, content limits, ZIP structure validation

## Scope

**In Scope:** Token config, ZIP packaging, GitHub PR creation, publish UI, validation
**Out of Scope:** Auto-merge, author verification, paid plugins
