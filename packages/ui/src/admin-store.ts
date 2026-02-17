import type { PluginManifestWithConfig, PluginAdminEntry, ZoneName } from '@lensing/types';

/** Options for creating admin store */
export interface AdminStoreOptions {
  onChange?: (pluginId: string, action: string) => void;
}

/** Admin store instance for managing plugin state */
export interface AdminStore {
  registerPlugin(manifest: PluginManifestWithConfig): void;
  getPlugins(): PluginAdminEntry[];
  getPlugin(pluginId: string): PluginAdminEntry | undefined;
  setEnabled(pluginId: string, enabled: boolean): void;
  updateConfig(pluginId: string, config: Record<string, unknown>): void;
  assignZone(pluginId: string, zone: ZoneName | undefined): void;
  getPluginsByZone(zone: ZoneName): PluginAdminEntry[];
  removePlugin(pluginId: string): void;
  setError(pluginId: string, error: string): void;
  clearError(pluginId: string): void;
}

/**
 * Creates a plugin admin store with registration, config management,
 * zone assignment, and change notifications.
 */
export function createAdminStore(options: AdminStoreOptions = {}): AdminStore {
  const { onChange } = options;
  const plugins = new Map<string, PluginAdminEntry>();

  function notify(pluginId: string, action: string) {
    onChange?.(pluginId, action);
  }

  function buildConfigFromSchema(
    manifest: PluginManifestWithConfig
  ): Record<string, string | number | boolean> {
    const config: Record<string, string | number | boolean> = {};
    if (manifest.config_schema) {
      for (const field of manifest.config_schema.fields) {
        if (field.default !== undefined) {
          config[field.key] = field.default;
        }
      }
    }
    return config;
  }

  return {
    registerPlugin(manifest) {
      if (plugins.has(manifest.id)) {
        return;
      }

      const entry: PluginAdminEntry = {
        plugin_id: manifest.id,
        manifest,
        status: 'active',
        enabled: true,
        config: buildConfigFromSchema(manifest),
      };

      plugins.set(manifest.id, entry);
      notify(manifest.id, 'registered');
    },

    getPlugins() {
      return Array.from(plugins.values());
    },

    getPlugin(pluginId) {
      return plugins.get(pluginId);
    },

    setEnabled(pluginId, enabled) {
      const plugin = plugins.get(pluginId);
      if (!plugin) return;

      plugin.enabled = enabled;
      plugin.status = enabled ? 'active' : 'disabled';
      notify(pluginId, enabled ? 'enabled' : 'disabled');
    },

    updateConfig(pluginId, config) {
      const plugin = plugins.get(pluginId);
      if (!plugin) return;

      plugin.config = { ...plugin.config, ...config };
      notify(pluginId, 'config_updated');
    },

    assignZone(pluginId, zone) {
      const plugin = plugins.get(pluginId);
      if (!plugin) return;

      plugin.zone = zone;
      notify(pluginId, 'zone_assigned');
    },

    getPluginsByZone(zone) {
      return Array.from(plugins.values()).filter((p) => p.zone === zone);
    },

    removePlugin(pluginId) {
      if (!plugins.has(pluginId)) return;

      plugins.delete(pluginId);
      notify(pluginId, 'removed');
    },

    setError(pluginId, error) {
      const plugin = plugins.get(pluginId);
      if (!plugin) return;

      plugin.status = 'error';
      plugin.error = error;
      notify(pluginId, 'error');
    },

    clearError(pluginId) {
      const plugin = plugins.get(pluginId);
      if (!plugin) return;

      plugin.status = plugin.enabled ? 'active' : 'disabled';
      plugin.error = undefined;
      notify(pluginId, 'error_cleared');
    },
  };
}
