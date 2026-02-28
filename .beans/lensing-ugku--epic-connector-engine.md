---
# lensing-ugku
title: 'Epic: Connector Engine'
status: todo
type: epic
priority: high
created_at: 2026-02-28T15:43:53Z
updated_at: 2026-02-28T15:43:53Z
---

The data fetching foundation that powers builder-created plugins. Implements connector types (JSON API, RSS, static) that let users define data sources without writing server-side code.

## Vision

Provide a simple, secure, template-based system for fetching and mapping external data into plugin widgets. Connectors are the bridge between "where data lives" and "what the widget displays."

## Features

- ConnectorConfig types and schema validation
- JSON API connector (fetch + JSONPath field mapping)
- RSS/Atom feed connector
- Static content connector (no fetching)
- SSRF protection (URL blocklist)
- Integration with existing plugin scheduler

## Success Criteria

- [ ] ConnectorConfig type defined in @lensing/types
- [ ] JSON API connector fetches data and maps fields via JSONPath
- [ ] RSS connector parses feeds and maps standard fields
- [ ] Static connector passes through content without fetching
- [ ] URL blocklist prevents SSRF (localhost, private IPs)
- [ ] Connectors integrate with plugin scheduler for periodic refresh
