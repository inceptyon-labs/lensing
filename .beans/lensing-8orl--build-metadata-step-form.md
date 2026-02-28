---
# lensing-8orl
title: Build metadata step form
status: todo
type: task
priority: normal
created_at: 2026-02-28T15:45:33Z
updated_at: 2026-02-28T15:45:33Z
parent: lensing-mb8p
---

Build the first wizard step: plugin metadata entry (name, description, category, icon).

## Acceptance Criteria
- [ ] Text input for plugin name (required, validated for uniqueness against local plugins)
- [ ] Textarea for description (required)
- [ ] Category dropdown (finance, weather, news, sports, media, home, utility, other)
- [ ] Icon picker (curated set of icons appropriate for display widgets)
- [ ] Auto-generates plugin ID from name (slugified, e.g. "My Widget" → "my-widget")
- [ ] Validation: name required, ID unique

---
**Size:** S
**Area:** frontend
