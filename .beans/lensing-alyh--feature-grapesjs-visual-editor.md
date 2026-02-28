---
# lensing-alyh
title: 'Feature: GrapesJS Visual Editor'
status: todo
type: feature
priority: high
created_at: 2026-02-28T15:44:28Z
updated_at: 2026-02-28T15:48:00Z
parent: lensing-jwka
blocked_by:
  - lensing-mb8p
---

The visual widget design step — GrapesJS mounted in a Svelte wrapper with a constrained block palette, layout templates, data binding, and style controls.

## Goals

- Add GrapesJS dependency and create Svelte wrapper component
- Define custom block palette (text, image, number, list, divider, icon)
- Create layout templates (single value, list, key-value grid, image + caption)
- Implement data block binding ({{placeholder}} blocks from connector field mapping)
- Configure style manager (colors, fonts, spacing)
- Set canvas to widget dimensions with small/medium/large size toggle

## Scope

**In Scope:** GrapesJS integration, custom blocks, templates, data binding, style manager
**Out of Scope:** Custom JavaScript editing, server-side rendering
