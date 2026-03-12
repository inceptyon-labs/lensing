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
export declare function createMarketplaceClient(options: MarketplaceClientOptions): MarketplaceClientInstance;
//# sourceMappingURL=marketplace-client.d.ts.map