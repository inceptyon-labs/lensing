---
# lensing-tw6o
title: 'ESLint: browser globals for .svelte files'
status: completed
type: task
priority: normal
created_at: 2026-10-05T02:25:17Z
updated_at: 2026-10-05T02:25:24Z
---

Svelte files had no browser globals, so every fetch/setInterval/HTMLElement was a no-undef error and code carried // eslint-disable-next-line no-undef workarounds.

- [x] Add globals.browser to the .svelte config block
- [x] Remove the now-unused no-undef disable comments

## Summary of Changes

Added globals.browser to the .svelte block in eslint.config.js and removed 41 unused no-undef disable comments from 14 components. Repo-wide lint problems 2424 -> 2323; .svelte source 143 -> 43, no rule increased.
