import { getBlockReason } from './url-blocklist';
const DEFAULT_TIMEOUT_MS = 10_000;
/** Substitute {{NAME}} placeholders in a string using the provided per-plugin resolver. */
async function resolvePlaceholders(str, pluginId, resolver) {
    const matches = [...str.matchAll(/\{\{(\w+)\}\}/g)];
    let result = str;
    for (const match of matches) {
        const value = await resolver(pluginId, match[1]);
        result = result.replace(match[0], value);
    }
    return result;
}
/** Create a connector runner that bridges plugin connectors to the scheduler and data bus. */
export function createConnectorRunner(options) {
    const { dataBus, scheduler, fetchFn = fetch, allowPrivate = false, secretResolver, } = options;
    const registered = new Set();
    function createFetchHandler(pluginId, config) {
        return async () => {
            const isRss = config.type === 'rss_feed' || config.type === 'rss';
            // Resolve {{SECRET}} placeholders in URL and headers (JSON API only)
            let url = config.url;
            let headers = { ...(config.headers ?? {}) };
            if (secretResolver && !isRss) {
                url = await resolvePlaceholders(url, pluginId, secretResolver);
                for (const [key, value] of Object.entries(headers)) {
                    headers[key] = await resolvePlaceholders(value, pluginId, secretResolver);
                }
            }
            // SSRF protection — checked on every fetch in case URL resolves differently
            const blockReason = getBlockReason(url, { allowPrivate });
            if (blockReason) {
                throw new Error(`URL blocked: ${blockReason}`);
            }
            const controller = new AbortController();
            const timeoutId = setTimeout(() => controller.abort(), DEFAULT_TIMEOUT_MS);
            try {
                const response = await fetchFn(url, {
                    method: isRss ? 'GET' : (config.method ?? 'GET'),
                    headers: isRss ? {} : headers,
                    signal: controller.signal,
                });
                if (!response.ok) {
                    throw new Error(`HTTP ${response.status}: ${response.statusText}`);
                }
                if (isRss) {
                    const text = await response.text();
                    dataBus.publish(`plugin:${pluginId}`, pluginId, { raw: text });
                }
                else {
                    const data = await response.json();
                    dataBus.publish(`plugin:${pluginId}`, pluginId, data);
                }
            }
            finally {
                clearTimeout(timeoutId);
            }
        };
    }
    return {
        register(pluginId, manifest, config) {
            // Static connectors: publish immediately, no periodic scheduling
            if (config.type === 'static' || config.type === 'static_data') {
                dataBus.publish(`plugin:${pluginId}`, pluginId, config.data ?? {});
                return;
            }
            const handler = createFetchHandler(pluginId, config);
            const intervalMs = config.refreshInterval !== undefined ? config.refreshInterval * 1000 : undefined;
            scheduler.register(pluginId, manifest, handler, intervalMs);
            scheduler.start(pluginId);
            registered.add(pluginId);
        },
        unregister(pluginId) {
            if (!registered.has(pluginId))
                return;
            scheduler.stop(pluginId);
            scheduler.unregister(pluginId);
            registered.delete(pluginId);
        },
        close() {
            for (const id of [...registered]) {
                scheduler.stop(id);
                scheduler.unregister(id);
            }
            registered.clear();
        },
    };
}
//# sourceMappingURL=connector-runner.js.map