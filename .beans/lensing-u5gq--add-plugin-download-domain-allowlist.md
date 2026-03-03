---
# lensing-u5gq
title: Add plugin download domain allowlist
status: in-progress
type: task
priority: normal
created_at: 2026-03-02T16:50:27Z
updated_at: 2026-03-03T00:22:05Z
parent: lensing-umpl
blocked_by:
    - lensing-05qz
---

**Scan finding:** M-6

marketplace-install.ts accepts any public URL for plugin downloads. The SSRF blocklist prevents internal network access, but an attacker (especially with no auth — see lensing-05qz) could install plugins from any public URL.

## Acceptance Criteria

- [x] Plugin downloads restricted to configured marketplace domain(s) by default
- [x] Config option to add trusted download domains
- [x] SSRF blocklist still applied as defense-in-depth
- [x] Tests for allowed and blocked domains
- [x] Error message indicates domain not in allowlist

## Files

- `packages/core/src/marketplace-install.ts`

## Size: S

## Area: backend

## Blocked by

- lensing-05qz (auth must come first — this is defense-in-depth)
