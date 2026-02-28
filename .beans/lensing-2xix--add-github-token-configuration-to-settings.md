---
# lensing-2xix
title: Add GitHub token configuration to Settings
status: in-progress
type: task
priority: high
created_at: 2026-02-28T15:47:15Z
updated_at: 2026-02-28T15:55:43Z
parent: lensing-lmnp
---

GitHub personal access token configuration in admin Settings tab for marketplace publishing.

## Acceptance Criteria
- [ ] New "Marketplace" section in Settings tab
- [ ] GitHub token input field (password type, redacted display)
- [ ] Token stored encrypted in database
- [ ] Token validated on save (test GitHub API call)
- [ ] Marketplace repo URL configuration (default: lensing-marketplace)
- [ ] Clear instructions: "Create a token at github.com/settings/tokens with public_repo scope"

---
**Size:** S
**Area:** frontend, backend
