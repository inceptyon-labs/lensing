---
# lensing-mtn6
title: Validate GitHub owner/repo path segments
status: in-progress
type: task
priority: normal
created_at: 2026-03-02T16:49:59Z
updated_at: 2026-03-03T00:06:05Z
parent: lensing-umpl
---

**Scan finding:** MH-4

publisher.ts and marketplace-client.ts construct GitHub API URLs from user-provided strings without validating that owner/repo segments are alphanumeric.

## Acceptance Criteria

- [x] publisher.ts validates owner and repo match `/^[a-zA-Z0-9_.-]+$/` before URL construction
- [x] marketplace-client.ts validates marketplaceRepo format
- [x] Tests for valid and invalid inputs
- [x] Error thrown for malformed values

## Files

- `packages/core/src/publisher.ts:42-45`
- `packages/core/src/marketplace-client.ts:28`

## Size: XS

## Area: backend
