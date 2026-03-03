---
# lensing-mtn6
title: Validate GitHub owner/repo path segments
status: completed
type: task
priority: normal
created_at: 2026-03-02T16:49:59Z
updated_at: 2026-03-03T00:06:50Z
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

## Summary of Changes

Implemented path traversal validation in two modules:

- **publisher.ts**: Added GITHUB_SEGMENT_RE validation for marketplaceRepoUrl owner/repo segments (lines 45-48)
- **marketplace-client.ts**: Added format validation and segment checking for marketplaceRepo option (lines 27-31)

Both modules now validate that owner/repo segments match `/^[a-zA-Z0-9][a-zA-Z0-9_.-]*$/`, which:

- Requires alphanumeric first character (prevents `..\..` traversal)
- Allows alphanumeric, underscores, hyphens, dots in remaining positions
- Rejects encoded characters and path separators

Added 6 new tests (3 per module) covering path traversal attacks, encoded chars, and valid names.
All 1123 tests passing. Merged to main at 657c098.
