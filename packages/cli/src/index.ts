export const VERSION = '0.1.0';

export { validateManifest } from './manifest-validator';
export type { ValidationResult } from './manifest-validator';
export { createFixtureLoader } from './fixture-loader';
export type { FixtureLoader, FixtureLoaderOptions } from './fixture-loader';
export { createDevServer } from './dev-server';
export type { DevServer, DevServerOptions } from './dev-server';

// CLI commands: dev, start, plugin, config, scene, agent, health, logs
// Note: shebang (#!/usr/bin/env node) will be added by build tool (tsup) when CLI is implemented
