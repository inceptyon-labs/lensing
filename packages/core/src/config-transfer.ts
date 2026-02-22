import type {
  ConfigTransferOptions,
  ConfigTransferInstance,
  ConfigExportV1,
  ImportResult,
  ZoneConfig,
} from '@lensing/types';
import { CURRENT_CONFIG_VERSION } from '@lensing/types';

// ── Factory ────────────────────────────────────────────────────────────────

export function createConfigTransfer(options: ConfigTransferOptions): ConfigTransferInstance {
  const { database } = options;

  return {
    async exportConfig(): Promise<ConfigExportV1> {
      const settings = { ...database.getAllSettings() };
      const rawLayouts = database.getAllLayouts();
      const layouts: Record<string, ZoneConfig[]> = {};
      for (const [name, zones] of Object.entries(rawLayouts)) {
        layouts[name] = zones.map((z) => ({ ...z }));
      }
      const rawStates = database.getAllPluginStates();
      const pluginState: Record<string, unknown> = {};
      for (const [id, state] of Object.entries(rawStates)) {
        pluginState[id] = state;
      }

      return {
        version: 1,
        exportedAt: new Date().toISOString(),
        schemaVersion: database.getSchemaVersion(),
        settings,
        layouts,
        pluginState,
      };
    },

    async importConfig(data: unknown): Promise<ImportResult> {
      if (data === null || typeof data !== 'object') {
        return { success: false, migrationsApplied: 0 };
      }

      const raw = data as Record<string, unknown>;

      if (typeof raw['version'] !== 'number') {
        return { success: false, migrationsApplied: 0 };
      }

      if (raw['version'] > CURRENT_CONFIG_VERSION) {
        return { success: false, migrationsApplied: 0 };
      }

      const payload = raw as ConfigExportV1;

      if (payload.settings && typeof payload.settings === 'object') {
        for (const [key, value] of Object.entries(payload.settings)) {
          if (typeof value === 'string') {
            database.setSetting(key, value);
          }
        }
      }

      if (payload.layouts && typeof payload.layouts === 'object') {
        for (const [name, zones] of Object.entries(payload.layouts)) {
          if (Array.isArray(zones)) {
            database.setLayout(name, zones as ZoneConfig[]);
          }
        }
      }

      if (payload.pluginState && typeof payload.pluginState === 'object') {
        for (const [id, state] of Object.entries(payload.pluginState)) {
          database.setPluginState(id, state);
        }
      }

      return { success: true, migrationsApplied: 0 };
    },

    async resetConfig(): Promise<void> {
      for (const key of Object.keys(database.getAllSettings())) {
        database.deleteSetting(key);
      }
      for (const name of Object.keys(database.getAllLayouts())) {
        database.deleteLayout(name);
      }
      for (const id of Object.keys(database.getAllPluginStates())) {
        database.deletePluginState(id);
      }
    },
  };
}
