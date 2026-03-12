/**
 * Creates an in-memory cache store with staleness tracking and request coalescing.
 */
export function createCacheStore() {
    const entries = new Map();
    const inFlight = new Map();
    function patternMatches(key, pattern) {
        if (!pattern.includes('*')) {
            return key === pattern;
        }
        // Escape regex metacharacters and replace * with .*
        const escaped = pattern.replace(/[.+?^${}()|[\]\\]/g, '\\$&').replace(/\*/g, '.*');
        try {
            const regex = new RegExp(`^${escaped}$`);
            return regex.test(key);
        }
        catch {
            return false;
        }
    }
    return {
        read(key) {
            return entries.get(key);
        },
        write(key, value, policy) {
            entries.set(key, {
                value,
                createdAt: Date.now(),
                max_stale_ms: policy.max_stale_ms,
                source: policy.source,
            });
        },
        getStaleStatus(key) {
            const entry = entries.get(key);
            if (!entry) {
                return { stale: false, found: false };
            }
            const age = Date.now() - entry.createdAt;
            const stale = age > entry.max_stale_ms;
            return { stale, found: true, age_ms: age };
        },
        invalidate(key) {
            if (key.includes('*')) {
                // Wildcard invalidation
                const keysToDelete = Array.from(entries.keys()).filter((k) => patternMatches(k, key));
                keysToDelete.forEach((k) => {
                    entries.delete(k);
                    inFlight.delete(k); // Clean up in-flight requests too
                });
            }
            else {
                // Single key invalidation
                entries.delete(key);
                inFlight.delete(key); // Clean up any in-flight request
            }
        },
        async readOrFetch(key, fetcher, policy) {
            // Check cache first, but only if not stale
            const cached = entries.get(key);
            if (cached) {
                const age = Date.now() - cached.createdAt;
                if (age <= cached.max_stale_ms) {
                    return cached.value;
                }
                // Data is stale, remove it so fetch happens below
                entries.delete(key);
            }
            // Check if fetch is already in progress
            let promise = inFlight.get(key);
            if (promise) {
                return promise;
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
                }
                finally {
                    inFlight.delete(key);
                }
            })();
            inFlight.set(key, promise);
            return promise;
        },
    };
}
//# sourceMappingURL=cache.js.map