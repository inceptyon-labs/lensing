import type { PluginManifest } from '@lensing/types';
import { validateManifest } from './manifest-validator';
import { createFixtureLoader } from './fixture-loader';

export interface DevServerOptions {
  pluginDir: string;
  fixturesDir: string;
  readFile: (path: string) => Promise<string>;
  readDir: () => Promise<string[]>;
  watch: (
    path: string,
    callback: (event: string, filename: string) => void
  ) => { close: () => void };
}

export interface DevServer {
  start(): Promise<void>;
  stop(): void;
  reload(): Promise<void>;
  isRunning(): boolean;
  getManifest(): PluginManifest | undefined;
  getFixtures(): Record<string, unknown>;
  onReload(callback: () => void): void;
}

export function createDevServer(options: DevServerOptions): DevServer {
  const { pluginDir, fixturesDir, readFile, readDir, watch } = options;

  let running = false;
  let manifest: PluginManifest | undefined;
  let fixtures: Record<string, unknown> = {};
  let watcher: { close: () => void } | undefined;
  const reloadCallbacks: Array<() => void> = [];

  const fixtureLoader = createFixtureLoader({
    fixturesDir,
    readDir,
    readFile,
  });

  async function loadManifest(): Promise<PluginManifest> {
    const manifestPath = `${pluginDir}/plugin.json`;
    const content = await readFile(manifestPath);
    const parsed = JSON.parse(content);
    const result = validateManifest(parsed);

    if (!result.valid) {
      throw new Error(`Invalid plugin manifest: ${result.errors.join(', ')}`);
    }

    return result.manifest!;
  }

  async function loadFixtures(): Promise<Record<string, unknown>> {
    return await fixtureLoader.loadAll();
  }

  function notifyReload() {
    for (const callback of reloadCallbacks) {
      callback();
    }
  }

  async function reload(): Promise<void> {
    if (!running) {
      throw new Error('Server is not running');
    }

    manifest = await loadManifest();
    fixtures = await loadFixtures();
    notifyReload();
  }

  async function start(): Promise<void> {
    if (running) return;

    manifest = await loadManifest();
    fixtures = await loadFixtures();

    watcher = watch(pluginDir, async (_event: string, _filename: string) => {
      await reload();
    });

    running = true;
  }

  function stop(): void {
    if (!running) return;

    if (watcher) {
      watcher.close();
      watcher = undefined;
    }

    running = false;
  }

  function isRunning(): boolean {
    return running;
  }

  function getManifest(): PluginManifest | undefined {
    return manifest;
  }

  function getFixtures(): Record<string, unknown> {
    return fixtures;
  }

  function onReload(callback: () => void): void {
    reloadCallbacks.push(callback);
  }

  return {
    start,
    stop,
    reload,
    isRunning,
    getManifest,
    getFixtures,
    onReload,
  };
}
