---
# lensing-2c24
title: Create connector test proxy endpoint
status: in-progress
type: task
priority: high
created_at: 2026-02-28T15:45:40Z
updated_at: 2026-02-28T23:05:11Z
parent: lensing-mb8p
---

REST endpoint that proxies a test fetch through the connector engine and returns sample data for the builder UI.

## Acceptance Criteria

- [ ] POST /builder/test-connector accepts ConnectorConfig body
- [ ] Executes a single connector fetch (JSON API or RSS)
- [ ] Returns sample response data and extracted field mapping preview
- [ ] Applies SSRF blocklist validation before fetching
- [ ] Returns clear error on failure (HTTP status, timeout, parse error)
- [ ] 10s timeout to prevent hanging

---

**Size:** S
**Area:** backend
