---
# lensing-u5gq
title: Add plugin download domain allowlist
status: todo
type: task
priority: normal
created_at: 2026-03-02T16:50:27Z
updated_at: 2026-03-02T16:50:27Z
parent: lensing-umpl
blocked_by:
  - lensing-05qz
---

**Scan finding:** M-6

marketplace-install.ts accepts any public URL for plugin downloads. The SSRF blocklist prevents internal network access, but an attacker (especially with no auth — see lensing-05qz) could install plugins from any public URL.

## Acceptance Criteria

- [ ] Plugin downloads restricted to configured marketplace domain(s) by default
- [ ] Config option to add trusted download domains
- [ ] SSRF blocklist still applied as defense-in-depth
- [ ] Tests for allowed and blocked domains
- [ ] Error message indicates domain not in allowlist

## Files

- `packages/core/src/marketplace-install.ts`

## Size: S

## Area: backend

## Blocked by

- lensing-05qz (auth must come first — this is defense-in-depth)
