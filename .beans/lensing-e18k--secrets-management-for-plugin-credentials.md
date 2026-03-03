---
# lensing-e18k
title: Secrets management for plugin credentials
status: todo
type: feature
priority: high
created_at: 2026-03-03T13:15:07Z
updated_at: 2026-03-03T13:15:07Z
blocked_by:
    - lensing-gjrv
---

API keys and auth tokens in connector.json are stored as plaintext JSON on disk.
Need a proper secrets management system so credentials aren't exposed.

## Requirements

- [ ] Store plugin credentials in database, not in connector.json on disk
- [ ] Implement placeholder resolution (e.g. {{secret:API_KEY}}) in connector config
- [ ] Use the existing manifest permissions.secrets field for declaring needed secrets
- [ ] Encrypt secrets at rest in the database
- [ ] Redact secrets on REST API responses (like built-in module password fields already do)
- [ ] Admin UI for managing plugin secrets (per-plugin key/value entry)
- [ ] Connector runtime resolves secret placeholders before making API calls
- [ ] connector.json on disk never contains raw credentials
- [ ] Tests for secret storage, resolution, and redaction

## Key Files
- packages/types/src/plugin.ts — PluginManifest.permissions.secrets already exists
- packages/core/src/connector-runner.ts — needs secret resolution before fetch
- packages/core/src/rest-server.ts — already redacts password fields for built-ins
- packages/core/src/plugin-admin-handlers.ts — admin CRUD for secrets
- apps/display/src/lib/AdminBuilderView.svelte — builder UI for declaring secrets
