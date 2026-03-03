import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { createPluginLoader } from '../plugin-loader';
import type { ConnectorRunnerInstance } from '../connector-runner';
import * as fs from 'fs';
import * as path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const TEMP_PLUGINS_DIR = path.join(__dirname, 'temp-connector-plugins');

function makeManifest(id: string, extra: Record<string, unknown> = {}) {
  return JSON.stringify({ id, name: `${id} Widget`, version: '1.0.0', ...extra });
}

function makeConnector(config: Record<string, unknown>) {
  return JSON.stringify(config);
}

function createPluginDir(id: string, manifest = makeManifest(id), connector?: string) {
  const dir = path.join(TEMP_PLUGINS_DIR, id);
  fs.mkdirSync(dir, { recursive: true });
  fs.writeFileSync(path.join(dir, 'plugin.json'), manifest);
  if (connector !== undefined) {
    fs.writeFileSync(path.join(dir, 'connector.json'), connector);
  }
  return dir;
}

describe('Plugin Loader — Connector Integration', () => {
  let mockRunner: ConnectorRunnerInstance;

  beforeEach(() => {
    if (!fs.existsSync(TEMP_PLUGINS_DIR)) {
      fs.mkdirSync(TEMP_PLUGINS_DIR, { recursive: true });
    }
    mockRunner = {
      register: vi.fn(),
      unregister: vi.fn(),
      close: vi.fn(),
    };
  });

  afterEach(() => {
    if (fs.existsSync(TEMP_PLUGINS_DIR)) {
      fs.rmSync(TEMP_PLUGINS_DIR, { recursive: true, force: true });
    }
  });

  describe('connector.json discovery', () => {
    it('loads without a connectorRunner when no connector.json exists', async () => {
      createPluginDir('no-connector');
      const loader = createPluginLoader({ pluginsDir: TEMP_PLUGINS_DIR });
      const plugins = await loader.load();
      expect(plugins).toHaveLength(1);
      expect(plugins[0].status).toBe('loaded');
    });

    it('loads without a connectorRunner even when connector.json exists', async () => {
      createPluginDir(
        'static-no-runner',
        makeManifest('static-no-runner'),
        makeConnector({ type: 'static_data', url: '' })
      );
      const loader = createPluginLoader({ pluginsDir: TEMP_PLUGINS_DIR });
      const plugins = await loader.load();
      // Should load fine — connector registration is optional
      expect(plugins).toHaveLength(1);
      expect(plugins[0].status).toBe('loaded');
    });

    it('calls register for a plugin that has connector.json', async () => {
      createPluginDir(
        'api-widget',
        makeManifest('api-widget'),
        makeConnector({
          type: 'json_api',
          url: 'https://api.example.com/data',
          refreshInterval: 60,
        })
      );
      const loader = createPluginLoader({
        pluginsDir: TEMP_PLUGINS_DIR,
        connectorRunner: mockRunner,
      });
      await loader.load();

      expect(mockRunner.register).toHaveBeenCalledOnce();
      expect(mockRunner.register).toHaveBeenCalledWith(
        'api-widget',
        expect.objectContaining({ id: 'api-widget' }),
        expect.objectContaining({
          type: 'json_api',
          url: 'https://api.example.com/data',
          refreshInterval: 60,
        })
      );
    });

    it('does NOT call register for a plugin without connector.json', async () => {
      createPluginDir('no-connector');
      const loader = createPluginLoader({
        pluginsDir: TEMP_PLUGINS_DIR,
        connectorRunner: mockRunner,
      });
      await loader.load();
      expect(mockRunner.register).not.toHaveBeenCalled();
    });

    it('registers all plugins that have connectors', async () => {
      createPluginDir(
        'widget-a',
        makeManifest('widget-a'),
        makeConnector({ type: 'json_api', url: 'https://a.example.com' })
      );
      createPluginDir(
        'widget-b',
        makeManifest('widget-b'),
        makeConnector({ type: 'rss_feed', url: 'https://b.example.com/feed.xml' })
      );
      createPluginDir('widget-c'); // no connector

      const loader = createPluginLoader({
        pluginsDir: TEMP_PLUGINS_DIR,
        connectorRunner: mockRunner,
      });
      await loader.load();

      expect(mockRunner.register).toHaveBeenCalledTimes(2);
      const calls = (mockRunner.register as ReturnType<typeof vi.fn>).mock.calls;
      const registeredIds = calls.map((c: unknown[]) => c[0] as string);
      expect(registeredIds).toContain('widget-a');
      expect(registeredIds).toContain('widget-b');
      expect(registeredIds).not.toContain('widget-c');
    });
  });

  describe('connector.json parsing', () => {
    it('passes full connector config to register', async () => {
      createPluginDir(
        'full-config',
        makeManifest('full-config'),
        makeConnector({
          type: 'json_api',
          url: 'https://api.example.com/data',
          method: 'POST',
          headers: { 'X-Api-Key': 'secret' },
          refreshInterval: 300,
        })
      );
      const loader = createPluginLoader({
        pluginsDir: TEMP_PLUGINS_DIR,
        connectorRunner: mockRunner,
      });
      await loader.load();

      expect(mockRunner.register).toHaveBeenCalledWith(
        'full-config',
        expect.any(Object),
        expect.objectContaining({
          type: 'json_api',
          url: 'https://api.example.com/data',
          method: 'POST',
          headers: { 'X-Api-Key': 'secret' },
          refreshInterval: 300,
        })
      );
    });

    it('handles static_data connector type', async () => {
      createPluginDir(
        'static-widget',
        makeManifest('static-widget'),
        makeConnector({ type: 'static_data', url: '', data: { value: 42, label: 'hello' } })
      );
      const loader = createPluginLoader({
        pluginsDir: TEMP_PLUGINS_DIR,
        connectorRunner: mockRunner,
      });
      await loader.load();

      expect(mockRunner.register).toHaveBeenCalledWith(
        'static-widget',
        expect.any(Object),
        expect.objectContaining({ type: 'static_data' })
      );
    });

    it('gracefully skips a plugin with malformed connector.json (plugin still loads)', async () => {
      createPluginDir('bad-connector', makeManifest('bad-connector'), 'NOT VALID JSON {{{');
      const loader = createPluginLoader({
        pluginsDir: TEMP_PLUGINS_DIR,
        connectorRunner: mockRunner,
      });
      const plugins = await loader.load();

      // Plugin itself should still load — connector failure is non-fatal
      expect(plugins).toHaveLength(1);
      expect(plugins[0].status).toBe('loaded');
      // No register call for malformed connector
      expect(mockRunner.register).not.toHaveBeenCalled();
    });
  });

  describe('unload', () => {
    it('calls unregister when a plugin with a connector is unloaded', async () => {
      createPluginDir(
        'to-unload',
        makeManifest('to-unload'),
        makeConnector({ type: 'json_api', url: 'https://api.example.com/data' })
      );
      const loader = createPluginLoader({
        pluginsDir: TEMP_PLUGINS_DIR,
        connectorRunner: mockRunner,
      });
      await loader.load();

      await loader.unload('to-unload');

      expect(mockRunner.unregister).toHaveBeenCalledWith('to-unload');
    });

    it('does NOT call unregister when unloading a plugin without a connector', async () => {
      createPluginDir('no-connector-unload');
      const loader = createPluginLoader({
        pluginsDir: TEMP_PLUGINS_DIR,
        connectorRunner: mockRunner,
      });
      await loader.load();

      await loader.unload('no-connector-unload');

      expect(mockRunner.unregister).not.toHaveBeenCalled();
    });
  });

  describe('reload', () => {
    it('unregisters old connectors and re-registers on reload', async () => {
      createPluginDir(
        'reload-widget',
        makeManifest('reload-widget'),
        makeConnector({ type: 'json_api', url: 'https://api.example.com/v1' })
      );
      const loader = createPluginLoader({
        pluginsDir: TEMP_PLUGINS_DIR,
        connectorRunner: mockRunner,
      });
      await loader.load();

      // Update connector URL
      const dir = path.join(TEMP_PLUGINS_DIR, 'reload-widget');
      fs.writeFileSync(
        path.join(dir, 'connector.json'),
        makeConnector({ type: 'json_api', url: 'https://api.example.com/v2' })
      );

      await loader.reload();

      // Should have unregistered and re-registered
      expect(mockRunner.unregister).toHaveBeenCalledWith('reload-widget');
      expect(mockRunner.register).toHaveBeenCalledTimes(2); // once on load, once on reload
      const lastCall = (mockRunner.register as ReturnType<typeof vi.fn>).mock.calls.at(-1)!;
      expect(lastCall[2]).toMatchObject({ url: 'https://api.example.com/v2' });
    });
  });
});
