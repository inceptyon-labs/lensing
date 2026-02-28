# Plugin Creator & Marketplace Design

**Date:** 2026-02-28
**Status:** Validated

## Summary

A no-code plugin builder and marketplace for the lensing smart display platform. Users create widgets visually using a constrained GrapesJS editor, connect them to data sources via API connector templates, preview live, and publish to a GitHub-based marketplace — all without writing code. Other users browse, search, and one-click install plugins from the marketplace.

**The full loop:** Build → Preview → Publish (PR) → Review/Merge → Browse → Install → Display.

## Goals

- Let non-technical users create display widgets without writing code
- Provide API connector templates (JSON API, RSS, static) so users define "where data comes from" without server-side coding
- Hybrid widget rendering: start from layout templates, customize with drag-and-drop blocks
- Git-based marketplace (GitHub repo) with zero infrastructure cost
- Publish-from-device via GitHub API (creates PR for review gate)
- Seamless integration with existing plugin infrastructure (PluginLoader, permissions, scheduler, admin handlers)

## Non-Goals (Out of Scope for v1)

- Plugin ratings/reviews — marketplace is browse + install only, no social features
- Author profiles — plugins show author name but no profile pages
- Auto-merge for trusted authors — all PRs require manual merge initially
- Visual data pipeline / Node-RED style — connector templates only, no chaining
- Custom JavaScript in builder — v1 is HTML/CSS + data binding only
- Plugin analytics — no install counts, usage tracking
- Plugin dependency enforcement — `dependencies` field exists but marketplace doesn't enforce install order
- Paid plugins — everything is free
- Plugin versioning UI — can publish updates but no version diff/rollback
- Multiple connector sources per widget — one connector per plugin
- Collaborative editing — single user edits at a time

## Architecture

Four new components layered on existing infrastructure:

```
┌─────────────────────────────────────────────────┐
│                   Admin UI                       │
│                                                  │
│  ┌─────────────┐  ┌────────────┐  ┌───────────┐ │
│  │ Plugin      │  │ Marketplace│  │ Existing  │ │
│  │ Builder     │  │ Browser    │  │ Module/   │ │
│  │ (GrapesJS)  │  │            │  │ Plugin UI │ │
│  └──────┬──────┘  └─────┬──────┘  └───────────┘ │
└─────────┼───────────────┼────────────────────────┘
          │               │
          ▼               ▼
┌─────────────────────────────────────────────────┐
│                  Core (REST API)                 │
│                                                  │
│  ┌─────────────┐  ┌────────────┐  ┌───────────┐ │
│  │ Builder     │  │ Marketplace│  │ Existing  │ │
│  │ Service     │  │ Client     │  │ Plugin    │ │
│  │ (package,   │  │ (fetch     │  │ Admin     │ │
│  │  publish)   │  │  index,    │  │ Handlers  │ │
│  │             │  │  install)  │  │           │ │
│  └──────┬──────┘  └─────┬──────┘  └───────────┘ │
└─────────┼───────────────┼────────────────────────┘
          │               │
          ▼               ▼
┌─────────────┐   ┌──────────────┐
│ GitHub API  │   │ GitHub Raw   │
│ (create PR) │   │ (index.json) │
└─────────────┘   └──────────────┘
```

### Plugin Builder (UI)

GrapesJS mounted in a Svelte wrapper component. Constrained block palette: text, image, number, list, divider, icon. Style manager for colors/fonts. API connector configuration panel alongside the canvas. Live preview pane showing the widget at actual display size.

### Builder Service (Core)

Takes GrapesJS output (HTML/CSS) + connector config + manifest metadata, packages into a plugin directory structure. Handles local save for testing and publish to GitHub via API.

### Marketplace Client (Core)

Fetches `index.json` from the GitHub registry repo (raw.githubusercontent.com), caches locally, provides search/filter/detail endpoints to the UI. Downloads and installs plugin ZIPs from GitHub releases.

### Marketplace Browser (UI)

New tab in admin interface. Grid of plugin cards with search, category filters, install buttons. Plugin detail view with description, screenshots, author, version history.

### Existing Infrastructure (unchanged)

`PluginLoader`, `plugin-admin-handlers`, `plugin-permissions`, `plugin-scheduler` all work as-is. Builder-created plugins are structurally identical to hand-crafted ones.

## Data Model

### Plugin Package (builder output)

```
my-widget/
├── plugin.json          # manifest (same schema as today)
├── template.html        # GrapesJS HTML output
├── template.css         # GrapesJS CSS output
├── connector.json       # API connector config (new)
└── thumbnail.png        # auto-generated preview screenshot
```

### connector.json (new file)

Defines the data source for a builder-created plugin:

```json
{
  "type": "json-api",
  "url": "https://api.example.com/data",
  "method": "GET",
  "headers": { "Authorization": "Bearer {{API_KEY}}" },
  "refresh_ms": 300000,
  "mapping": {
    "title": "$.data.name",
    "value": "$.data.price",
    "icon": "$.data.icon_url"
  }
}
```

**Connector types (v1):**

- `json-api` — fetch JSON, map fields via JSONPath
- `rss` — fetch RSS/Atom feed, map title/description/image/date
- `static` — no data fetching, display static content only

The `mapping` object connects API response fields to template placeholders (`{{title}}`, `{{value}}`, etc.) used in the GrapesJS HTML output.

### Marketplace Registry (index.json)

Lives in the `lensing-marketplace` GitHub repo:

