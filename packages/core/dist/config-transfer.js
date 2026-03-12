import { CURRENT_CONFIG_VERSION } from '@lensing/types';
// ── Factory ────────────────────────────────────────────────────────────────
export function createConfigTransfer(options) {
    const { database } = options;
    return {
        async exportConfig() {
            const settings = { ...database.getAllSettings() };
            const rawLayouts = database.getAllLayouts();
            const layouts = Object.create(null);
            for (const [name, zones] of Object.entries(rawLayouts)) {
                layouts[name] = zones.map((z) => ({ ...z }));
            }
            const rawStates = database.getAllPluginStates();
            const pluginState = Object.create(null);
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
        async importConfig(data) {
            if (data === null || typeof data !== 'object') {
                return { success: false, migrationsApplied: 0 };
            }
            const raw = data;
            const version = raw['version'];
            if (typeof version !== 'number' ||
                !Number.isInteger(version) ||
                version < 1 ||
                version > CURRENT_CONFIG_VERSION) {
                return { success: false, migrationsApplied: 0 };
            }
            const payload = raw;
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
                        database.setLayout(name, zones);
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
        async resetConfig() {
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
//# sourceMappingURL=config-transfer.js.map