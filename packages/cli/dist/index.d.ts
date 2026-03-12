export declare const VERSION = "0.1.0";
export { validateManifest } from './manifest-validator';
export type { ValidationResult } from './manifest-validator';
export { createFixtureLoader } from './fixture-loader';
export type { FixtureLoader, FixtureLoaderOptions } from './fixture-loader';
export { createDevServer } from './dev-server';
export type { DevServer, DevServerOptions } from './dev-server';
export { createPluginScaffold, validatePluginName, generatePluginId, } from './commands/plugin-create';
export { listScenes, switchScene } from './commands/scene';
export type { ListScenesOptions, SwitchSceneOptions, SwitchSceneResult } from './commands/scene';
export { startServer } from './commands/start';
export type { StartServerOptions, StartServerResult } from './commands/start';
//# sourceMappingURL=index.d.ts.map