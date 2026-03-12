/**
 * Create a static connector that returns user-defined data without fetching.
 * Useful for widgets displaying fixed content (welcome messages, labels, etc.)
 */
export function createStaticConnector(config) {
    async function fetch() {
        return config.data;
    }
    function getCachedResponse() {
        return config.data;
    }
    function clearCache() {
        // No-op: static data is always available
    }
    return { fetch, getCachedResponse, clearCache };
}
//# sourceMappingURL=static-connector.js.map