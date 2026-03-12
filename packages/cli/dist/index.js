export const VERSION = '0.1.0';
export { validateManifest } from './manifest-validator';
export { createFixtureLoader } from './fixture-loader';
export { createDevServer } from './dev-server';
export { createPluginScaffold, validatePluginName, generatePluginId, } from './commands/plugin-create';
export { listScenes, switchScene } from './commands/scene';
export { startServer } from './commands/start';
// CLI commands: dev, start, plugin, config, scene, agent, health, logs
// Note: shebang (#!/usr/bin/env node) will be added by build tool (tsup) when CLI is implemented
//# sourceMappingURL=index.js.map