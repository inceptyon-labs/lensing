---
# lensing-ojgc
title: 'Feature: CI/CD Pipeline'
status: todo
type: feature
priority: normal
tags:
    - pasiv
    - priority:medium
    - area:infra
created_at: 2026-02-16T21:22:14Z
updated_at: 2026-02-16T21:22:14Z
parent: lensing-46q9
---

CI pipeline for manifest validation, type checking, testing, and releases.

## Goals
- GitHub Actions CI: type checks, tests, manifest validation
- Semantic versioning with automated changelog
- SDK compatibility checks (plugin version ↔ SDK version)
- Release pipeline for npm packages

## Scope
**In Scope:** CI config, semver, compatibility checks, npm publish
**Out of Scope:** CD to Pi (manual deployment)
