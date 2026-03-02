---
# lensing-umpl
title: 'Feature: Security Hardening'
status: in-progress
type: feature
priority: high
created_at: 2026-03-02T16:49:03Z
updated_at: 2026-03-02T16:51:46Z
---

Security hardening based on repo scan findings from 2026-03-02.

Full report: `docs/scans/2026-03-02-lensing.md`

## Acceptance Criteria

- [ ] REST/WS server authenticated and bound to 127.0.0.1 by default
- [ ] API keys moved from query strings to headers
- [ ] Shell injection eliminated in display-control
- [ ] CDN assets have SRI hashes
- [ ] postMessage listener validates event.source
- [ ] GitHub URL path segments validated
- [ ] CalDAV requests have timeout
- [ ] Dependency CVEs addressed
- [ ] Plugin download domain allowlist added
