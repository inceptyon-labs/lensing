import type {
  PluginAdminEntry,
  PluginManifestWithConfig,
  ZoneName,
  PluginLoader,
  DatabaseInstance,
  ModuleSettingsSchema,
  ConfigField,
} from '@lensing/types';
import { MODULE_SCHEMAS, MODULE_IDS, getIntegrationFields } from '@lensing/types';
import { readModuleConfig } from './module-settings';
import { installPluginFromZip } from './plugin-install';

export interface PluginAdminHandlersOptions {
  pluginLoader: PluginLoader;
  db: DatabaseInstance;
  pluginsDir?: string;
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

const REDACTED = '••••••••';

function buildModuleEntry(db: DatabaseInstance, schema: ModuleSettingsSchema): PluginAdminEntry {
  const config = readModuleConfig(db, schema);
  const zoneState = db.getPluginState<PluginPersistedState>(schema.id);

  // Build manifest from schema
  const manifest: PluginManifestWithConfig = {
    id: schema.id,
    name: schema.name,
    version: 'built-in',
    config_schema: { fields: schema.fields as ConfigField[] },
  };

  // Redact password-typed fields
  const redactedConfig: Record<string, string | number | boolean> = {};
  for (const [key, value] of Object.entries(config.values)) {
    const field = schema.fields.find((f) => f.key === key);
    if (field?.type === 'password' && typeof value === 'string' && value !== '') {
      redactedConfig[key] = REDACTED;
    } else {
      redactedConfig[key] = value;
    }
  }

  // Compute integration_status
  const integrationFields = getIntegrationFields(schema);
  let integration_status: PluginAdminEntry['integration_status'];
  if (integrationFields.length === 0) {
    integration_status = 'not_needed';
  } else {
    const requiredFields = integrationFields.filter((f) => f.required);
    const allSet = requiredFields.every((f) => {
      const val = config.values[f.key];
      return val !== undefined && val !== '';
    });
    integration_status = allSet ? 'ready' : 'missing';
  }

  const entry: PluginAdminEntry = {
    plugin_id: schema.id,
    manifest,
    status: config.enabled ? 'active' : 'disabled',
    enabled: config.enabled,
    config: redactedConfig,
    builtin: true,
    integration_status,
  };

  if (zoneState?.zone !== undefined) entry.zone = zoneState.zone;

  return entry;
}

function isModuleId(id: string): boolean {
  return (MODULE_IDS as readonly string[]).includes(id);
}

export function createPluginAdminHandlers(options: PluginAdminHandlersOptions) {
  const { pluginLoader, db, pluginsDir, onChange } = options;

  return {
    async getPlugins(): Promise<PluginAdminEntry[]> {
      const pluginEntries = pluginLoader.getAllPlugins().map((plugin) => {
        const state = getPersistedState(db, plugin.manifest.id);
        return buildEntry(
          plugin.manifest.id,
          plugin.manifest as PluginManifestWithConfig,
          plugin.status,
          plugin.error,
          state
        );
      });

      const moduleEntries = MODULE_SCHEMAS.map((s) => buildModuleEntry(db, s));

      return [...pluginEntries, ...moduleEntries];
    },

    async getPlugin(id: string): Promise<PluginAdminEntry | undefined> {
      const plugin = pluginLoader.getPlugin(id);
      if (plugin) {
        const state = getPersistedState(db, id);
        return buildEntry(
          id,
          plugin.manifest as PluginManifestWithConfig,
          plugin.status,
          plugin.error,
          state
        );
      }

      // Check built-in modules
      const schema = MODULE_SCHEMAS.find((s) => s.id === id);
      if (schema) return buildModuleEntry(db, schema);

      return undefined;
    },

    async setPluginEnabled(id: string, enabled: boolean): Promise<void> {
      if (isModuleId(id)) {
        db.setSetting(`${id}.enabled`, String(enabled));
        onChange?.(id, 'enabled');
        return;
      }
      const state = getPersistedState(db, id);
      db.setPluginState(id, { ...state, enabled });
      onChange?.(id, 'enabled');
    },

    async updatePluginConfig(id: string, config: Record<string, unknown>): Promise<void> {
      if (isModuleId(id)) {
        for (const [key, value] of Object.entries(config)) {
          // Skip redacted placeholders
          if (String(value) === REDACTED) continue;
          if (
            typeof value === 'string' ||
            typeof value === 'number' ||
            typeof value === 'boolean'
          ) {
            db.setSetting(`${id}.${key}`, String(value));
          }
        }
        onChange?.(id, 'config_updated');
        return;
      }
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

    async installPlugin(zipBuffer: Buffer): Promise<PluginAdminEntry> {
      if (!pluginsDir) {
        throw new Error('Plugin installation not configured (no pluginsDir)');
      }
      const { pluginId, manifest } = installPluginFromZip(zipBuffer, pluginsDir);
      await pluginLoader.reload();
      onChange?.(pluginId, 'installed');
      const state = getPersistedState(db, pluginId);
      return buildEntry(pluginId, manifest as PluginManifestWithConfig, 'loaded', undefined, state);
    },
  };
}
