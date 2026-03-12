/**
 * SSRF protection URL blocklist.
 * Blocks requests to localhost, private IP ranges, link-local addresses,
 * and cloud metadata endpoints.
 */
/** Options for URL blocklist checking */
export interface BlocklistOptions {
    /**
     * Allow private IP ranges (10.x, 172.16-31.x, 192.168.x) — for home-lab use cases.
     * Loopback, link-local, and metadata endpoints are always blocked regardless.
     */
    allowPrivate?: boolean;
}
/**
 * Returns the reason a URL is blocked, or null if the URL is allowed.
 */
export declare function getBlockReason(urlString: string, options?: BlocklistOptions): string | null;
/**
 * Returns true if the URL should be blocked to prevent SSRF attacks.
 *
 * @param urlString - The URL to check
 * @param options - Optional override settings (e.g. allowPrivate for home-lab)
 */
export declare function isBlockedUrl(urlString: string, options?: BlocklistOptions): boolean;
//# sourceMappingURL=url-blocklist.d.ts.map