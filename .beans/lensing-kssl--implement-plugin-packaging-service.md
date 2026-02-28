---
# lensing-kssl
title: Implement plugin packaging service
status: todo
type: task
priority: high
created_at: 2026-02-28T15:46:21Z
updated_at: 2026-02-28T15:46:21Z
parent: lensing-rq0o
---

Package builder output into a standard plugin directory structure that the existing PluginLoader can load.

## Acceptance Criteria

- [ ] Generates plugin.json manifest from wizard metadata + connector permissions
- [ ] Writes template.html and template.css from GrapesJS output
- [ ] Writes connector.json from wizard data source config
- [ ] Creates plugin directory in pluginsDir/<plugin-id>/
- [ ] Generated manifest includes correct permissions (allowed_domains from connector URL)
- [ ] POST /builder/save endpoint accepts all builder state and packages it

---

**Size:** M
**Area:** backend
