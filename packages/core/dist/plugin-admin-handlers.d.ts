import type { PluginAdminEntry, ZoneName, PluginLoader, DatabaseInstance } from '@lensing/types';
import { type BuilderSaveInput } from './plugin-save';
import type { ConnectorRunnerInstance } from './connector-runner';
import type { SecretStore } from './secret-store';
export interface PluginAdminHandlersOptions {
    pluginLoader: PluginLoader;
    db: DatabaseInstance;
    pluginsDir?: string;
    onChange?: (pluginId: string, action: string) => void;
    connectorRunner?: ConnectorRunnerInstance;
    secretStore?: SecretStore;
}
export declare function createPluginAdminHandlers(options: PluginAdminHandlersOptions): {
    getPlugins(): Promise<PluginAdminEntry[]>;
    getPlugin(id: string): Promise<PluginAdminEntry | undefined>;
    setPluginEnabled(id: string, enabled: boolean): Promise<void>;
    updatePluginConfig(id: string, config: Record<string, unknown>): Promise<void>;
    assignPluginZone(id: string, zone: ZoneName | undefined): Promise<void>;
    reloadPlugins(): Promise<void>;
    installPlugin(zipBuffer: Buffer): Promise<PluginAdminEntry>;
    getPluginTemplate(pluginId: string): Promise<{
        html: string;
        css: string;
    } | undefined>;
    getPluginSource(pluginId: string): Promise<{
        html: string;
        css: string;
        connector?: {
            type: string;
            url: string;
            method?: string;
            headers?: Record<string, string>;
            refreshInterval?: number;
        };
    } | undefined>;
    saveBuiltPlugin(input: BuilderSaveInput): Promise<PluginAdminEntry>;
    getPluginSecretNames(id: string): Promise<string[]>;
    setPluginSecret(id: string, key: string, value: string): Promise<void>;
    deletePluginSecret(id: string, key: string): Promise<void>;
    deletePlugin(id: string): Promise<void>;
};
//# sourceMappingURL=plugin-admin-handlers.d.ts.map