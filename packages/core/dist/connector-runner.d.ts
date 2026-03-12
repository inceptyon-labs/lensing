import type { PluginManifest, DataBusInstance } from '@lensing/types';
import type { PluginSchedulerInstance } from './plugin-scheduler';
import type { ConnectorFetchFn } from './connector-proxy';
/** Connector configuration as stored in a plugin's connector.json */
export interface ConnectorRunnerConfig {
    type: string;
    url: string;
    method?: string;
    headers?: Record<string, string>;
    refreshInterval?: number;
    /** For static connectors: pre-defined data to publish immediately */
    data?: Record<string, unknown>;
}
export interface ConnectorRunnerOptions {
    dataBus: DataBusInstance;
    scheduler: PluginSchedulerInstance;
    /** Injectable fetch function (default: global fetch) */
    fetchFn?: ConnectorFetchFn;
    /** Allow private/local IPs — for home-lab setups (default: false) */
    allowPrivate?: boolean;
    /** Resolve {{NAME}} secret placeholders for a given plugin */
    secretResolver?: (pluginId: string, name: string) => Promise<string>;
}
export interface ConnectorRunnerInstance {
    /**
     * Register a plugin's connector with the scheduler.
     * For static connectors, publishes data immediately without scheduling.
     */
    register(pluginId: string, manifest: PluginManifest, config: ConnectorRunnerConfig): void;
    /** Stop and remove a plugin from the scheduler. */
    unregister(pluginId: string): void;
    /** Stop and remove all registered plugins. */
    close(): void;
}
/** Create a connector runner that bridges plugin connectors to the scheduler and data bus. */
export declare function createConnectorRunner(options: ConnectorRunnerOptions): ConnectorRunnerInstance;
//# sourceMappingURL=connector-runner.d.ts.map