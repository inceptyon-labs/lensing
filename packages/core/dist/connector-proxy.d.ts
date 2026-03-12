/** Injectable fetch function for testability */
export type ConnectorFetchFn = (url: string, options?: {
    method?: string;
    headers?: Record<string, string>;
    signal?: AbortSignal;
}) => Promise<{
    ok: boolean;
    status: number;
    statusText: string;
    json: () => Promise<unknown>;
    text: () => Promise<string>;
    arrayBuffer?: () => Promise<ArrayBuffer>;
}>;
/** Input config for testing a connector */
export interface ConnectorTestConfig {
    type: 'json_api' | 'rss_feed' | string;
    url: string;
    method?: string;
    headers?: Record<string, string>;
}
/** Result returned from testConnector */
export interface ConnectorTestResult {
    success: boolean;
    sample?: unknown;
    fields?: string[];
    error?: string;
}
/** Options for testConnector */
export interface ConnectorTestOptions {
    fetchFn?: ConnectorFetchFn;
    timeoutMs?: number;
    allowPrivate?: boolean;
}
/**
 * Test a connector config by making a real fetch and returning sample data.
 * Validates the URL against the SSRF blocklist before fetching.
 */
export declare function testConnector(config: ConnectorTestConfig, options?: ConnectorTestOptions): Promise<ConnectorTestResult>;
//# sourceMappingURL=connector-proxy.d.ts.map