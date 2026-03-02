import type { StaticConnectorConfig } from '@lensing/types';

/**
 * Runtime connector interface for static/passthrough data.
 */
export interface StaticConnector {
  /** Return the static data as-is */
  fetch(): Promise<Record<string, unknown>>;
  /** Return the static data (always available) */
  getCachedResponse(): Record<string, unknown>;
  /** No-op for static connector (data is always available) */
  clearCache(): void;
}

/**
 * Create a static connector that returns user-defined data without fetching.
 * Useful for widgets displaying fixed content (welcome messages, labels, etc.)
 */
export function createStaticConnector(config: StaticConnectorConfig): StaticConnector {
  async function fetch(): Promise<Record<string, unknown>> {
    return config.data;
  }

  function getCachedResponse(): Record<string, unknown> {
    return config.data;
  }

  function clearCache(): void {
    // No-op: static data is always available
  }

  return { fetch, getCachedResponse, clearCache };
}
