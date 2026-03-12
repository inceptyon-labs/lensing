import type { MarketplacePlugin, PluginAdminEntry } from '@lensing/types';
export interface MarketplaceUpdateInfo {
    pluginId: string;
    pluginName: string;
    currentVersion: string;
    newVersion: string;
    downloadUrl: string;
}
/**
 * Compare two semver version strings.
 * Returns 1 if a > b, -1 if a < b, 0 if equal.
 * Only compares major.minor.patch numeric parts.
 */
export declare function compareSemver(a: string, b: string): -1 | 0 | 1;
/**
 * Compare installed plugins against the marketplace to find available updates.
 * Returns only plugins where marketplace version > installed version.
 */
export declare function checkForUpdates(installed: PluginAdminEntry[], marketplace: MarketplacePlugin[]): MarketplaceUpdateInfo[];
//# sourceMappingURL=marketplace-updates.d.ts.map