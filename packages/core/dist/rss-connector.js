import { getBlockReason } from './url-blocklist';
const DEFAULT_TIMEOUT_MS = 10_000;
const DEFAULT_ITEM_LIMIT = 10;
/**
 * Extract text content from an XML-like object
 * Handles paths like "author", "image > url", "enclosure @url", etc.
 */
function extractValue(element, path) {
    const parts = path.split('>').map((s) => s.trim());
    let current = element;
    for (const part of parts) {
        if (!current || typeof current !== 'object')
            return undefined;
        const attrMatch = part.match(/^([\w:]+)\s*@([\w:]+)$/);
        if (attrMatch) {
            // Attribute selector: "tag @attr"
            const [, tagName, attrName] = attrMatch;
            const obj = current;
            // First check if we have a direct match for the tag with attributes
            const tagData = obj[tagName];
            if (tagData && typeof tagData === 'object' && !Array.isArray(tagData)) {
                const tagObj = tagData;
                const value = tagObj[attrName];
                if (typeof value === 'string')
                    return value;
            }
            return undefined;
        }
        const obj = current;
        current = obj[part];
    }
    if (typeof current === 'string')
        return current;
    if (Array.isArray(current) && current.length > 0) {
        const first = current[0];
        if (typeof first === 'string')
            return first;
        if (typeof first === 'object' && first !== null) {
            return extractValue(first, '$');
        }
    }
    return undefined;
}
/**
 * Simple XML string parser for RSS/Atom feeds
 * Returns a tree-like structure without full DOM parsing
 */
function parseXmlSimple(xml) {
    // Validate minimal XML structure
    if (!xml || typeof xml !== 'string' || xml.trim().length < 5) {
        throw new Error('Failed to parse RSS/Atom feed: malformed XML');
    }
    // Remove XML declaration and comments
    let cleaned = xml.replace(/<\?.*?\?>/g, '').replace(/<!--.*?-->/gs, '');
    // Find root element
    const rootMatch = cleaned.match(/<([\w:]+)[\s>]/);
    if (!rootMatch) {
        throw new Error('Failed to parse RSS/Atom feed: malformed XML (no root element)');
    }
    const rootTag = rootMatch[1].toLowerCase();
    // Validate that the root tag has a closing tag
    const closingTagPattern = new RegExp(`</${rootTag}\\s*>`, 'i');
    if (!closingTagPattern.test(cleaned)) {
        throw new Error('Failed to parse RSS/Atom feed: malformed XML (unclosed root element)');
    }
    const result = { _tag: rootTag };
    if (rootTag === 'rss') {
        // Parse RSS items
        const itemRegex = /<item>([\s\S]*?)<\/item>/g;
        const items = [];
        let match;
        while ((match = itemRegex.exec(cleaned)) !== null) {
            const itemContent = match[1];
            const item = parseXmlElement(itemContent);
            items.push(item);
        }
        result.items = items;
    }
    else if (rootTag === 'feed') {
        // Parse Atom entries
        const entryRegex = /<entry[\s>]([\s\S]*?)<\/entry>/g;
        const items = [];
        let match;
        while ((match = entryRegex.exec(cleaned)) !== null) {
            const entryContent = match[1];
            const item = parseXmlElement(entryContent);
            items.push(item);
        }
        result.items = items;
    }
    else {
        throw new Error(`Unknown feed format: expected rss or feed root element, got ${rootTag}`);
    }
    return result;
}
/**
 * Parse XML element content into a key-value structure
 */
