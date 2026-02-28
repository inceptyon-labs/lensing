---
# lensing-t8fv
title: Create marketplace client with index fetch and cache
status: todo
type: task
priority: high
created_at: 2026-02-28T15:46:35Z
updated_at: 2026-02-28T15:46:35Z
parent: lensing-7nct
---

Core service that fetches and caches the marketplace index.json from GitHub.

## Acceptance Criteria

- [ ] Fetches index.json from raw.githubusercontent.com/<org>/<repo>/main/index.json
- [ ] Caches locally on disk (pluginsDir/.marketplace-cache/index.json)
- [ ] 15-minute refresh interval (configurable)
- [ ] Returns cached data if GitHub is unreachable
- [ ] Validates index.json schema (version field, plugins array)
- [ ] Falls back to last known good cache if fetch returns malformed data
- [ ] Marketplace repo URL configurable in settings

---

**Size:** M
**Area:** backend
