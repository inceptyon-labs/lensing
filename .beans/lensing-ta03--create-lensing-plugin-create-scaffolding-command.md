---
# lensing-ta03
title: Create lensing plugin create scaffolding command
status: completed
type: task
priority: high
tags:
  - pasiv
  - size:M
  - area:infra
created_at: 2026-02-16T21:23:59Z
updated_at: 2026-02-17T02:53:43Z
parent: lensing-lncc
---

CLI command to scaffold a new plugin from template.

## Acceptance Criteria

- [ ] `lensing plugin create <name>` generates new plugin directory
- [ ] Template includes: plugin.json manifest, Svelte component stub, server module stub, test file
- [ ] Generated files have correct plugin name and ID
- [ ] Template follows all SDK conventions and best practices

---

**Size:** M

Completed and merged to main in commit 25176eb. All acceptance criteria met: plugin scaffold command generates proper directory structure with plugin.json manifest, Svelte component, server module, test file, and .gitignore.
