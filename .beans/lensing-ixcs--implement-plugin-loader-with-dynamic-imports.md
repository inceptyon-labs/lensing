---
# lensing-ixcs
title: Implement plugin loader with dynamic imports
status: in-progress
type: task
priority: high
tags:
    - pasiv
    - size:M
    - area:backend
created_at: 2026-02-16T21:23:41Z
updated_at: 2026-02-19T15:02:38Z
parent: lensing-q1cj
---

Dynamic plugin loader that discovers, validates, and imports plugins.

## Acceptance Criteria

- [ ] Scan /plugins/<id>/ directories for plugin.json manifests
- [ ] Validate manifest against schema before loading
- [ ] Dynamic import of UI widget components (Svelte)
- [ ] Dynamic import of server modules (Node)
- [ ] Plugin registry: track loaded plugins, their state, and config
- [ ] Graceful handling of missing or broken plugins

---

**Size:** M
