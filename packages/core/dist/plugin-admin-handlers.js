import * as fs from 'fs';
import * as path from 'path';
import { MODULE_SCHEMAS, MODULE_IDS, getIntegrationFields } from '@lensing/types';
import { readModuleConfig } from './module-settings';
import { installPluginFromZip } from './plugin-install';
import { savePluginFromBuilder } from './plugin-save';
function getPersistedState(db, pluginId) {
    const stored = db.getPluginState(pluginId);
    return stored ?? { enabled: true, config: {} };
}
function buildEntry(pluginId, manifest, loadStatus, loadError, state) {
    const { enabled, config, zone } = state;
    let status;
    if (loadStatus === 'error') {
        status = 'error';
    }
    else if (loadStatus === 'loading') {
        status = 'loading';
    }
    else {
        status = enabled ? 'active' : 'disabled';
    }
    const entry = {
        plugin_id: pluginId,
        manifest,
        status,
        enabled,
        config,
    };
    if (zone !== undefined)
        entry.zone = zone;
    if (loadError !== undefined)
        entry.error = loadError;
    return entry;
}
const REDACTED = '••••••••';
function buildModuleEntry(db, schema) {
    const config = readModuleConfig(db, schema);
    const zoneState = db.getPluginState(schema.id);
    // Build manifest from schema
    const manifest = {
        id: schema.id,
        name: schema.name,
        description: schema.description,
        version: 'built-in',
        config_schema: {
            fields: schema.fields,
            ...(schema.setupGuide ? { setupGuide: schema.setupGuide } : {}),
        },
    };
    // Redact password-typed fields
    const redactedConfig = {};
    for (const [key, value] of Object.entries(config.values)) {
        const field = schema.fields.find((f) => f.key === key);
        if (field?.type === 'password' && typeof value === 'string' && value !== '') {
            redactedConfig[key] = REDACTED;
        }
        else {
            redactedConfig[key] = value;
        }
    }
    // Compute integration_status
    const integrationFields = getIntegrationFields(schema);
    let integration_status;
    if (integrationFields.length === 0) {
        integration_status = 'not_needed';
    }
    else {
        const requiredFields = integrationFields.filter((f) => f.required);
        const allSet = requiredFields.every((f) => {
            const val = config.values[f.key];
            return val !== undefined && val !== '';
        });
        integration_status = allSet ? 'ready' : 'missing';
    }
    const entry = {
        plugin_id: schema.id,
        manifest,
        status: 'active',
        config: redactedConfig,
        builtin: true,
        integration_status,
    };
    if (zoneState?.zone !== undefined)
        entry.zone = zoneState.zone;
    return entry;
}
function isModuleId(id) {
    return MODULE_IDS.includes(id);
}
export function createPluginAdminHandlers(options) {
    const { pluginLoader, db, pluginsDir, onChange, connectorRunner, secretStore } = options;
    return {
        async getPlugins() {
            const pluginEntries = pluginLoader.getAllPlugins().map((plugin) => {
                const state = getPersistedState(db, plugin.manifest.id);
                return buildEntry(plugin.manifest.id, plugin.manifest, plugin.status, plugin.error, state);
            });
            const moduleEntries = MODULE_SCHEMAS.map((s) => buildModuleEntry(db, s));
            return [...pluginEntries, ...moduleEntries];
        },
        async getPlugin(id) {
            const plugin = pluginLoader.getPlugin(id);
            if (plugin) {
                const state = getPersistedState(db, id);
                return buildEntry(id, plugin.manifest, plugin.status, plugin.error, state);
            }
            // Check built-in modules
            const schema = MODULE_SCHEMAS.find((s) => s.id === id);
            if (schema)
                return buildModuleEntry(db, schema);
            return undefined;
        },
        async setPluginEnabled(id, enabled) {
            if (isModuleId(id)) {
                // Built-in modules are now grid-driven — ignore enabled toggle
                return;
            }
            const state = getPersistedState(db, id);
            db.setPluginState(id, { ...state, enabled });
            if (connectorRunner && pluginsDir) {
                const connectorPath = path.join(pluginsDir, id, 'connector.json');
                if (enabled) {
                    if (fs.existsSync(connectorPath)) {
                        try {
                            const config = JSON.parse(fs.readFileSync(connectorPath, 'utf-8'));
                            const plugin = pluginLoader.getPlugin(id);
                            if (plugin)
                                connectorRunner.register(id, plugin.manifest, config);
                        }
                        catch {
                            // Non-fatal: malformed connector.json
                        }
                    }
                }
                else {
                    connectorRunner.unregister(id);
                }
            }
            onChange?.(id, 'enabled');
        },
        async updatePluginConfig(id, config) {
            if (isModuleId(id)) {
                for (const [key, value] of Object.entries(config)) {
                    // Skip redacted placeholders
                    if (String(value) === REDACTED)
                        continue;
                    if (typeof value === 'string' ||
                        typeof value === 'number' ||
                        typeof value === 'boolean') {
                        db.setSetting(`${id}.${key}`, String(value));
                    }
                }
                onChange?.(id, 'config_updated');
                return;
            }
            const state = getPersistedState(db, id);
            const safe = {};
            for (const [k, v] of Object.entries(config)) {
                if (typeof v === 'string' || typeof v === 'number' || typeof v === 'boolean') {
                    safe[k] = v;
                }
            }
            db.setPluginState(id, { ...state, config: { ...state.config, ...safe } });
            onChange?.(id, 'config_updated');
        },
        async assignPluginZone(id, zone) {
            const state = getPersistedState(db, id);
            db.setPluginState(id, { ...state, zone });
            onChange?.(id, 'zone_assigned');
        },
        async reloadPlugins() {
            await pluginLoader.reload();
            // Re-apply disabled state — loader doesn't know about enabled/disabled
            if (connectorRunner) {
                for (const plugin of pluginLoader.getAllPlugins()) {
                    const state = getPersistedState(db, plugin.manifest.id);
                    if (!state.enabled) {
                        connectorRunner.unregister(plugin.manifest.id);
                    }
                }
            }
        },
        async installPlugin(zipBuffer) {
            if (!pluginsDir) {
                throw new Error('Plugin installation not configured (no pluginsDir)');
            }
            const { pluginId, manifest } = installPluginFromZip(zipBuffer, pluginsDir);
            await pluginLoader.reload();
            onChange?.(pluginId, 'installed');
            const state = getPersistedState(db, pluginId);
            return buildEntry(pluginId, manifest, 'loaded', undefined, state);
        },
        async getPluginTemplate(pluginId) {
            if (!pluginsDir)
                return undefined;
            const htmlPath = path.join(pluginsDir, pluginId, 'template.html');
            const cssPath = path.join(pluginsDir, pluginId, 'template.css');
            if (!fs.existsSync(htmlPath) || !fs.existsSync(cssPath))
                return undefined;
            return {
                html: fs.readFileSync(htmlPath, 'utf-8'),
                css: fs.readFileSync(cssPath, 'utf-8'),
            };
        },
        async getPluginSource(pluginId) {
            if (!pluginsDir)
                return undefined;
            const htmlPath = path.join(pluginsDir, pluginId, 'template.html');
            const cssPath = path.join(pluginsDir, pluginId, 'template.css');
            if (!fs.existsSync(htmlPath) || !fs.existsSync(cssPath))
                return undefined;
            const result = {
                html: fs.readFileSync(htmlPath, 'utf-8'),
                css: fs.readFileSync(cssPath, 'utf-8'),
            };
            const connectorPath = path.join(pluginsDir, pluginId, 'connector.json');
            if (fs.existsSync(connectorPath)) {
                try {
                    result.connector = JSON.parse(fs.readFileSync(connectorPath, 'utf-8'));
                }
                catch {
                    // Non-fatal: malformed connector.json
                }
            }
            return result;
        },
        async saveBuiltPlugin(input) {
            if (!pluginsDir) {
                throw new Error('Plugin save not configured (no pluginsDir)');
            }
            const { pluginId, manifest } = await savePluginFromBuilder(input, pluginsDir, {
                overwrite: true,
            });
            await pluginLoader.reload();
            onChange?.(pluginId, 'saved');
            const state = getPersistedState(db, pluginId);
            return buildEntry(pluginId, manifest, 'loaded', undefined, state);
        },
        async getPluginSecretNames(id) {
            if (!secretStore) {
                throw new Error('Secret store not configured');
            }
            const secrets = secretStore.getAll(id);
            return Object.keys(secrets);
        },
        async setPluginSecret(id, key, value) {
            if (!secretStore) {
                throw new Error('Secret store not configured');
            }
            secretStore.set(id, key, value);
            // Restart the connector so it picks up the new secret immediately
            // (without this, the connector waits for the next scheduled tick which
            // can be hours away, or stays in error state from a previous failed fetch)
            if (connectorRunner && pluginsDir) {
                const connectorPath = path.join(pluginsDir, id, 'connector.json');
                if (fs.existsSync(connectorPath)) {
                    try {
                        const config = JSON.parse(fs.readFileSync(connectorPath, 'utf-8'));
                        const plugin = pluginLoader.getPlugin(id);
                        if (plugin) {
                            connectorRunner.register(id, plugin.manifest, config);
                        }
                    }
                    catch {
                        // Non-fatal: malformed connector.json
                    }
                }
            }
            onChange?.(id, 'secret_updated');
        },
        async deletePluginSecret(id, key) {
            if (!secretStore) {
                throw new Error('Secret store not configured');
            }
            secretStore.delete(id, key);
            onChange?.(id, 'secret_deleted');
        },
        async deletePlugin(id) {
            if (!pluginsDir) {
                throw new Error('Plugin deletion not configured (no pluginsDir)');
            }
            if (isModuleId(id)) {
                throw new Error('Cannot delete built-in modules');
            }
            const pluginDir = path.join(pluginsDir, id);
            if (!fs.existsSync(pluginDir)) {
                throw new Error(`Plugin "${id}" not found`);
            }
            // Unregister from connector runner
            if (connectorRunner) {
                connectorRunner.unregister(id);
            }
            // Remove plugin files
            fs.rmSync(pluginDir, { recursive: true, force: true });
            // Clean up persisted state and secrets
            db.deletePluginState(id);
            if (secretStore) {
                secretStore.deleteAll(id);
            }
            // Reload so the plugin loader drops it
            await pluginLoader.reload();
            onChange?.(id, 'deleted');
        },
    };
}
//# sourceMappingURL=plugin-admin-handlers.js.map