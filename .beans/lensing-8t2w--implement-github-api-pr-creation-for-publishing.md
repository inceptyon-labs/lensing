---
# lensing-8t2w
title: Implement GitHub API PR creation for publishing
status: in-progress
type: task
priority: high
created_at: 2026-02-28T15:47:24Z
updated_at: 2026-03-01T02:35:37Z
parent: lensing-lmnp
---

Create a PR on the marketplace GitHub repo containing the plugin ZIP, thumbnail, and updated index.json.

## Acceptance Criteria

- [ ] Fork marketplace repo if not already forked (or use direct push if owner)
- [ ] Create branch: plugin/<plugin-id>-<version>
- [ ] Commit: add plugins/<id>/<id>-<version>.zip and plugins/<id>/thumbnail.png
- [ ] Commit: update index.json with new plugin entry (or update existing version)
- [ ] Create PR with descriptive title and body (plugin name, description, version)
- [ ] Return PR URL to caller
- [ ] Handle errors: auth failure, rate limit, conflict (ID exists)

---

**Size:** M
**Area:** backend
