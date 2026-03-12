import type { PluginManifestWithConfig, PluginAdminEntry, ZoneName } from '@lensing/types';
/** Options for creating admin store */
export interface AdminStoreOptions {
    onChange?: (pluginId: string, action: string) => void;
}
/** Admin store instance for managing plugin state */
export interface AdminStore {
    registerPlugin(manifest: PluginManifestWithConfig): void;
    getPlugins(): PluginAdminEntry[];
    getPlugin(pluginId: string): PluginAdminEntry | undefined;
    setEnabled(pluginId: string, enabled: boolean): void;
    updateConfig(pluginId: string, config: Record<string, string | number | boolean>): void;
    assignZone(pluginId: string, zone: ZoneName | undefined): void;
    getPluginsByZone(zone: ZoneName): PluginAdminEntry[];
    removePlugin(pluginId: string): void;
    setError(pluginId: string, error: string): void;
    clearError(pluginId: string): void;
}
/**
 * Creates a plugin admin store with registration, config management,
 * zone assignment, and change notifications.
 */
export declare function createAdminStore(options?: AdminStoreOptions): AdminStore;
//# sourceMappingURL=admin-store.d.ts.map