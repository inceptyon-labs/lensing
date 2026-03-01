import type { JsonApiConnectorConfig } from '@lensing/types';
import type { ConnectorFetchFn } from './connector-proxy';
import { getBlockReason } from './url-blocklist';

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

const DEFAULT_TIMEOUT_MS = 10_000;

/**
 * Resolve a dot-notation JSONPath expression against a value.
 * Supports: $.field, $.a.b.c, $.items[0].field
 */
function resolveJsonPath(value: unknown, path: string): unknown {
  // Strip leading $. or $
  const normalized = path.replace(/^\$\.?/, '');
  if (!normalized) return value;

  const parts = normalized.split('.');
  let current: unknown = value;

  for (const part of parts) {
    if (current === null || current === undefined) {
      throw new Error(`JSONPath: path not found: ${path}`);
    }

    // Handle array index: fieldName[0]
    const arrayMatch = part.match(/^(\w+)\[(\d+)\]$/);
    if (arrayMatch) {
      const [, key, indexStr] = arrayMatch;
      const obj = current as Record<string, unknown>;
      if (!(key in obj)) {
        throw new Error(`JSONPath: path not found: ${path}`);
      }
      const arr = obj[key];
      if (!Array.isArray(arr)) {
        throw new Error(`JSONPath: expected array at "${key}" in path: ${path}`);
      }
      current = arr[parseInt(indexStr, 10)];
    } else {
      const obj = current as Record<string, unknown>;
      if (!(part in obj)) {
        throw new Error(`JSONPath: path not found: ${path}`);
      }
      current = obj[part];
    }
  }

  return current;
}

/**
 * Substitute {{NAME}} placeholders in a string using the provided resolver.
 */
async function substitutePlaceholders(
  str: string,
  resolver: (name: string) => Promise<string>
): Promise<string> {
  const matches = [...str.matchAll(/\{\{(\w+)\}\}/g)];
  let result = str;

  for (const match of matches) {
    const value = await resolver(match[1]);
    result = result.replace(match[0], value);
  }

  return result;
}

/**
 * Create a JSON API connector that fetches data from a URL, extracts fields via
 * JSONPath expressions, and caches the last successful response for stale fallback.
 */
export function createJsonApiConnector(
  config: JsonApiConnectorConfig,
  options: JsonApiConnectorOptions = {}
): JsonApiConnector {
  const {
    fetchFn = fetch as unknown as ConnectorFetchFn,
    timeoutMs = DEFAULT_TIMEOUT_MS,
    allowPrivate = false,
    secretResolver,
  } = options;

  let cachedResponse: Record<string, unknown> | undefined;

  async function doFetch(): Promise<Record<string, unknown>> {
    // Resolve {{SECRET_NAME}} placeholders in URL and headers
    let url = config.url;
    const headers: Record<string, string> = { ...(config.headers ?? {}) };

    if (secretResolver) {
      url = await substitutePlaceholders(url, secretResolver);
      for (const [key, value] of Object.entries(headers)) {
        headers[key] = await substitutePlaceholders(value, secretResolver);
      }
    }

    // SSRF protection
    const blockReason = getBlockReason(url, { allowPrivate });
    if (blockReason) {
      throw new Error(`URL blocked: ${blockReason}`);
    }

    // Set up timeout
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), timeoutMs);

    try {
      const response = await fetchFn(url, {
        method: config.method,
        headers,
        signal: controller.signal,
      });

      if (!response.ok) {
        // Return cached data on HTTP error if available
        if (cachedResponse !== undefined) {
          return cachedResponse;
        }
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      let data: unknown;
      try {
        data = await response.json();
      } catch (err) {
        throw new Error(
          `Failed to parse JSON response: ${err instanceof Error ? err.message : String(err)}`
        );
      }

      // Extract fields using JSONPath mapping
      const result: Record<string, unknown> = {};
      for (const [slotName, jsonPath] of Object.entries(config.mapping)) {
        result[slotName] = resolveJsonPath(data, jsonPath);
      }

      cachedResponse = result;
      return result;
    } catch (err) {
      // Timeout: AbortController fired
      if (err instanceof DOMException && err.name === 'AbortError') {
        throw new Error(`Request timeout after ${timeoutMs}ms`);
      }
      // Re-throw errors we already classified
      if (
        err instanceof Error &&
        (err.message.startsWith('HTTP ') ||
          err.message.startsWith('Failed to parse') ||
          err.message.startsWith('JSONPath:'))
      ) {
        throw err;
      }
      // Wrap unexpected errors as network errors
      const message = err instanceof Error ? err.message : String(err);
      throw new Error(`Network error: ${message}`);
    } finally {
      clearTimeout(timeoutId);
    }
  }

  return {
    fetch: doFetch,
    getCachedResponse: () => cachedResponse,
    clearCache: () => {
      cachedResponse = undefined;
    },
  };
}
