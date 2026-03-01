import { getBlockReason } from './url-blocklist';

/** Injectable fetch function for testability */
export type ConnectorFetchFn = (
  url: string,
  options?: {
    method?: string;
    headers?: Record<string, string>;
    signal?: AbortSignal;
  }
) => Promise<{
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

const DEFAULT_TIMEOUT_MS = 10000;

/** Recursively extract dot-notation field paths from a JSON value */
function extractFields(value: unknown, prefix = '', maxDepth = 4): string[] {
  if (maxDepth <= 0) return prefix ? [prefix] : [];

  if (Array.isArray(value)) {
    if (value.length === 0) return prefix ? [prefix] : [];
    const arrayPrefix = prefix ? `${prefix}[0]` : '[0]';
    const first = value[0];
    if (typeof first === 'object' && first !== null && !Array.isArray(first)) {
      return extractFields(first, arrayPrefix, maxDepth - 1);
    }
    return [arrayPrefix];
  }

  if (typeof value === 'object' && value !== null) {
    const obj = value as Record<string, unknown>;
    const keys = Object.keys(obj);
    if (keys.length === 0) return prefix ? [prefix] : [];

    const fields: string[] = [];
    for (const key of keys) {
      const fieldPath = prefix ? `${prefix}.${key}` : key;
      const child = obj[key];
      if (typeof child === 'object' && child !== null) {
        fields.push(...extractFields(child, fieldPath, maxDepth - 1));
      } else {
        fields.push(fieldPath);
      }
    }
    return fields;
  }

  return prefix ? [prefix] : [];
}

/** Parse an RSS/XML document and extract channel title + items */
function parseRss(xmlText: string): { channelTitle: string; items: Array<Record<string, string>> } {
  const channelTitleMatch = xmlText.match(/<channel[^>]*>[\s\S]*?<title[^>]*>([\s\S]*?)<\/title>/);
  const channelTitle = channelTitleMatch ? channelTitleMatch[1].trim() : '';

  const itemRegex = /<item[^>]*>([\s\S]*?)<\/item>/g;
  const items: Array<Record<string, string>> = [];
  let itemMatch;

  const RSS_ITEM_FIELDS = ['title', 'link', 'description', 'pubDate', 'guid', 'author', 'category'];

  while ((itemMatch = itemRegex.exec(xmlText)) !== null) {
    const itemXml = itemMatch[1];
    const item: Record<string, string> = {};

    for (const field of RSS_ITEM_FIELDS) {
      const fieldMatch = itemXml.match(new RegExp(`<${field}[^>]*>([\\s\\S]*?)<\\/${field}>`));
      if (fieldMatch) {
        item[field] = fieldMatch[1].trim();
      }
    }

    if (Object.keys(item).length > 0) {
      items.push(item);
    }
  }

  return { channelTitle, items };
}

/**
 * Test a connector config by making a real fetch and returning sample data.
 * Validates the URL against the SSRF blocklist before fetching.
 */
export async function testConnector(
  config: ConnectorTestConfig,
  options: ConnectorTestOptions = {}
): Promise<ConnectorTestResult> {
  const {
    fetchFn = fetch as unknown as ConnectorFetchFn,
    timeoutMs = DEFAULT_TIMEOUT_MS,
    allowPrivate = false,
  } = options;

  // Validate type
  if (!config.type || (config.type !== 'json_api' && config.type !== 'rss_feed')) {
    return {
      success: false,
      error: `Unsupported connector type: "${config.type}". Must be "json_api" or "rss_feed".`,
    };
  }

  // Validate URL present
  if (!config.url || config.url.trim() === '') {
    return { success: false, error: 'URL is required' };
  }

  // SSRF blocklist check
  const blockReason = getBlockReason(config.url, { allowPrivate });
  if (blockReason) {
    return { success: false, error: `Blocked: ${blockReason}` };
  }

  // Set up timeout
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeoutMs);

  try {
    const response = await fetchFn(config.url, {
      method: config.method ?? 'GET',
      headers: config.headers ?? {},
      signal: controller.signal,
    });

    if (!response.ok) {
      return { success: false, error: `HTTP ${response.status}: ${response.statusText}` };
    }

    if (config.type === 'json_api') {
      let data: unknown;
      try {
        data = await response.json();
      } catch (err) {
        return {
          success: false,
          error: `Failed to parse JSON response: ${err instanceof Error ? err.message : String(err)}`,
        };
      }

      const fields = extractFields(data);
      return { success: true, sample: data, fields };
    } else {
      // rss_feed
      const text = await response.text();
      const parsed = parseRss(text);
      const fields = parsed.items.length > 0 ? Object.keys(parsed.items[0]) : [];
      return { success: true, sample: parsed, fields };
    }
  } catch (err) {
    if (err instanceof DOMException && err.name === 'AbortError') {
      return { success: false, error: `Request timeout after ${timeoutMs}ms` };
    }
    const message = err instanceof Error ? err.message : String(err);
    return { success: false, error: `Network error: ${message}` };
  } finally {
    clearTimeout(timeoutId);
  }
}
