---
# lensing-kh6c
title: Add plugin permission enforcement
status: completed
type: task
priority: high
tags:
  - pasiv
  - size:M
  - area:backend
created_at: 2026-02-16T21:23:44Z
updated_at: 2026-02-16T22:23:40Z
parent: lensing-q1cj
---

Enforce plugin permissions: allowed network domains, refresh caps, secrets access.

## Acceptance Criteria

- [ ] Network: restrict plugins to declared allowed domains
- [ ] Refresh: enforce max refresh rate per plugin
- [ ] Secrets: inject only manifest-declared secrets; no cross-plugin secret access
- [ ] Violations logged and surfaced in admin panel
- [ ] Permissions enforced at the host level (plugins can't bypass)

---

**Size:** M
