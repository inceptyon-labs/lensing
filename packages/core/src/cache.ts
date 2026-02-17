import type { CacheStore, CacheEntry, StalePolicy, StaleStatus } from '@lensing/types';

/**
 * Creates an in-memory cache store with staleness tracking and request coalescing.
 */
export function createCacheStore(): CacheStore {
  const entries = new Map<string, CacheEntry>();
  const inFlight = new Map<string, Promise<unknown>>();

  function patternMatches(key: string, pattern: string): boolean {
    if (!pattern.includes('*')) {
      return key === pattern;
    }
    // Escape regex metacharacters and replace * with .*
    const escaped = pattern.replace(/[.+?^${}()|[\]\\]/g, '\\$&').replace(/\*/g, '.*');
    try {
      const regex = new RegExp(`^${escaped}$`);
      return regex.test(key);
    } catch {
      return false;
    }
  }

  return {
    read<T = unknown>(key: string): CacheEntry<T> | undefined {
      return entries.get(key) as CacheEntry<T> | undefined;
    },

    write<T = unknown>(key: string, value: T, policy: StalePolicy): void {
      entries.set(key, {
        value,
        createdAt: Date.now(),
        max_stale_ms: policy.max_stale_ms,
        source: policy.source,
      });
    },

    getStaleStatus(key: string): StaleStatus {
      const entry = entries.get(key);
      if (!entry) {
        return { stale: false, found: false };
      }

      const age = Date.now() - entry.createdAt;
      const stale = age > entry.max_stale_ms;

      return { stale, found: true, age_ms: age };
    },

    invalidate(key: string): void {
      if (key.includes('*')) {
        // Wildcard invalidation
        const keysToDelete = Array.from(entries.keys()).filter((k) => patternMatches(k, key));
        keysToDelete.forEach((k) => {
          entries.delete(k);
          inFlight.delete(k); // Clean up in-flight requests too
        });
      } else {
        // Single key invalidation
        entries.delete(key);
        inFlight.delete(key); // Clean up any in-flight request
      }
    },

    async readOrFetch<T = unknown>(
      key: string,
      fetcher: () => Promise<T>,
      policy: StalePolicy
    ): Promise<T> {
      // Check cache first, but only if not stale
      const cached = entries.get(key);
      if (cached) {
        const age = Date.now() - cached.createdAt;
        if (age <= cached.max_stale_ms) {
          return cached.value as T;
        }
        // Data is stale, remove it so fetch happens below
        entries.delete(key);
      }

      // Check if fetch is already in progress
      let promise = inFlight.get(key);
      if (promise) {
        return promise as Promise<T>;
      }

      // Start fetch
      promise = (async () => {
        try {
          const value = await fetcher();
          entries.set(key, {
            value,
            createdAt: Date.now(),
            max_stale_ms: policy.max_stale_ms,
            source: policy.source,
          });
          return value;
        } finally {
          inFlight.delete(key);
        }
      })();

      inFlight.set(key, promise);
      return promise as Promise<T>;
    },
  };
}

export type { CacheStore, CacheEntry, StalePolicy, StaleStatus } from '@lensing/types';
