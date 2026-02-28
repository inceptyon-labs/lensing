---
# lensing-lla8
title: Implement marketplace plugin download and install
status: todo
type: task
priority: high
created_at: 2026-02-28T15:46:43Z
updated_at: 2026-02-28T15:46:43Z
parent: lensing-7nct
---

Download plugin ZIP from marketplace and install via existing plugin install flow.

## Acceptance Criteria

- [ ] POST /marketplace/:id/install triggers download from download_url
- [ ] Downloads ZIP to temp directory, validates size (<10MB)
- [ ] Passes ZIP to existing installPluginFromZip() function
- [ ] Returns installed plugin details on success
- [ ] Handles download failures with clear error messages
- [ ] Conflict detection: warns if plugin ID already installed (offers replace)

---

**Size:** S
**Area:** backend
