import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { createPluginLoader } from '../plugin-loader';
import type { PluginLoader, LoadedPlugin } from '@lensing/types';
import * as fs from 'fs';
import * as path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const TEMP_PLUGINS_DIR = path.join(__dirname, 'temp-plugins');

describe('Plugin Loader', () => {
  let loader: PluginLoader;

  beforeEach(() => {
    // Create temporary plugins directory for tests
    if (!fs.existsSync(TEMP_PLUGINS_DIR)) {
      fs.mkdirSync(TEMP_PLUGINS_DIR, { recursive: true });
    }
  });

  afterEach(async () => {
    // Clean up
    if (fs.existsSync(TEMP_PLUGINS_DIR)) {
      fs.rmSync(TEMP_PLUGINS_DIR, { recursive: true, force: true });
    }
  });

  describe('Scanner', () => {
    it('should discover plugin.json manifests in /plugins/<id>/ directories', async () => {
      // Create test plugin directory structure
      const testPluginDir = path.join(TEMP_PLUGINS_DIR, 'test-widget');
      fs.mkdirSync(testPluginDir, { recursive: true });

      const manifestPath = path.join(testPluginDir, 'plugin.json');
      fs.writeFileSync(
        manifestPath,
        JSON.stringify({
          id: 'test-widget',
          name: 'Test Widget',
          version: '1.0.0',
        })
      );

      loader = createPluginLoader({ pluginsDir: TEMP_PLUGINS_DIR });
      const plugins = await loader.discover();

      expect(plugins).toHaveLength(1);
      expect(plugins[0].id).toBe('test-widget');
      expect(plugins[0].manifest.name).toBe('Test Widget');
    });

    it('should discover multiple plugins', async () => {
      const ids = ['weather', 'calendar', 'clock'];

      for (const id of ids) {
        const pluginDir = path.join(TEMP_PLUGINS_DIR, id);
        fs.mkdirSync(pluginDir, { recursive: true });
        fs.writeFileSync(
          path.join(pluginDir, 'plugin.json'),
          JSON.stringify({
            id,
            name: `${id} widget`,
            version: '1.0.0',
          })
        );
      }

      loader = createPluginLoader({ pluginsDir: TEMP_PLUGINS_DIR });
      const plugins = await loader.discover();

      expect(plugins).toHaveLength(3);
      expect(plugins.map((p) => p.id)).toEqual(
        expect.arrayContaining(['weather', 'calendar', 'clock'])
      );
    });

    it('should skip directories without plugin.json', async () => {
      const testDir = path.join(TEMP_PLUGINS_DIR, 'no-manifest');
      fs.mkdirSync(testDir, { recursive: true });
      fs.writeFileSync(path.join(testDir, 'other.json'), '{}');

      loader = createPluginLoader({ pluginsDir: TEMP_PLUGINS_DIR });
      const plugins = await loader.discover();

      expect(plugins).toHaveLength(0);
    });
  });

  describe('Validation', () => {
    it('should validate manifest against schema before loading', async () => {
      const testPluginDir = path.join(TEMP_PLUGINS_DIR, 'invalid');
      fs.mkdirSync(testPluginDir, { recursive: true });

      // Invalid: missing required 'id' field
      fs.writeFileSync(
        path.join(testPluginDir, 'plugin.json'),
        JSON.stringify({
          name: 'Invalid Plugin',
          version: '1.0.0',
        })
      );

      loader = createPluginLoader({ pluginsDir: TEMP_PLUGINS_DIR });
      const discovered = await loader.discover();

      // Should discover it but validation should fail
      const plugins = await loader.load();

      expect(plugins).toHaveLength(0);
    });

    it('should provide clear error messages for invalid manifests', async () => {
      const testPluginDir = path.join(TEMP_PLUGINS_DIR, 'bad');
      fs.mkdirSync(testPluginDir, { recursive: true });

      fs.writeFileSync(
        path.join(testPluginDir, 'plugin.json'),
        JSON.stringify({
          id: 'bad-plugin',
          name: 123, // Should be string
          version: '1.0.0',
        })
      );

      loader = createPluginLoader({ pluginsDir: TEMP_PLUGINS_DIR });
      const errors = await loader.getErrors();

      expect(errors.size).toBeGreaterThan(0);
      expect(errors.get('bad-plugin')).toBeDefined();
      expect(errors.get('bad-plugin')).toContain('must be a string');
    });
  });

  describe('Dynamic Imports', () => {
    it('should dynamically import UI components from ui_entry', async () => {
      const testPluginDir = path.join(TEMP_PLUGINS_DIR, 'ui-test');
      fs.mkdirSync(path.join(testPluginDir, 'dist'), { recursive: true });

      // Create a minimal JavaScript module
      const widgetCode = `export const Widget = { name: 'TestWidget' };`;
      fs.writeFileSync(path.join(testPluginDir, 'dist', 'widget.js'), widgetCode);

      fs.writeFileSync(
        path.join(testPluginDir, 'plugin.json'),
        JSON.stringify({
          id: 'ui-test',
          name: 'UI Test',
          version: '1.0.0',
          ui_entry: './dist/widget.js',
        })
      );

      loader = createPluginLoader({ pluginsDir: TEMP_PLUGINS_DIR });
      const plugins = await loader.load();

      expect(plugins).toHaveLength(1);
      const plugin = plugins[0];
      expect(plugin.ui_module).toBeDefined();
    });

    it('should dynamically import server modules from server_entry', async () => {
      const testPluginDir = path.join(TEMP_PLUGINS_DIR, 'server-test');
      fs.mkdirSync(path.join(testPluginDir, 'dist'), { recursive: true });

      const serverCode = `export const handler = async () => ({ status: 'ok' });`;
      fs.writeFileSync(path.join(testPluginDir, 'dist', 'server.js'), serverCode);

      fs.writeFileSync(
        path.join(testPluginDir, 'plugin.json'),
        JSON.stringify({
          id: 'server-test',
          name: 'Server Test',
          version: '1.0.0',
          server_entry: './dist/server.js',
        })
      );

      loader = createPluginLoader({ pluginsDir: TEMP_PLUGINS_DIR });
      const plugins = await loader.load();

      expect(plugins).toHaveLength(1);
      const plugin = plugins[0];
      expect(plugin.server_module).toBeDefined();
    });

    it('should gracefully handle missing UI modules', async () => {
      const testPluginDir = path.join(TEMP_PLUGINS_DIR, 'missing-ui');
      fs.mkdirSync(testPluginDir, { recursive: true });

      fs.writeFileSync(
        path.join(testPluginDir, 'plugin.json'),
        JSON.stringify({
          id: 'missing-ui',
          name: 'Missing UI',
          version: '1.0.0',
          ui_entry: './dist/widget.js', // File doesn't exist
        })
      );

      loader = createPluginLoader({ pluginsDir: TEMP_PLUGINS_DIR });
      const plugins = await loader.load();

      // Plugin should be marked as error, not crash loader
      expect(plugins).toHaveLength(0);
      const errors = await loader.getErrors();
      expect(errors.get('missing-ui')).toBeDefined();
      expect(errors.get('missing-ui')).toContain('Failed to load');
    });

    it('should gracefully handle broken server modules', async () => {
      const testPluginDir = path.join(TEMP_PLUGINS_DIR, 'broken-server');
      fs.mkdirSync(path.join(testPluginDir, 'dist'), { recursive: true });

      // Invalid JavaScript
      fs.writeFileSync(path.join(testPluginDir, 'dist', 'server.js'), 'export const handler = ][');

      fs.writeFileSync(
        path.join(testPluginDir, 'plugin.json'),
        JSON.stringify({
          id: 'broken-server',
          name: 'Broken Server',
          version: '1.0.0',
          server_entry: './dist/server.js',
        })
      );

      loader = createPluginLoader({ pluginsDir: TEMP_PLUGINS_DIR });
      const plugins = await loader.load();

      // Should not crash, plugin marked as error
      expect(plugins).toHaveLength(0);
      const errors = await loader.getErrors();
      expect(errors.get('broken-server')).toBeDefined();
    });
  });

  describe('Registry', () => {
    it('should track loaded plugins with manifest and modules', async () => {
      const testPluginDir = path.join(TEMP_PLUGINS_DIR, 'tracked');
      fs.mkdirSync(testPluginDir, { recursive: true });

      fs.writeFileSync(
        path.join(testPluginDir, 'plugin.json'),
        JSON.stringify({
          id: 'tracked',
          name: 'Tracked Plugin',
          version: '1.0.0',
          permissions: {
            allowed_domains: ['example.com'],
            max_refresh_ms: 60000,
          },
        })
      );

      loader = createPluginLoader({ pluginsDir: TEMP_PLUGINS_DIR });
      const plugins = await loader.load();

      expect(plugins).toHaveLength(1);
      const plugin = plugins[0];
      expect(plugin.manifest.id).toBe('tracked');
      expect(plugin.manifest.permissions?.allowed_domains).toContain('example.com');
      expect(plugin.status).toBe('loaded');
    });

    it('should return plugin by ID', async () => {
      const testPluginDir = path.join(TEMP_PLUGINS_DIR, 'lookup');
      fs.mkdirSync(testPluginDir, { recursive: true });

      fs.writeFileSync(
        path.join(testPluginDir, 'plugin.json'),
        JSON.stringify({
          id: 'lookup',
          name: 'Lookup Plugin',
          version: '1.0.0',
        })
      );

      loader = createPluginLoader({ pluginsDir: TEMP_PLUGINS_DIR });
      await loader.load();

      const plugin = loader.getPlugin('lookup');
      expect(plugin).toBeDefined();
      expect(plugin?.manifest.name).toBe('Lookup Plugin');
    });

    it('should return undefined for non-existent plugin', async () => {
      loader = createPluginLoader({ pluginsDir: TEMP_PLUGINS_DIR });
      await loader.load();

      const plugin = loader.getPlugin('does-not-exist');
      expect(plugin).toBeUndefined();
    });

    it('should get all loaded plugins', async () => {
      const ids = ['plugin-a', 'plugin-b', 'plugin-c'];

      for (const id of ids) {
        const pluginDir = path.join(TEMP_PLUGINS_DIR, id);
        fs.mkdirSync(pluginDir, { recursive: true });
        fs.writeFileSync(
          path.join(pluginDir, 'plugin.json'),
          JSON.stringify({
            id,
            name: `${id} Name`,
            version: '1.0.0',
          })
        );
      }

      loader = createPluginLoader({ pluginsDir: TEMP_PLUGINS_DIR });
      await loader.load();

      const all = loader.getAllPlugins();
      expect(all).toHaveLength(3);
      expect(all.map((p) => p.manifest.id)).toEqual(expect.arrayContaining(ids));
    });

    it('should track plugin status (loading, loaded, error)', async () => {
      const testPluginDir = path.join(TEMP_PLUGINS_DIR, 'status-test');
      fs.mkdirSync(testPluginDir, { recursive: true });

      fs.writeFileSync(
        path.join(testPluginDir, 'plugin.json'),
        JSON.stringify({
          id: 'status-test',
          name: 'Status Test',
          version: '1.0.0',
        })
      );

      loader = createPluginLoader({ pluginsDir: TEMP_PLUGINS_DIR });
      const plugins = await loader.load();

      const plugin = plugins[0];
      expect(['loading', 'loaded', 'error']).toContain(plugin.status);
      expect(plugin.status).toBe('loaded');
    });
  });

  describe('Multiple Plugins', () => {
    it('should load multiple plugins independently', async () => {
      const ids = ['widget-a', 'widget-b', 'widget-c'];

      for (const id of ids) {
        const pluginDir = path.join(TEMP_PLUGINS_DIR, id);
        fs.mkdirSync(pluginDir, { recursive: true });
        fs.writeFileSync(
          path.join(pluginDir, 'plugin.json'),
          JSON.stringify({
            id,
            name: `Widget ${id}`,
            version: '1.0.0',
            permissions: {
              max_refresh_ms: 1000 * Math.random(),
            },
          })
        );
      }

      loader = createPluginLoader({ pluginsDir: TEMP_PLUGINS_DIR });
      const plugins = await loader.load();

      expect(plugins).toHaveLength(3);
      expect(plugins.map((p) => p.manifest.id).sort()).toEqual(ids.sort());
    });

    it('should prevent errors in one plugin from affecting others', async () => {
      // Good plugin
      const goodDir = path.join(TEMP_PLUGINS_DIR, 'good-plugin');
      fs.mkdirSync(goodDir, { recursive: true });
      fs.writeFileSync(
        path.join(goodDir, 'plugin.json'),
        JSON.stringify({
          id: 'good-plugin',
          name: 'Good Plugin',
          version: '1.0.0',
        })
      );

      // Bad plugin (invalid manifest)
      const badDir = path.join(TEMP_PLUGINS_DIR, 'bad-plugin');
      fs.mkdirSync(badDir, { recursive: true });
      fs.writeFileSync(
        path.join(badDir, 'plugin.json'),
        JSON.stringify({
          name: 'Bad Plugin', // Missing 'id'
          version: '1.0.0',
        })
      );

      loader = createPluginLoader({ pluginsDir: TEMP_PLUGINS_DIR });
      const plugins = await loader.load();

      // Only good plugin should load
      expect(plugins).toHaveLength(1);
      expect(plugins[0].manifest.id).toBe('good-plugin');

      // Bad plugin error should be tracked
      const errors = await loader.getErrors();
      expect(errors.get('bad-plugin')).toBeDefined();
    });
  });

  describe('Unload', () => {
    it('should unload a plugin by ID', async () => {
      const testPluginDir = path.join(TEMP_PLUGINS_DIR, 'unload-test');
      fs.mkdirSync(testPluginDir, { recursive: true });

      fs.writeFileSync(
        path.join(testPluginDir, 'plugin.json'),
        JSON.stringify({
          id: 'unload-test',
          name: 'Unload Test',
          version: '1.0.0',
        })
      );

      loader = createPluginLoader({ pluginsDir: TEMP_PLUGINS_DIR });
      await loader.load();

      expect(loader.getPlugin('unload-test')).toBeDefined();

      await loader.unload('unload-test');

      expect(loader.getPlugin('unload-test')).toBeUndefined();
    });

    it('should silently ignore unload of non-existent plugin', async () => {
      loader = createPluginLoader({ pluginsDir: TEMP_PLUGINS_DIR });

      expect(async () => {
        await loader.unload('does-not-exist');
      }).not.toThrow();
    });
  });

  describe('Reload', () => {
    it('should reload all plugins', async () => {
      const testPluginDir = path.join(TEMP_PLUGINS_DIR, 'reload-test');
      fs.mkdirSync(testPluginDir, { recursive: true });

      fs.writeFileSync(
        path.join(testPluginDir, 'plugin.json'),
        JSON.stringify({
          id: 'reload-test',
          name: 'Reload Test v1',
          version: '1.0.0',
        })
      );

      loader = createPluginLoader({ pluginsDir: TEMP_PLUGINS_DIR });
      let plugins = await loader.load();
      expect(plugins).toHaveLength(1);
      expect(plugins[0].manifest.name).toBe('Reload Test v1');

      // Update manifest
      fs.writeFileSync(
        path.join(testPluginDir, 'plugin.json'),
        JSON.stringify({
          id: 'reload-test',
          name: 'Reload Test v2',
          version: '2.0.0',
        })
      );

      // Reload
      plugins = await loader.reload();
      expect(plugins).toHaveLength(1);
      expect(plugins[0].manifest.name).toBe('Reload Test v2');
    });
  });
});
