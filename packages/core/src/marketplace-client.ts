import * as fs from 'fs/promises';
import * as path from 'path';
import type { MarketplaceIndex } from '@lensing/types';

export interface MarketplaceClientOptions {
  cacheDir: string;
  marketplaceRepo: string;
  /** Refresh interval in milliseconds. Default: 900_000 (15 minutes) */
  refreshInterval?: number;
}

export interface MarketplaceClientInstance {
  getIndex(): Promise<MarketplaceIndex>;
}

function isValidIndex(data: unknown): data is MarketplaceIndex {
  if (!data || typeof data !== 'object') return false;
  const obj = data as Record<string, unknown>;
  return typeof obj.version === 'string' && Array.isArray(obj.plugins);
}

export function createMarketplaceClient(
  options: MarketplaceClientOptions
): MarketplaceClientInstance {
  const { cacheDir, marketplaceRepo } = options;
  const refreshInterval = options.refreshInterval ?? 900_000;
  const cacheFile = path.join(cacheDir, 'index.json');
  const url = `https://raw.githubusercontent.com/${marketplaceRepo}/main/index.json`;

  let lastFetchTime = 0;
  let inMemoryCache: MarketplaceIndex | null = null;

  async function readDiskCache(): Promise<MarketplaceIndex | null> {
    try {
      const content = await fs.readFile(cacheFile, 'utf-8');
      const data = JSON.parse(content) as unknown;
      return isValidIndex(data) ? data : null;
    } catch {
      return null;
    }
  }

  async function writeDiskCache(index: MarketplaceIndex): Promise<void> {
    await fs.mkdir(cacheDir, { recursive: true });
    await fs.writeFile(cacheFile, JSON.stringify(index), 'utf-8');
  }

  async function fetchFromGitHub(): Promise<MarketplaceIndex> {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Marketplace fetch failed: ${response.status} ${response.statusText}`);
    }
    const data = (await response.json()) as unknown;
    if (!isValidIndex(data)) {
      throw new Error('Invalid marketplace index schema: missing version or plugins array');
    }
    return data;
  }

  async function getIndex(): Promise<MarketplaceIndex> {
    const now = Date.now();
    const elapsed = now - lastFetchTime;
    const isFresh = inMemoryCache !== null && elapsed < refreshInterval;

    if (isFresh) {
      return inMemoryCache!;
    }

    try {
      const freshData = await fetchFromGitHub();
      await writeDiskCache(freshData);
      inMemoryCache = freshData;
      lastFetchTime = now;
      return freshData;
    } catch (fetchError) {
      // Fetch failed or returned invalid schema — fall back to best available cache
      const fallback = inMemoryCache ?? (await readDiskCache());
      if (fallback !== null) {
        return fallback;
      }
      throw fetchError;
    }
  }

  return { getIndex };
}
