---
# lensing-1zar
title: Add REST endpoints for marketplace browse/search
status: todo
type: task
priority: high
created_at: 2026-02-28T15:46:39Z
updated_at: 2026-02-28T15:46:39Z
parent: lensing-7nct
---

REST API endpoints that expose marketplace data to the admin UI.

## Acceptance Criteria

- [ ] GET /marketplace — list all plugins (supports ?category, ?search, ?page query params)
- [ ] GET /marketplace/:id — single plugin detail
- [ ] GET /marketplace/categories — list available categories with counts
- [ ] Search filters by name, description, tags (case-insensitive substring)
- [ ] Response includes "installed" and "update_available" flags per plugin
- [ ] Returns offline banner flag when serving from cache

---

**Size:** M
**Area:** backend
