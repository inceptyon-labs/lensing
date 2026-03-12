import * as fs from 'fs/promises';
import * as path from 'path';
function isValidIndex(data) {
    if (!data || typeof data !== 'object')
        return false;
    const obj = data;
    return typeof obj.version === 'string' && Array.isArray(obj.plugins);
}
export function createMarketplaceClient(options) {
    const { cacheDir, marketplaceRepo } = options;
    const refreshInterval = options.refreshInterval ?? 900_000;
    const GITHUB_SEGMENT_RE = /^[a-zA-Z0-9][a-zA-Z0-9_.-]*$/;
    const [owner, repo, ...extra] = marketplaceRepo.split('/');
    if (extra.length > 0 ||
        !GITHUB_SEGMENT_RE.test(owner ?? '') ||
        !GITHUB_SEGMENT_RE.test(repo ?? '')) {
        throw new Error(`Invalid marketplaceRepo: "${marketplaceRepo}". Expected format: owner/repo`);
    }
    const cacheFile = path.join(cacheDir, 'index.json');
    const url = `https://raw.githubusercontent.com/${marketplaceRepo}/main/index.json`;
    let lastFetchTime = 0;
    let inMemoryCache = null;
    async function readDiskCache() {
        try {
            const content = await fs.readFile(cacheFile, 'utf-8');
            const data = JSON.parse(content);
            return isValidIndex(data) ? data : null;
        }
        catch {
            return null;
        }
    }
    async function writeDiskCache(index) {
        await fs.mkdir(cacheDir, { recursive: true });
        await fs.writeFile(cacheFile, JSON.stringify(index), 'utf-8');
    }
    function stampedIndex(index, timestamp) {
        return { ...index, lastFetchTime: timestamp };
    }
    async function fetchFromGitHub() {
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error(`Marketplace fetch failed: ${response.status} ${response.statusText}`);
        }
        const data = (await response.json());
        if (!isValidIndex(data)) {
            throw new Error('Invalid marketplace index schema: missing version or plugins array');
        }
        return data;
    }
    async function getIndex() {
        const now = Date.now();
        const elapsed = now - lastFetchTime;
        const isFresh = inMemoryCache !== null && elapsed < refreshInterval;
        if (isFresh) {
            return inMemoryCache;
        }
        try {
            const freshData = await fetchFromGitHub();
            const stamped = stampedIndex(freshData, now);
            await writeDiskCache(stamped);
            inMemoryCache = stamped;
            lastFetchTime = now;
            return stamped;
        }
        catch (fetchError) {
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
//# sourceMappingURL=marketplace-client.js.map