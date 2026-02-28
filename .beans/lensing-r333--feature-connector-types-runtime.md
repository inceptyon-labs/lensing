---
# lensing-r333
title: 'Feature: Connector Types & Runtime'
status: in-progress
type: feature
priority: high
created_at: 2026-02-28T15:44:19Z
updated_at: 2026-02-28T18:05:00Z
parent: lensing-ugku
---

Implement the three connector types that power builder-created plugins: JSON API, RSS, and static. Each connector fetches data from an external source and maps response fields to named slots that templates consume.

## Goals

- Define ConnectorConfig types and validation in @lensing/types
- Implement JSON API connector with JSONPath field mapping
- Implement RSS/Atom connector with standard field mapping
- Implement static connector (passthrough, no fetching)
- SSRF protection via URL blocklist
- Integrate connectors with the existing plugin scheduler

## Scope

**In Scope:** Connector types, fetch logic, field mapping, URL validation, scheduler integration
**Out of Scope:** Visual data pipelines, multiple connectors per widget, connector chaining
