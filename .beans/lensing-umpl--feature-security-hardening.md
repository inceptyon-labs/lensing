---
# lensing-umpl
title: 'Feature: Security Hardening'
status: completed
type: feature
priority: high
created_at: 2026-03-02T16:49:03Z
updated_at: 2026-03-03T00:52:01Z
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



## Epic Complete

All 9 security hardening tasks completed and merged to main:

✓ lensing-05qz: Authentication to REST server and WebSocket
✓ lensing-l1nv: Eliminate shell injection in display-control  
✓ lensing-xmpl: Move API keys from query strings to request headers
✓ lensing-uvbq: Update dependencies with known CVEs
✓ lensing-mtn6: Validate GitHub owner/repo path segments
✓ lensing-g8js: Add SRI hashes to CDN assets
✓ lensing-u5gq: Add plugin download domain allowlist
✓ lensing-11cs: Add timeout to CalDAV requests
✓ lensing-gbv2: Validate postMessage event.source on IframeWidget

Final commit: 58dfda6
