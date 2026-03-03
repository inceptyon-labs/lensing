import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import * as fs from 'fs/promises';
import * as path from 'path';
import { createMarketplaceClient } from '../marketplace-client';

describe('MarketplaceClient', () => {
  let tempCacheDir: string;
  let mockFetch: ReturnType<typeof vi.fn>;

  beforeEach(() => {
    // Use a temp directory for each test
    tempCacheDir = path.join('/tmp', `marketplace-cache-${Date.now()}-${Math.random()}`);

    // Mock fetch globally
    mockFetch = vi.fn();
    global.fetch = mockFetch as any;
  });

  afterEach(async () => {
    // Clean up temp directory
    try {
      await fs.rm(tempCacheDir, { recursive: true, force: true });
    } catch {
      // Ignore cleanup errors
    }
  });

  it('fetches index.json from GitHub raw content URL', async () => {
    const mockIndex = { version: '1.0.0', plugins: [{ id: 'test', name: 'Test' }] };
    mockFetch.mockResolvedValue({
      ok: true,
      json: async () => mockIndex,
    });

    const client = createMarketplaceClient({
      cacheDir: tempCacheDir,
      marketplaceRepo: 'owner/repo',
      refreshInterval: 900,
    });

    const result = await client.getIndex();
    expect(result).toMatchObject(mockIndex);
    expect(mockFetch).toHaveBeenCalledWith(
      'https://raw.githubusercontent.com/owner/repo/main/index.json'
    );
  });

  it('caches to disk at correct path', async () => {
    const mockIndex = { version: '1.0.0', plugins: [] };
    mockFetch.mockResolvedValue({
      ok: true,
      json: async () => mockIndex,
    });

    const client = createMarketplaceClient({
      cacheDir: tempCacheDir,
      marketplaceRepo: 'owner/repo',
      refreshInterval: 900,
    });

    await client.getIndex();

    const cachePath = path.join(tempCacheDir, 'index.json');
    const cached = JSON.parse(await fs.readFile(cachePath, 'utf-8'));
    expect(cached).toMatchObject(mockIndex);
  });

  it('returns cached data if GitHub is unreachable', async () => {
    const mockIndex = { version: '1.0.0', plugins: [{ id: 'test' }] };

    // First call succeeds
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => mockIndex,
    });

    const client = createMarketplaceClient({
      cacheDir: tempCacheDir,
      marketplaceRepo: 'owner/repo',
      refreshInterval: 900,
    });

    await client.getIndex();

    // Second call fails (network error)
    mockFetch.mockRejectedValueOnce(new Error('Network error'));

    const result = await client.getIndex();
    expect(result).toMatchObject(mockIndex);
  });

  it('validates index schema has version and plugins array', async () => {
    const invalidIndex = { name: 'Missing fields' };
    mockFetch.mockResolvedValue({
      ok: true,
      json: async () => invalidIndex,
    });

    const client = createMarketplaceClient({
      cacheDir: tempCacheDir,
      marketplaceRepo: 'owner/repo',
      refreshInterval: 900,
    });

    await expect(client.getIndex()).rejects.toThrow(/schema|version|plugins|invalid/i);
  });

  it('falls back to last-known-good cache when fetch returns malformed data', async () => {
    const goodIndex = { version: '1.0.0', plugins: [{ id: 'good' }] };
    const badIndex = { invalid: 'structure' };

    // First call succeeds
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => goodIndex,
    });

    const client = createMarketplaceClient({
      cacheDir: tempCacheDir,
      marketplaceRepo: 'owner/repo',
      refreshInterval: 900,
    });

    await client.getIndex();

    // Second call returns malformed data
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => badIndex,
    });

    // Should still return the good cached data
    const result = await client.getIndex();
    expect(result).toMatchObject(goodIndex);
  });

  it('respects configurable marketplace repo URL', async () => {
    mockFetch.mockResolvedValue({
      ok: true,
      json: async () => ({ version: '1.0.0', plugins: [] }),
    });

    const client = createMarketplaceClient({
      cacheDir: tempCacheDir,
      marketplaceRepo: 'custom-org/custom-repo',
      refreshInterval: 900,
    });

    await client.getIndex();

    expect(mockFetch).toHaveBeenCalledWith(
      'https://raw.githubusercontent.com/custom-org/custom-repo/main/index.json'
    );
  });

  it('handles 404 from GitHub gracefully', async () => {
    mockFetch.mockResolvedValue({
      ok: false,
      status: 404,
      statusText: 'Not Found',
    });

    const client = createMarketplaceClient({
      cacheDir: tempCacheDir,
      marketplaceRepo: 'owner/repo',
      refreshInterval: 900,
    });

    await expect(client.getIndex()).rejects.toThrow(/404|not found|marketplace|not found/i);
  });

  it('creates cache directory if missing', async () => {
    const nestedCacheDir = path.join(tempCacheDir, 'nested', 'cache', 'dir');
    const mockIndex = { version: '1.0.0', plugins: [] };

    mockFetch.mockResolvedValue({
      ok: true,
      json: async () => mockIndex,
    });

    const client = createMarketplaceClient({
      cacheDir: nestedCacheDir,
      marketplaceRepo: 'owner/repo',
      refreshInterval: 900,
    });

    await client.getIndex();

    const stat = await fs.stat(nestedCacheDir);
    expect(stat.isDirectory()).toBe(true);
  });

  it('refreshes cache after interval expires', async () => {
    const mockIndex1 = { version: '1.0.0', plugins: [{ id: 'v1' }] };
    const mockIndex2 = { version: '2.0.0', plugins: [{ id: 'v2' }] };

    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => mockIndex1,
    });

    // Create client with very short refresh interval (10ms)
    const client = createMarketplaceClient({
      cacheDir: tempCacheDir,
      marketplaceRepo: 'owner/repo',
      refreshInterval: 10,
    });

    const result1 = await client.getIndex();
    expect(result1).toMatchObject(mockIndex1);

    // Wait for refresh interval to expire
    await new Promise((resolve) => setTimeout(resolve, 20));

    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => mockIndex2,
    });

    const result2 = await client.getIndex();
    expect(result2).toMatchObject(mockIndex2);
  });

  it('includes lastFetchTime timestamp in cached data', async () => {
    const mockIndex = { version: '1.0.0', plugins: [{ id: 'test' }] };
    mockFetch.mockResolvedValue({
      ok: true,
      json: async () => mockIndex,
    });

    const client = createMarketplaceClient({
      cacheDir: tempCacheDir,
      marketplaceRepo: 'owner/repo',
    });

    const before = Date.now();
    const result = await client.getIndex();
    const after = Date.now();

    expect(result.lastFetchTime).toBeDefined();
    expect(typeof result.lastFetchTime).toBe('number');
    expect(result.lastFetchTime).toBeGreaterThanOrEqual(before);
    expect(result.lastFetchTime).toBeLessThanOrEqual(after);
  });

  it('should reject marketplaceRepo with path traversal', () => {
    expect(() =>
      createMarketplaceClient({
        cacheDir: tempCacheDir,
        marketplaceRepo: '../evil/repo',
        refreshInterval: 900,
      })
    ).toThrow(/invalid.*marketplace|marketplace.*invalid/i);
  });

  it('should reject marketplaceRepo with encoded characters', () => {
    expect(() =>
      createMarketplaceClient({
        cacheDir: tempCacheDir,
        marketplaceRepo: 'owner/repo%2F..%2Fsecret',
        refreshInterval: 900,
      })
    ).toThrow(/invalid.*marketplace|marketplace.*invalid/i);
  });

  it('should accept valid owner/repo with dots, hyphens, underscores', async () => {
    mockFetch.mockResolvedValue({
      ok: true,
      json: async () => ({ version: '1.0.0', plugins: [] }),
    });
    const client = createMarketplaceClient({
      cacheDir: tempCacheDir,
      marketplaceRepo: 'my-org_1/my.repo-2',
      refreshInterval: 900,
    });
    const result = await client.getIndex();
    expect(result.version).toBe('1.0.0');
  });

  it('retrieves lastFetchTime from disk cache', async () => {
    const mockIndex = { version: '1.0.0', plugins: [] };
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => mockIndex,
    });

    const client = createMarketplaceClient({
      cacheDir: tempCacheDir,
      marketplaceRepo: 'owner/repo',
      refreshInterval: 900,
    });

    const result1 = await client.getIndex();
    const fetchTime = result1.lastFetchTime!;
    expect(fetchTime).toBeDefined();

    // Second call should get from cache, not re-fetch
    mockFetch.mockRejectedValueOnce(new Error('Network error'));
    const result2 = await client.getIndex();

    expect(result2.lastFetchTime).toBe(fetchTime);
    expect(result2.version).toBe('1.0.0');
  });
});
