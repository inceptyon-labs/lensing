import type { PluginManifest } from '@lensing/types';
import type { ConnectorFetchFn } from './connector-proxy';
export interface MarketplaceInstallResult {
    pluginId: string;
    manifest: PluginManifest;
    replaced: boolean;
}
export interface MarketplaceInstallOptions {
    fetchFn?: ConnectorFetchFn;
    timeoutMs?: number;
    maxSizeBytes?: number;
    replace?: boolean;
    /** If non-empty, only URLs from these hostnames are allowed. Case-insensitive. */
    allowedDomains?: string[];
}
export declare function downloadAndInstallPlugin(downloadUrl: string, pluginsDir: string, options?: MarketplaceInstallOptions): Promise<MarketplaceInstallResult>;
//# sourceMappingURL=marketplace-install.d.ts.map