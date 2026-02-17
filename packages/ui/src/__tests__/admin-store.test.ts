import { describe, it, expect, beforeEach } from 'vitest';
import { createAdminStore, type AdminStore } from '../admin-store';
import type { PluginManifestWithConfig, ZoneName } from '@lensing/types';

function createMockManifest(
  id: string,
  overrides?: Partial<PluginManifestWithConfig>
): PluginManifestWithConfig {
  return {
    id,
    name: id.charAt(0).toUpperCase() + id.slice(1),
    version: '1.0.0',
    ...overrides,
  };
}

describe('AdminStore', () => {
  let store: AdminStore;

  beforeEach(() => {
    store = createAdminStore();
  });

  describe('plugin registration', () => {
    it('should register a plugin', () => {
      store.registerPlugin(createMockManifest('weather'));
      const plugins = store.getPlugins();

      expect(plugins.length).toBe(1);
      expect(plugins[0].plugin_id).toBe('weather');
      expect(plugins[0].enabled).toBe(true);
      expect(plugins[0].status).toBe('active');
    });

    it('should register multiple plugins', () => {
      store.registerPlugin(createMockManifest('weather'));
      store.registerPlugin(createMockManifest('calendar'));
      store.registerPlugin(createMockManifest('crypto'));

      expect(store.getPlugins().length).toBe(3);
    });

    it('should not register duplicate plugins', () => {
      store.registerPlugin(createMockManifest('weather'));
      store.registerPlugin(createMockManifest('weather'));

      expect(store.getPlugins().length).toBe(1);
    });

    it('should initialize config with defaults from schema', () => {
      store.registerPlugin(
        createMockManifest('weather', {
          config_schema: {
            fields: [
              { key: 'city', type: 'string', label: 'City', default: 'New York' },
              { key: 'units', type: 'select', label: 'Units', default: 'celsius' },
              { key: 'show_forecast', type: 'boolean', label: 'Show Forecast', default: true },
            ],
          },
        })
      );

      const plugin = store.getPlugin('weather');
      expect(plugin?.config).toEqual({
        city: 'New York',
        units: 'celsius',
        show_forecast: true,
      });
    });
  });

  describe('enable/disable', () => {
    it('should disable a plugin', () => {
      store.registerPlugin(createMockManifest('weather'));
      store.setEnabled('weather', false);

      const plugin = store.getPlugin('weather');
      expect(plugin?.enabled).toBe(false);
      expect(plugin?.status).toBe('disabled');
    });

    it('should re-enable a plugin', () => {
      store.registerPlugin(createMockManifest('weather'));
      store.setEnabled('weather', false);
      store.setEnabled('weather', true);

      const plugin = store.getPlugin('weather');
      expect(plugin?.enabled).toBe(true);
      expect(plugin?.status).toBe('active');
    });

    it('should not fail on unknown plugin', () => {
      expect(() => store.setEnabled('nonexistent', false)).not.toThrow();
    });
  });

  describe('config management', () => {
    it('should update plugin config', () => {
      store.registerPlugin(
        createMockManifest('weather', {
          config_schema: {
            fields: [{ key: 'city', type: 'string', label: 'City', default: 'NYC' }],
          },
        })
      );

      store.updateConfig('weather', { city: 'London' });
      expect(store.getPlugin('weather')?.config.city).toBe('London');
    });

    it('should merge config updates (not replace)', () => {
      store.registerPlugin(
        createMockManifest('weather', {
          config_schema: {
            fields: [
              { key: 'city', type: 'string', label: 'City', default: 'NYC' },
              { key: 'units', type: 'string', label: 'Units', default: 'celsius' },
            ],
          },
        })
      );

      store.updateConfig('weather', { city: 'London' });
      const config = store.getPlugin('weather')?.config;
      expect(config?.city).toBe('London');
      expect(config?.units).toBe('celsius'); // unchanged
    });

    it('should not fail on unknown plugin', () => {
      expect(() => store.updateConfig('nonexistent', { foo: 'bar' })).not.toThrow();
    });
  });

  describe('zone assignment', () => {
    it('should assign a plugin to a zone', () => {
      store.registerPlugin(createMockManifest('weather'));
      store.assignZone('weather', 'center');

      expect(store.getPlugin('weather')?.zone).toBe('center');
    });

    it('should move a plugin between zones', () => {
      store.registerPlugin(createMockManifest('weather'));
      store.assignZone('weather', 'center');
      store.assignZone('weather', 'left-col');

      expect(store.getPlugin('weather')?.zone).toBe('left-col');
    });

    it('should unassign a plugin from a zone', () => {
      store.registerPlugin(createMockManifest('weather'));
      store.assignZone('weather', 'center');
      store.assignZone('weather', undefined);

      expect(store.getPlugin('weather')?.zone).toBeUndefined();
    });

    it('should get plugins by zone', () => {
      store.registerPlugin(createMockManifest('weather'));
      store.registerPlugin(createMockManifest('calendar'));
      store.registerPlugin(createMockManifest('crypto'));

      store.assignZone('weather', 'center');
      store.assignZone('calendar', 'center');
      store.assignZone('crypto', 'right-col');

      const centerPlugins = store.getPluginsByZone('center');
      expect(centerPlugins.length).toBe(2);
      expect(centerPlugins.map((p) => p.plugin_id)).toContain('weather');
      expect(centerPlugins.map((p) => p.plugin_id)).toContain('calendar');
    });
  });

  describe('remove plugin', () => {
    it('should remove a plugin', () => {
      store.registerPlugin(createMockManifest('weather'));
      store.removePlugin('weather');

      expect(store.getPlugins().length).toBe(0);
      expect(store.getPlugin('weather')).toBeUndefined();
    });

    it('should not fail on unknown plugin', () => {
      expect(() => store.removePlugin('nonexistent')).not.toThrow();
    });
  });

  describe('error handling', () => {
    it('should set plugin error', () => {
      store.registerPlugin(createMockManifest('weather'));
      store.setError('weather', 'API key expired');

      const plugin = store.getPlugin('weather');
      expect(plugin?.status).toBe('error');
      expect(plugin?.error).toBe('API key expired');
    });

    it('should clear plugin error', () => {
      store.registerPlugin(createMockManifest('weather'));
      store.setError('weather', 'API key expired');
      store.clearError('weather');

      const plugin = store.getPlugin('weather');
      expect(plugin?.status).toBe('active');
      expect(plugin?.error).toBeUndefined();
    });
  });

  describe('change notifications', () => {
    it('should notify on plugin changes', () => {
      const changes: string[] = [];
      store = createAdminStore({
        onChange: (pluginId, action) => changes.push(`${pluginId}:${action}`),
      });

      store.registerPlugin(createMockManifest('weather'));
      store.setEnabled('weather', false);
      store.updateConfig('weather', { city: 'NYC' });
      store.assignZone('weather', 'center');
      store.removePlugin('weather');

      expect(changes).toEqual([
        'weather:registered',
        'weather:disabled',
        'weather:config_updated',
        'weather:zone_assigned',
        'weather:removed',
      ]);
    });
  });
});
