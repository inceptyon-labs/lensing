import type { JsonApiConnectorConfig } from '@lensing/types';
import type { ConnectorFetchFn } from './connector-proxy';
/**
 * Runtime connector interface for fetching and mapping JSON API data.
 */
export interface JsonApiConnector {
    /** Fetch data from the configured URL and return mapped slot values */
    fetch(): Promise<Record<string, unknown>>;
    /** Get the last cached successful response */
    getCachedResponse(): Record<string, unknown> | undefined;
    /** Clear the cached response */
    clearCache(): void;
}
/**
 * Options for creating a JSON API connector
 */
export interface JsonApiConnectorOptions {
    /** Custom fetch function (default: global fetch) */
    fetchFn?: ConnectorFetchFn;
    /** Request timeout in milliseconds (default: 10000) */
    timeoutMs?: number;
    /** Allow private IP addresses, e.g. for home-lab setups (default: false) */
    allowPrivate?: boolean;
    /** Async function to resolve {{SECRET_NAME}} placeholders */
    secretResolver?: (name: string) => Promise<string>;
}
/**
 * Create a JSON API connector that fetches data from a URL, extracts fields via
 * JSONPath expressions, and caches the last successful response for stale fallback.
 */
export declare function createJsonApiConnector(config: JsonApiConnectorConfig, options?: JsonApiConnectorOptions): JsonApiConnector;
//# sourceMappingURL=json-api-connector.d.ts.map