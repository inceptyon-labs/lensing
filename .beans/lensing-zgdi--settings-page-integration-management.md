---
# lensing-zgdi
title: Settings page integration management
status: in-progress
type: feature
priority: normal
tags:
  - area:frontend
created_at: 2026-02-26T02:30:07Z
updated_at: 2026-02-26T13:30:04Z
parent: lensing-ht6n
---

Redesign admin/settings page to show only integration-category fields per module. API keys, server URLs, credentials — set up once centrally.

## Acceptance Criteria

- [ ] Settings page shows integration fields grouped by module
- [ ] Only modules that HAVE integration fields are shown
- [ ] Save triggers module restart if integration was updated
- [ ] Password fields redacted as before
