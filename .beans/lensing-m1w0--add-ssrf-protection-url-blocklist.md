---
# lensing-m1w0
title: Add SSRF protection URL blocklist
status: todo
type: task
priority: high
created_at: 2026-02-28T15:45:17Z
updated_at: 2026-02-28T15:45:17Z
parent: lensing-r333
---

Validate connector URLs against a blocklist to prevent SSRF attacks.

## Acceptance Criteria

- [ ] Block localhost, 127.0.0.1, ::1, 0.0.0.0
- [ ] Block private IP ranges (10.x, 172.16-31.x, 192.168.x) by default
- [ ] Block link-local (169.254.x)
- [ ] Configurable override in settings to allow private IPs (for home-lab use cases)
- [ ] Validate URL before every connector fetch
- [ ] Clear error messages when URL is blocked

---

**Size:** S
**Area:** backend
