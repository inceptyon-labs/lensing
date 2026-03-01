# Session Handoff: Define ConnectorConfig types and schema

Date: 2026-03-01
Issue: lensing-tfec - Define ConnectorConfig types and schema
Parent Feature: lensing-r333 - Feature: Connector Types & Runtime

## What Was Done

- Completed lensing-tfec: ConnectorConfig discriminated union types with JSON API, RSS, and static variants
- Implemented `isValidConnectorConfig()` validation function with URL format checking
- Added 20 comprehensive tests covering all union variants, optional fields, edge cases
- All tests passing (1,602/1,602), build clean, types compile

## Files Changed

- packages/types/src/index.ts (107 lines added) — ConnectorConfig, JsonApiConnectorConfig, RssConnectorConfig, StaticConnectorConfig, ConnectorMapping interfaces + isValidConnectorConfig() + isValidHttpUrl() helper
- packages/types/src/**tests**/connector-config.test.ts (362 lines, new) — 20 tests for all union variants

## API Surface Created

```ts
export interface ConnectorMapping {
  [fieldName: string]: string; // JSONPath or CSS selector
}

export interface JsonApiConnectorConfig {
  type: 'json-api';
  url: string; // http/https enforced
  method: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
  headers?: Record<string, string>;
  refresh_ms: number; // milliseconds, > 0
  mapping: ConnectorMapping;
}

export interface RssConnectorConfig {
  type: 'rss';
  url: string; // http/https enforced
  refresh_ms: number; // milliseconds, > 0
  mapping: ConnectorMapping;
}

export interface StaticConnectorConfig {
  type: 'static';
  data: Record<string, unknown>; // Passthrough data
}

export type ConnectorConfig = JsonApiConnectorConfig | RssConnectorConfig | StaticConnectorConfig;

export function isValidConnectorConfig(value: unknown): value is ConnectorConfig {
  // Validates type, required fields, URL format, HTTP methods, refresh interval
}
```

## Key Decisions

- ConnectorConfig as **discriminated union** with string literal `type` field (TypeScript idiom)
- URL validation via `new URL()` constructor — only accepts http/https (blocks file://, gopher://, etc.)
- `refresh_ms > 0` required (prevents infinite loops)
- HTTP methods restricted to explicit set: GET, POST, PUT, DELETE, PATCH
- Headers field optional, but if present must be Record<string, string>
- Mapping field is just Record<string, string> (JSONPath/CSS selectors are opaque strings — validation deferred to runtime)
- Static connector accepts any Record<string, unknown> (passthrough, no fetching)
- SSRF protection at URL format layer only; domain-level blocklist applied by calling code (lensing-m1w0 already complete)

## Next Steps (ordered, under parent lensing-r333)

1. **lensing-3x4w**: Implement JSON API connector (uses ConnectorConfig types, performs JSONPath extraction)
2. **lensing-4jsy**: Implement RSS/Atom feed connector (uses ConnectorConfig types, parses feeds)
3. **lensing-vd29**: Implement static content connector (uses ConnectorConfig types, passthrough)
4. **lensing-odrh**: Integrate connectors with plugin scheduler

## Files to Load Next Session

- packages/types/src/index.ts (ConnectorConfig types and validation function)
- packages/types/src/**tests**/connector-config.test.ts (reference tests for validation)
- .beans/lensing-r333\*.md (parent feature)

## Notes for Implementation

- All connector implementations should use `isValidConnectorConfig()` to validate input
- Connector factory functions (like previous marketplace-client) are the recommended pattern
- JSON API connector will need to handle JSONPath parsing — consider using a library or simple dot-path support initially
- RSS connector needs XML/HTML parsing — library (like xml2js or html-parser) recommended
- Static connector is the simplest (just expose data as-is)
- Scheduler integration happens after all three connectors exist
