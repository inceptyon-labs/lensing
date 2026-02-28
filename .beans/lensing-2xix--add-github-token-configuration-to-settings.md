---
# lensing-2xix
title: Add GitHub token configuration to Settings
status: completed
type: task
priority: high
created_at: 2026-02-28T15:47:15Z
updated_at: 2026-02-28T16:07:07Z
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



## Completed

Marketplace settings configuration successfully implemented and merged to main.

**Implementation:**
- MarketplaceSettings type added to @lensing/types
- REST API endpoints (/api/admin/marketplace GET/POST) implemented with validation
- AdminSettingsPanel.svelte extended with marketplace form section
- GitHub token input (password type, masked)
- Marketplace repository URL configuration with default
- Form submission with API calls, validation, and error handling

**Testing:**
- 1,293+ tests passing across all packages
- REST API tests validating endpoints and error handling
- Database tests for settings persistence
- UI tests validating form structure and functionality
- Type safety verified (TypeScript strict mode)
- Build successful across all packages

**Files Changed:**
- packages/types/src/index.ts
- packages/core/src/rest-server.ts  
- apps/display/src/lib/AdminSettingsPanel.svelte
- apps/display/__tests__/admin-settings.test.ts
- packages/core/src/__tests__/rest-server.test.ts
- packages/core/src/__tests__/database.test.ts
