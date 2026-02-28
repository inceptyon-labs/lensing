---
# lensing-ht6n
title: Widget + Integration Model (Framerr-style)
status: completed
type: epic
priority: high
tags:
  - area:frontend
  - area:backend
created_at: 2026-02-26T02:22:34Z
updated_at: 2026-02-26T13:50:06Z
---

Replace the enabled/disabled module toggle with a two-tier model: (1) Integrations — central service connections and API keys, set up once in Settings; (2) Widget Config — per-instance display preferences, configured via gear icon on the grid. Widgets on the grid = running, off the grid = stopped. Supports multiple instances of the same widget type. See docs/designs/widget-integration-model.md
