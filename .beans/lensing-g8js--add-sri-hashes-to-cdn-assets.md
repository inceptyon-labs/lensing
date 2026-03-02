---
# lensing-g8js
title: Add SRI hashes to CDN assets
status: in-progress
type: task
priority: normal
created_at: 2026-03-02T16:49:36Z
updated_at: 2026-03-02T23:31:18Z
parent: lensing-umpl
---

**Scan finding:** M-1

GridStack CSS and JS loaded from jsDelivr CDN without `integrity` and `crossorigin` attributes. If the CDN were compromised, malicious code would execute in the application context.

## Acceptance Criteria

- [x] GridStack CSS link has `integrity` and `crossorigin="anonymous"` attributes
- [x] GridStack JS script has `integrity` and `crossorigin="anonymous"` attributes
- [x] SRI hashes verified against current CDN content — computed fresh via curl + openssl

## Files

- `apps/display/src/app.html:10-12`

## Size: XS

## Area: frontend
