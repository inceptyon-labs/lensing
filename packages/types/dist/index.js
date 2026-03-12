export { cronTime, isCronTimeReached, getNextScheduleEntry } from './schedule-types';
export { DEFAULT_KEN_BURNS_CONFIG, DEFAULT_CYCLE_INTERVAL_MS, SUPPORTED_IMAGE_EXTENSIONS, } from './photo-slideshow';
export { DEFAULT_NEWS_MAX_ITEMS, DEFAULT_NEWS_MAX_STALE_MS } from './news';
export { DEFAULT_AI_NEWS_MAX_ITEMS, DEFAULT_AI_NEWS_MAX_STALE_MS, AI_NEWS_CATEGORIES, AI_NEWS_SCHEDULES, resolveCategoriesToFeeds, } from './ai-news';
export { DEFAULT_SPORTS_MAX_STALE_MS, DEFAULT_SPORTS_LEAGUES } from './sports';
export { CURRENT_CONFIG_VERSION } from './config-transfer';
export { DEFAULT_HA_MAX_STALE_MS, DEFAULT_HA_DOMAINS } from './home-assistant';
export { DEFAULT_PIR_IDLE_TIMEOUT_MS, DEFAULT_PIR_GPIO_PIN } from './pir-sensor';
export { MODULE_IDS, MODULE_SCHEMAS, SYSTEM_MODULE_IDS, getIntegrationFields, getWidgetFields, moduleNeedsIntegration, } from './module-settings';
/**
 * Type guard for ConnectorConfig validation
 * Ensures URL format for JSON API and RSS connectors
 */
export function isValidConnectorConfig(value) {
    if (!value || typeof value !== 'object')
        return false;
    const obj = value;
    // Must have a type field
    if (!obj.type || typeof obj.type !== 'string')
        return false;
    const type = obj.type;
    if (type === 'json-api') {
        const config = obj;
        // Check required fields
        if (typeof config.url !== 'string' || !isValidHttpUrl(config.url))
            return false;
        if (typeof config.method !== 'string' ||
            !['GET', 'POST', 'PUT', 'DELETE', 'PATCH'].includes(config.method)) {
            return false;
        }
        if (typeof config.refresh_ms !== 'number' || config.refresh_ms <= 0)
            return false;
        if (typeof config.mapping !== 'object' || config.mapping === null)
            return false;
        // Optional headers must be Record<string, string>
        if (config.headers !== undefined) {
            if (typeof config.headers !== 'object' || config.headers === null)
                return false;
            const headers = config.headers;
            if (!Object.values(headers).every((v) => typeof v === 'string'))
                return false;
        }
        return true;
    }
    if (type === 'rss') {
        const config = obj;
        // Check required fields
        if (typeof config.url !== 'string' || !isValidHttpUrl(config.url))
            return false;
        if (typeof config.refresh_ms !== 'number' || config.refresh_ms <= 0)
            return false;
        if (typeof config.mapping !== 'object' || config.mapping === null)
            return false;
        return true;
    }
    if (type === 'static') {
        const config = obj;
        // Static just needs a data object
        if (typeof config.data !== 'object' || config.data === null)
            return false;
        return true;
    }
    return false;
}
/**
 * Validate that a URL is http or https
 */
function isValidHttpUrl(url) {
    try {
        const parsed = new URL(url);
        return parsed.protocol === 'http:' || parsed.protocol === 'https:';
    }
    catch {
        return false;
    }
}
//# sourceMappingURL=index.js.map