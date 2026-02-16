---
# lensing-fgdd
title: 'Feature: Monorepo & Project Scaffolding'
status: completed
type: feature
priority: high
tags:
  - pasiv
  - priority:high
  - area:infra
created_at: 2026-02-16T21:19:55Z
updated_at: 2026-02-16T22:10:12Z
parent: lensing-u2k6
---

Initialize the pnpm + Turborepo monorepo with shared packages and build tooling.

## Goals

- Single-command builds across all packages
- Shared TypeScript, ESLint, and Prettier configuration
- Package stubs for @lensing/types, @lensing/ui, @lensing/core, @lensing/cli

## Scope

**In Scope:** Monorepo structure, package stubs, build config, dev scripts
**Out of Scope:** Package implementation (handled by later features)
