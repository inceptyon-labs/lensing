---
# lensing-lla8
title: Implement marketplace plugin download and install
status: completed
type: task
priority: high
created_at: 2026-02-28T15:46:43Z
updated_at: 2026-03-01T03:09:50Z
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

## Summary of Changes

**Files created:**
- packages/core/src/marketplace-install.ts (119 lines) - Core download and install logic
- packages/core/src/__tests__/marketplace-install.test.ts (232 lines) - Comprehensive test suite

**Files modified:**
- packages/core/src/connector-proxy.ts - Added arrayBuffer() to ConnectorFetchFn type
- packages/core/src/rest-server.ts - Added POST /marketplace/:id/install endpoint
- packages/core/src/index.ts - Added exports for marketplace install module

**Key implementation details:**
- SSRF protection via getBlockReason() before any network activity
- AbortController timeout management (default 30s)
- Download size validation (default 10MB limit)
- ZIP conflict detection with optional replace support
- Proper HTTP error handling and status code classification
- REST endpoint follows project patterns with 201 Created response

**Test coverage:** 11 comprehensive tests covering:
- Successful install and fetch validation
- Size validation (default and custom limits)
- Download error handling (HTTP, network, timeout)
- Conflict detection and replacement
- SSRF protection (localhost and private IPs)

**Merged:** 60736c4 to main
