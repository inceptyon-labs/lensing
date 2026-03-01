---
# lensing-8t2w
title: Implement GitHub API PR creation for publishing
status: completed
type: task
priority: high
created_at: 2026-02-28T15:47:24Z
updated_at: 2026-03-01T02:44:39Z
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

## Completion Summary

**Implemented:**
- createPublisherPr(config: PublisherConfig): Promise<PublisherResult> function
- GitHub API integration: authenticates, creates branch, commits files, updates index.json, creates PR
- Error handling: 401 (auth), 403 (rate limit), 422 (conflict)
- Branch naming: plugin/<pluginId>-<version>
- File structure: plugins/<id>/<id>-<version>.zip, plugins/<id>/thumbnail.png, index.json
- PR metadata: descriptive title and body with plugin details

**Tests:**
- 11 comprehensive tests (all passing)
- Covers happy path, file paths, error scenarios, validation
- Proper mock setup with request body verification

**Code Quality:**
- TypeScript types for config and result
- Clean API with helper function for error handling
- Minimal, focused implementation (no overengineering)
- Exported from @lensing/core

**Merged:** e5d5fba to main
**Verification:** ✓ Tests (910), Build, TypeScript all passing
