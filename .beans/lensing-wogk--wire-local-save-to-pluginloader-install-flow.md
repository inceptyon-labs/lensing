---
# lensing-wogk
title: Wire local save to PluginLoader install flow
status: todo
type: task
priority: high
created_at: 2026-02-28T15:46:25Z
updated_at: 2026-02-28T15:46:25Z
parent: lensing-rq0o
---

After packaging, trigger PluginLoader reload so the new plugin appears immediately.

## Acceptance Criteria
- [ ] After save, call PluginLoader.reload() to discover the new plugin
- [ ] Plugin appears in admin plugin list without page refresh
- [ ] Plugin can be assigned to a zone and displays on the dashboard
- [ ] Edit flow: re-open builder for existing builder-created plugins
- [ ] Overwrite flow: saving an existing plugin updates files in place

---
**Size:** S
**Area:** backend
