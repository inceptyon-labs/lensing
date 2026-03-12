import type { PluginLoader } from '@lensing/types';
import type { ConnectorRunnerInstance } from './connector-runner';
export interface PluginLoaderOptions {
    pluginsDir: string;
    connectorRunner?: ConnectorRunnerInstance;
}
export declare function createPluginLoader(options: PluginLoaderOptions): PluginLoader;
//# sourceMappingURL=plugin-loader.d.ts.map