```json
{
  "version": 1,
  "updated": "2026-02-28T00:00:00Z",
  "plugins": [
    {
      "id": "crypto-ticker",
      "name": "Crypto Price Ticker",
      "description": "Live cryptocurrency prices",
      "author": "jason",
      "version": "1.0.0",
      "category": "finance",
      "tags": ["crypto", "bitcoin", "price"],
      "thumbnail_url": "plugins/crypto-ticker/thumbnail.png",
      "download_url": "plugins/crypto-ticker/crypto-ticker-1.0.0.zip",
      "connector_type": "json-api",
      "created": "2026-02-28T00:00:00Z",
      "updated": "2026-02-28T00:00:00Z"
    }
  ]
}
```

### GitHub Repo Structure

```
lensing-marketplace/
├── index.json
├── plugins/
│   ├── crypto-ticker/
│   │   ├── crypto-ticker-1.0.0.zip
│   │   └── thumbnail.png
│   ├── weather-card/
│   │   ├── weather-card-1.0.0.zip
│   │   ├── weather-card-1.1.0.zip
│   │   └── thumbnail.png
```

### Categories (v1)

`finance`, `weather`, `news`, `sports`, `media`, `home`, `utility`, `other`

### No new database tables

Plugin config uses existing flat key-value store. Marketplace is entirely file-based (GitHub). Builder state is transient (GrapesJS editor state in localStorage) until save/publish.

## Key Flows

### Flow 1: Create a Plugin

1. User clicks "Create Plugin" in the Plugins tab
2. **Step 1 — Metadata:** Name, description, category, icon picker
3. **Step 2 — Data Source:** Pick connector type (JSON API / RSS / Static). Fill in URL, auth, headers. Hit "Test" to fetch sample data. Map response fields to named slots (`title`, `value`, `image`, etc.)
4. **Step 3 — Design:** GrapesJS editor at widget dimensions. Left sidebar: block palette. Right sidebar: style manager. Data slots appear as draggable "data blocks" (`{{title}}`, `{{value}}`). Pick a layout template or start blank.
5. **Step 4 — Preview:** Live preview at actual display size with real data from test fetch. Toggle between widget sizes (small/medium/large).
6. **Save locally:** Packages into plugin directory, installs via existing PluginLoader. Widget appears on display immediately for testing.

### Flow 2: Publish to Marketplace

1. User clicks "Publish" on a locally-created plugin
2. Device prompts for GitHub token (stored once in settings, encrypted)
3. Builder service auto-generates thumbnail from preview
4. Packages plugin as ZIP, creates PR to `lensing-marketplace` repo:
   - Adds ZIP + thumbnail to `plugins/<id>/`
   - Updates `index.json` with new entry
5. User sees "Published — awaiting review" with link to PR
6. After PR merge, plugin appears in marketplace

### Flow 3: Browse & Install from Marketplace

1. User opens Marketplace tab in admin UI
2. Device fetches `index.json` (cached, refreshed every 15 minutes)
3. Grid of plugin cards: thumbnail, name, author, category badge
4. Search bar filters by name/description/tags
5. Click card → detail view with description, connector type, install button
6. Click "Install" → download ZIP → `POST /plugins/install` → existing install flow
7. Plugin appears in Plugins tab for configuration

### Flow 4: Update a Plugin

1. Marketplace client compares installed versions against `index.json`
2. Newer version available → "Update" badge on plugin card
3. Click "Update" → download new ZIP → install over existing directory
4. Config is preserved (only template/connector/manifest files replaced)

## Edge Cases & Error Handling

### API Connector

- Test fetch fails → show HTTP status + response body, suggest checking URL/auth
- Runtime fetch fails → show last cached data with "stale" indicator; if no cache, show "Waiting for data..." placeholder
- Timeout: 10s default, configurable per connector

### Publishing

- No GitHub token → prompt to add one in Settings before publishing
- Token lacks permissions → "Token needs `public_repo` scope"
- PR creation fails (rate limit, network) → show error, offer retry
- Plugin ID already exists in marketplace → "ID taken, choose a different ID"

### Marketplace Availability

- GitHub unreachable → serve from local cache with "Offline — showing cached marketplace" banner
- `index.json` malformed → fall back to last known good cache
- No internet → "No connection" with option to install from ZIP manually

### Builder

- Browser closed mid-edit → GrapesJS auto-saves to localStorage, restored on reopen
- Template references unmapped data slot → preview shows `{{missing_field}}` in red, block publish
- Widget HTML exceeds 500KB → warn, suggest simplifying

### Install Conflicts

- Same ID as existing plugin → "Replace existing plugin?" with version comparison
- Unsupported connector type → reject install with clear message

### Security

- Connector URLs validated against block list (no `localhost`, `127.0.0.1`, `192.168.*` unless explicitly allowed) to prevent SSRF
- GitHub token stored encrypted in database, never exposed to UI (redacted like password fields)
- Published ZIPs content-validated: no `.exe`, no files over 5MB, total package under 10MB
- Runtime sandboxing: Shadow DOM for template-only widgets (trusted HTML/CSS + data binding), iframe sandbox for anything with custom JS

## Open Questions

- **Marketplace repo ownership:** Should this be under a `lensing-plugins` GitHub org, or the user's personal account?
- **Review process:** Who reviews/merges marketplace PRs? Single maintainer? Community reviewers?
- **GrapesJS licensing:** Core is BSD-3 (free). Studio SDK has commercial features — confirm we only need the core.

## Next Steps

- [ ] Create implementation issues with `/backlog docs/designs/2026-02-28-plugin-creator-marketplace.md`
- [ ] Or create manually with `/parent` or `/issue`
