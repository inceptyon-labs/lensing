import type { RssConnectorConfig } from '@lensing/types';
import type { ConnectorFetchFn } from './connector-proxy';
/**
 * Runtime connector interface for fetching and parsing RSS/Atom feeds.
 */
export interface RssConnector {
    /** Fetch and parse the configured feed, returning mapped items */
    fetch(): Promise<{
        items: Array<Record<string, unknown>>;
    }>;
    /** Get the last cached successful response */
    getCachedResponse(): Promise<{
        items: Array<Record<string, unknown>>;
    } | undefined>;
    /** Clear the cached response */
    clearCache(): void;
}
/**
 * Options for creating an RSS connector
 */
export interface RssConnectorOptions {
    /** Custom fetch function (default: global fetch) */
    fetchFn?: ConnectorFetchFn;
    /** Request timeout in milliseconds (default: 10000) */
    timeoutMs?: number;
    /** Allow private IP addresses, e.g. for home-lab setups (default: false) */
    allowPrivate?: boolean;
}
/**
 * Create an RSS/Atom feed connector that fetches feeds and maps fields to named slots
 */
export declare function createRssConnector(config: RssConnectorConfig, options?: RssConnectorOptions): RssConnector;
//# sourceMappingURL=rss-connector.d.ts.map