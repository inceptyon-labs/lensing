import type {
  PluginAdminEntry,
  PluginManifestWithConfig,
  ZoneName,
  PluginLoader,
  DatabaseInstance,
} from '@lensing/types';

export interface PluginAdminHandlersOptions {
  pluginLoader: PluginLoader;
  db: DatabaseInstance;
  onChange?: (pluginId: string, action: string) => void;
}

interface PluginPersistedState {
  enabled: boolean;
  config: Record<string, string | number | boolean>;
  zone?: ZoneName;
}

function getPersistedState(db: DatabaseInstance, pluginId: string): PluginPersistedState {
  const stored = db.getPluginState<PluginPersistedState>(pluginId);
  return stored ?? { enabled: true, config: {} };
}

function buildEntry(
  pluginId: string,
  manifest: PluginManifestWithConfig,
  loadStatus: 'loading' | 'loaded' | 'error',
  loadError: string | undefined,
  state: PluginPersistedState
): PluginAdminEntry {
  const { enabled, config, zone } = state;
  let status: PluginAdminEntry['status'];
  if (loadStatus === 'error') {
    status = 'error';
  } else if (loadStatus === 'loading') {
    status = 'loading';
  } else {
    status = enabled ? 'active' : 'disabled';
  }

  const entry: PluginAdminEntry = {
    plugin_id: pluginId,
    manifest,
    status,
    enabled,
    config,
  };

  if (zone !== undefined) entry.zone = zone;
  if (loadError !== undefined) entry.error = loadError;

  return entry;
}

export function createPluginAdminHandlers(options: PluginAdminHandlersOptions) {
  const { pluginLoader, db, onChange } = options;

  return {
    async getPlugins(): Promise<PluginAdminEntry[]> {
      return pluginLoader.getAllPlugins().map((plugin) => {
        const state = getPersistedState(db, plugin.manifest.id);
        return buildEntry(
          plugin.manifest.id,
          plugin.manifest as PluginManifestWithConfig,
          plugin.status,
          plugin.error,
          state
        );
      });
    },

    async getPlugin(id: string): Promise<PluginAdminEntry | undefined> {
      const plugin = pluginLoader.getPlugin(id);
      if (!plugin) return undefined;
      const state = getPersistedState(db, id);
      return buildEntry(
        id,
        plugin.manifest as PluginManifestWithConfig,
        plugin.status,
        plugin.error,
        state
      );
    },

    async setPluginEnabled(id: string, enabled: boolean): Promise<void> {
      const state = getPersistedState(db, id);
      db.setPluginState(id, { ...state, enabled });
      onChange?.(id, 'enabled');
    },

    async updatePluginConfig(id: string, config: Record<string, unknown>): Promise<void> {
      const state = getPersistedState(db, id);
      const safe: Record<string, string | number | boolean> = {};
      for (const [k, v] of Object.entries(config)) {
        if (typeof v === 'string' || typeof v === 'number' || typeof v === 'boolean') {
          safe[k] = v;
        }
      }
      db.setPluginState(id, { ...state, config: { ...state.config, ...safe } });
      onChange?.(id, 'config_updated');
    },

    async assignPluginZone(id: string, zone: ZoneName | undefined): Promise<void> {
      const state = getPersistedState(db, id);
      db.setPluginState(id, { ...state, zone });
      onChange?.(id, 'zone_assigned');
    },

    async reloadPlugins(): Promise<void> {
      await pluginLoader.reload();
    },
  };
}