function parseXmlElement(content) {
    const element = {};
    // Extract simple text elements
    const textRegex = /<([\w:]+)>([^<]*)<\/\1>/g;
    let match;
    while ((match = textRegex.exec(content)) !== null) {
        const [, tag, text] = match;
        const key = tag.split(':')[1] || tag;
        if (text.trim()) {
            element[key] = text.trim();
        }
    }
    // Extract self-closing elements with attributes (enclosure, media:content, link, etc.)
    const attrRegex = /<([\w:]+)([^>]*?)\/>/g;
    while ((match = attrRegex.exec(content)) !== null) {
        const [, tag, attrs] = match;
        const key = tag.split(':')[1] || tag;
        const attrObj = {};
        const attrPattern = /([\w:]+)=["']([^"']*)["']/g;
        let attrMatch;
        while ((attrMatch = attrPattern.exec(attrs)) !== null) {
            const [, attrName, attrValue] = attrMatch;
            // Strip namespace prefix from attribute name
            const cleanAttrName = attrName.split(':')[1] || attrName;
            attrObj[cleanAttrName] = attrValue;
        }
        if (Object.keys(attrObj).length > 0) {
            // Store with namespace-stripped key
            element[key] = attrObj;
            // Also store under original key for compatibility (e.g., "media:content" → both "content" and "media:content")
            if (key !== tag) {
                element[tag] = attrObj;
            }
        }
    }
    // Extract nested elements like <link href="..." /> or <author><name>...</name></author>
    const nestedRegex = /<([\w:]+)[\s>]([\s\S]*?)<\/\1>/g;
    while ((match = nestedRegex.exec(content)) !== null) {
        const [, tag, innerContent] = match;
        const key = tag.split(':')[1] || tag;
        if (key === 'author' || key === 'creator') {
            // Author might have <name> or be direct text
            const nameMatch = innerContent.match(/<name>([^<]*)<\/name>/);
            if (nameMatch) {
                element[key] = nameMatch[1].trim();
            }
        }
        else if (key === 'summary' || key === 'description') {
            element[key] = innerContent.replace(/<[^>]*>/g, '').trim();
        }
    }
    return element;
}
/**
 * Create an RSS/Atom feed connector that fetches feeds and maps fields to named slots
 */
export function createRssConnector(config, options = {}) {
    const { fetchFn = fetch, timeoutMs = DEFAULT_TIMEOUT_MS, allowPrivate = false } = options;
    const limit = config.limit || DEFAULT_ITEM_LIMIT;
    let cachedResponse;
    async function doFetch() {
        // SSRF check
        const blockReason = getBlockReason(config.url, { allowPrivate });
        if (blockReason) {
            throw new Error(`SSRF protection blocked URL: ${blockReason}`);
        }
        // Fetch with timeout
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), timeoutMs);
        try {
            const response = await fetchFn(config.url, {
                signal: controller.signal,
            });
            if (!response.ok) {
                throw new Error(`HTTP ${response.status}: ${response.statusText}`);
            }
            const text = await response.text();
            const parsed = parseXmlSimple(text);
            const allItems = parsed.items || [];
            // Limit items and map fields
            const mappedItems = [];
            for (let i = 0; i < Math.min(allItems.length, limit); i++) {
                const item = allItems[i];
                const mapped = {};
                for (const [slotName, selector] of Object.entries(config.mapping)) {
                    // Handle special Atom field mappings
                    let value;
                    if (parsed._tag === 'feed') {
                        // Atom feed
                        if (slotName === 'description' && selector === 'description') {
                            value = extractValue(item, 'summary');
                        }
                        else if (slotName === 'author' && selector === 'author') {
                            value = extractValue(item, 'author');
                        }
                        else if (slotName === 'date' && selector === 'pubDate') {
                            value = extractValue(item, 'published');
                        }
                        else if (slotName === 'link' && selector === 'link') {
                            // Atom link is an object with href attribute
                            const linkObj = item.link;
                            value = linkObj?.href;
                        }
                        else {
                            value = extractValue(item, selector);
                        }
                    }
                    else {
                        // RSS 2.0
                        value = extractValue(item, selector);
                    }
                    if (value !== undefined) {
                        mapped[slotName] = value;
                    }
                }
                mappedItems.push(mapped);
            }
            const result = { items: mappedItems };
            // Cache on success
            cachedResponse = result;
            return result;
        }
        catch (err) {
            clearTimeout(timeoutId);
            // Return cached response if available
            if (cachedResponse) {
                return cachedResponse;
            }
            throw err;
        }
        finally {
            clearTimeout(timeoutId);
        }
    }
    async function getCachedResponse() {
        return cachedResponse;
    }
    function clearCache() {
        cachedResponse = undefined;
    }
    return { fetch: doFetch, getCachedResponse, clearCache };
}
//# sourceMappingURL=rss-connector.js.map