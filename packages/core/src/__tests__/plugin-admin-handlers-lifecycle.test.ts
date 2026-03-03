import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { createPluginAdminHandlers } from '../plugin-admin-handlers';
import { createPluginLoader } from '../plugin-loader';
import type { PluginLoader, DatabaseInstance } from '@lensing/types';
import type { ConnectorRunnerInstance } from '../connector-runner';
import * as fs from 'fs';
import * as path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const TEMP_PLUGINS_DIR = path.join(__dirname, 'temp-admin-lifecycle');

function createMockDb(): DatabaseInstance {
  const state = new Map<string, unknown>();
  return {
    getSetting: (key) => state.get(key),
    setSetting: (key, value) => {
      state.set(key, value);
    },
    getPluginState: (id) => state.get(`plugin:${id}`) as any,
    setPluginState: (id, value) => {
      state.set(`plugin:${id}`, value);
    },
    getPhotos: () => [],
    findPhotos: () => [],
    getAllScenes: () => [],
    getScene: () => undefined,
    upsertScene: vi.fn(),
    deleteScene: vi.fn(),
  } as any;
}

describe('Plugin Admin Handlers — Connector Lifecycle', () => {
  let mockConnectorRunner: ConnectorRunnerInstance;
  let mockDb: DatabaseInstance;

  beforeEach(() => {
    if (!fs.existsSync(TEMP_PLUGINS_DIR)) {
      fs.mkdirSync(TEMP_PLUGINS_DIR, { recursive: true });
    }
    mockConnectorRunner = {
      register: vi.fn(),
      unregister: vi.fn(),
      close: vi.fn(),
    };
    mockDb = createMockDb();
  });

  afterEach(() => {
    if (fs.existsSync(TEMP_PLUGINS_DIR)) {
      fs.rmSync(TEMP_PLUGINS_DIR, { recursive: true, force: true });
    }
  });

  function createPluginWithConnector(id: string, connectorType = 'json_api') {
    const dir = path.join(TEMP_PLUGINS_DIR, id);
    fs.mkdirSync(dir, { recursive: true });
    fs.writeFileSync(
      path.join(dir, 'plugin.json'),
      JSON.stringify({ id, name: `${id} Widget`, version: '1.0.0' })
    );
    fs.writeFileSync(
      path.join(dir, 'connector.json'),
      JSON.stringify({
        type: connectorType,
        url: `https://api.example.com/${id}`,
        refreshInterval: 60,
      })
    );
    return dir;
  }

  describe('enable/disable with connector lifecycle', () => {
    it('calls unregister when a plugin with a connector is disabled', async () => {
      createPluginWithConnector('api-widget');
      const loader = createPluginLoader({
        pluginsDir: TEMP_PLUGINS_DIR,
        connectorRunner: mockConnectorRunner,
      });
      await loader.load();

      const handlers = createPluginAdminHandlers({
        pluginLoader: loader,
        db: mockDb,
        pluginsDir: TEMP_PLUGINS_DIR,
        connectorRunner: mockConnectorRunner,
      });
      await handlers.setPluginEnabled('api-widget', false);

      expect(mockConnectorRunner.unregister).toHaveBeenCalledWith('api-widget');
    });

    it('calls register when a plugin with a connector is enabled', async () => {
      createPluginWithConnector('api-widget');
      const loader = createPluginLoader({
        pluginsDir: TEMP_PLUGINS_DIR,
        connectorRunner: mockConnectorRunner,
      });
      await loader.load();

      // First disable it
      const handlers = createPluginAdminHandlers({
        pluginLoader: loader,
        db: mockDb,
        pluginsDir: TEMP_PLUGINS_DIR,
        connectorRunner: mockConnectorRunner,
      });
      await handlers.setPluginEnabled('api-widget', false);
      expect(mockConnectorRunner.unregister).toHaveBeenCalledTimes(1);

      // Then enable it again
      await handlers.setPluginEnabled('api-widget', true);

      expect(mockConnectorRunner.register).toHaveBeenCalled();
    });

    it('calls unregister (safe no-op) when disabling a plugin without a connector', async () => {
      const dir = path.join(TEMP_PLUGINS_DIR, 'static-widget');
      fs.mkdirSync(dir, { recursive: true });
      fs.writeFileSync(
        path.join(dir, 'plugin.json'),
        JSON.stringify({ id: 'static-widget', name: 'Static Widget', version: '1.0.0' })
      );

      const loader = createPluginLoader({
        pluginsDir: TEMP_PLUGINS_DIR,
        connectorRunner: mockConnectorRunner,
      });
      await loader.load();

      const handlers = createPluginAdminHandlers({
        pluginLoader: loader,
        db: mockDb,
        pluginsDir: TEMP_PLUGINS_DIR,
        connectorRunner: mockConnectorRunner,
      });
      await handlers.setPluginEnabled('static-widget', false);

      // unregister is called unconditionally on disable — ConnectorRunner guards internally
      expect(mockConnectorRunner.unregister).toHaveBeenCalledWith('static-widget');
    });

    it('unregisters a connector when plugin is deleted', async () => {
      createPluginWithConnector('temp-widget');
      const loader = createPluginLoader({
        pluginsDir: TEMP_PLUGINS_DIR,
        connectorRunner: mockConnectorRunner,
      });
      await loader.load();

      const handlers = createPluginAdminHandlers({
        pluginLoader: loader,
        db: mockDb,
        pluginsDir: TEMP_PLUGINS_DIR,
      });
      const dir = path.join(TEMP_PLUGINS_DIR, 'temp-widget');
      fs.rmSync(dir, { recursive: true });
      await loader.reload();

      // After reload, plugin is gone, connector should be unregistered
      expect(mockConnectorRunner.unregister).toHaveBeenCalledWith('temp-widget');
    });

    it('tracks enabled state separately from connector registration', async () => {
      createPluginWithConnector('api-widget');
      const loader = createPluginLoader({
        pluginsDir: TEMP_PLUGINS_DIR,
        connectorRunner: mockConnectorRunner,
      });
      await loader.load();

      const handlers = createPluginAdminHandlers({
        pluginLoader: loader,
        db: mockDb,
        pluginsDir: TEMP_PLUGINS_DIR,
      });

      // Get initial state (should be enabled by default)
      let entry = await handlers.getPlugin('api-widget');
      expect(entry?.enabled).toBe(true);

      // Disable
      await handlers.setPluginEnabled('api-widget', false);
      entry = await handlers.getPlugin('api-widget');
      expect(entry?.enabled).toBe(false);

      // Enable again
      await handlers.setPluginEnabled('api-widget', true);
      entry = await handlers.getPlugin('api-widget');
      expect(entry?.enabled).toBe(true);
    });

    it('disabled connector stays unregistered after reloadPlugins', async () => {
      createPluginWithConnector('api-widget');
      const loader = createPluginLoader({
        pluginsDir: TEMP_PLUGINS_DIR,
        connectorRunner: mockConnectorRunner,
      });
      await loader.load();

      const handlers = createPluginAdminHandlers({
        pluginLoader: loader,
        db: mockDb,
        pluginsDir: TEMP_PLUGINS_DIR,
        connectorRunner: mockConnectorRunner,
      });

      // Disable the plugin
      await handlers.setPluginEnabled('api-widget', false);
      (mockConnectorRunner.unregister as ReturnType<typeof vi.fn>).mockClear();
      (mockConnectorRunner.register as ReturnType<typeof vi.fn>).mockClear();

      // Reload all plugins
      await handlers.reloadPlugins();

      // Loader re-registers connectors, but admin handler should
      // unregister disabled plugins' connectors afterward
      expect(mockConnectorRunner.unregister).toHaveBeenCalledWith('api-widget');
    });
  });
});
