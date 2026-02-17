import { describe, it, expect, beforeEach } from 'vitest';
import { createCacheStore, type CacheStore } from '../cache';

describe('Cache Store', () => {
  let cache: CacheStore;

  beforeEach(() => {
    cache = createCacheStore();
  });

  describe('types and interface', () => {
    it('should create a cache store', () => {
      expect(cache).toBeDefined();
      expect(cache.read).toBeDefined();
      expect(cache.write).toBeDefined();
      expect(cache.getStaleStatus).toBeDefined();
      expect(cache.invalidate).toBeDefined();
    });

    it('should return undefined for missing keys', () => {
      const result = cache.read('nonexistent:key');
      expect(result).toBeUndefined();
    });
  });

  describe('basic read/write', () => {
    it('should write and read a value', () => {
      cache.write('user:123', { name: 'Alice', age: 30 }, { max_stale_ms: 60000 });
      const entry = cache.read('user:123');

      expect(entry).toBeDefined();
      expect(entry?.value).toEqual({ name: 'Alice', age: 30 });
    });

    it('should preserve metadata', () => {
      cache.write('weather:NYC', { temp: 72 }, { max_stale_ms: 300000, source: 'openweather' });
      const entry = cache.read('weather:NYC');

      expect(entry?.value).toEqual({ temp: 72 });
      expect(entry?.max_stale_ms).toBe(300000);
      expect(entry?.source).toBe('openweather');
    });

    it('should store createdAt timestamp', () => {
      const before = Date.now();
      cache.write('test:key', 'value', { max_stale_ms: 60000 });
      const after = Date.now();

      const entry = cache.read('test:key');
      expect(entry?.createdAt).toBeDefined();
      expect(entry!.createdAt).toBeGreaterThanOrEqual(before);
      expect(entry!.createdAt).toBeLessThanOrEqual(after);
    });
  });

  describe('staleness tracking', () => {
    it('should flag fresh data as not stale', () => {
      cache.write('data:1', 'fresh', { max_stale_ms: 60000 });
      const status = cache.getStaleStatus('data:1');

      expect(status.stale).toBe(false);
    });

    it('should flag old data as stale', () => {
      const oldTimestamp = Date.now() - 100000; // 100s ago
      cache.write('data:2', 'old', { max_stale_ms: 60000 });

      // Manually set createdAt to simulate age (hack for test)
      const entry = cache.read('data:2');
      if (entry) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (entry as any).createdAt = oldTimestamp;
      }

      const status = cache.getStaleStatus('data:2');
      expect(status.stale).toBe(true);
    });

    it('should return undefined status for missing keys', () => {
      const status = cache.getStaleStatus('missing:key');
      expect(status.stale).toBe(false);
      expect(status.found).toBe(false);
    });

    it('should respect max_stale_ms threshold', () => {
      cache.write('threshold:test', 'value', { max_stale_ms: 10000 });

      // Simulate passage of time by hacking the entry
      const entry = cache.read('threshold:test');
      if (entry) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (entry as any).createdAt = Date.now() - 15000; // 15s ago, exceeds 10s threshold
      }

      const status = cache.getStaleStatus('threshold:test');
      expect(status.stale).toBe(true);
    });
  });

  describe('invalidation', () => {
    it('should invalidate a single key', () => {
      cache.write('to:delete', 'value', { max_stale_ms: 60000 });
      expect(cache.read('to:delete')).toBeDefined();

      cache.invalidate('to:delete');
      expect(cache.read('to:delete')).toBeUndefined();
    });

    it('should silently succeed on missing keys', () => {
      expect(() => cache.invalidate('missing:key')).not.toThrow();
    });

    it('should support wildcard invalidation', () => {
      cache.write('namespace:key1', 'value1', { max_stale_ms: 60000 });
      cache.write('namespace:key2', 'value2', { max_stale_ms: 60000 });
      cache.write('other:key3', 'value3', { max_stale_ms: 60000 });

      cache.invalidate('namespace:*');

      expect(cache.read('namespace:key1')).toBeUndefined();
      expect(cache.read('namespace:key2')).toBeUndefined();
      expect(cache.read('other:key3')).toBeDefined();
    });

    it('should match wildcard patterns correctly', () => {
      cache.write('weather:NYC:temp', 'value1', { max_stale_ms: 60000 });
      cache.write('weather:NYC:humidity', 'value2', { max_stale_ms: 60000 });
      cache.write('weather:LA:temp', 'value3', { max_stale_ms: 60000 });

      cache.invalidate('weather:NYC:*');

      expect(cache.read('weather:NYC:temp')).toBeUndefined();
      expect(cache.read('weather:NYC:humidity')).toBeUndefined();
      expect(cache.read('weather:LA:temp')).toBeDefined();
    });
  });

  describe('request coalescing', () => {
    it('should coalesce duplicate read requests', async () => {
      let callCount = 0;
      const fetcher = async () => {
        callCount++;
        return 'data';
      };

      // Simulate two requests for same key
      const promise1 = cache.readOrFetch('shared:key', fetcher, { max_stale_ms: 60000 });
      const promise2 = cache.readOrFetch('shared:key', fetcher, { max_stale_ms: 60000 });

      const [result1, result2] = await Promise.all([promise1, promise2]);

      expect(result1).toBe('data');
      expect(result2).toBe('data');
      expect(callCount).toBe(1); // Fetcher called only once
    });

    it('should return cached value on subsequent requests', async () => {
      let callCount = 0;
      const fetcher = async () => {
        callCount++;
        return 'data';
      };

      // First request
      const result1 = await cache.readOrFetch('cached:key', fetcher, { max_stale_ms: 60000 });

      // Second request (should hit cache)
      const result2 = await cache.readOrFetch('cached:key', fetcher, { max_stale_ms: 60000 });

      expect(result1).toBe('data');
      expect(result2).toBe('data');
      expect(callCount).toBe(1); // Still called only once
    });

    it('should handle fetch errors and clean up in-flight tracking', async () => {
      let callCount = 0;
      const faulty = async () => {
        callCount++;
        throw new Error('fetch failed');
      };

      // First request fails
      try {
        await cache.readOrFetch('error:key', faulty, { max_stale_ms: 60000 });
      } catch {
        // expected
      }

      // Second request should retry (not reuse failed promise)
      try {
        await cache.readOrFetch('error:key', faulty, { max_stale_ms: 60000 });
      } catch {
        // expected
      }

      expect(callCount).toBe(2); // Fetcher called twice, error tracking cleaned up
    });
  });
});
