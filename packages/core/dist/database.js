import Database from 'better-sqlite3';
const DEFAULT_PATH = 'data/lensing.db';
const MIGRATIONS = [
    {
        version: 1,
        description: 'initial schema',
        sql: `
      CREATE TABLE IF NOT EXISTS settings (
        key TEXT PRIMARY KEY,
        value TEXT NOT NULL,
        updated_at TEXT NOT NULL DEFAULT (datetime('now'))
      );

      CREATE TABLE IF NOT EXISTS layouts (
        name TEXT PRIMARY KEY,
        config TEXT NOT NULL,
        updated_at TEXT NOT NULL DEFAULT (datetime('now'))
      );

      CREATE TABLE IF NOT EXISTS plugin_state (
        plugin_id TEXT PRIMARY KEY,
        state TEXT NOT NULL,
        updated_at TEXT NOT NULL DEFAULT (datetime('now'))
      );
    `,
    },
    {
        version: 2,
        description: 'add scene schedules table',
        sql: `
      CREATE TABLE IF NOT EXISTS scene_schedules (
        id TEXT PRIMARY KEY,
        name TEXT NOT NULL,
        schedule TEXT NOT NULL,
        created_at TEXT NOT NULL,
        updated_at TEXT NOT NULL DEFAULT (datetime('now'))
      );
    `,
    },
    {
        version: 3,
        description: 'add plugin secrets table',
        sql: `
      CREATE TABLE IF NOT EXISTS plugin_secrets (
        plugin_id TEXT NOT NULL,
        secret_key TEXT NOT NULL,
        encrypted_value TEXT NOT NULL,
        created_at TEXT NOT NULL DEFAULT (datetime('now')),
        updated_at TEXT NOT NULL DEFAULT (datetime('now')),
        PRIMARY KEY (plugin_id, secret_key)
      );
    `,
    },
];
export function createDatabase(options = {}) {
    const path = options.path ?? DEFAULT_PATH;
    const db = new Database(path);
    db.pragma('journal_mode = WAL');
    // Schema version tracking via user_version pragma
    const currentVersion = db.pragma('user_version', { simple: true }) ?? 0;
    // Forward-compatibility check: fail if schema version is higher than known
    const maxKnownVersion = MIGRATIONS[MIGRATIONS.length - 1]?.version ?? 0;
    if (currentVersion > maxKnownVersion) {
        db.close();
        throw new Error(`Database schema version ${currentVersion} is higher than known version ${maxKnownVersion}. ` +
            `This binary is too old to open this database.`);
    }
    // Apply pending migrations atomically
    for (const migration of MIGRATIONS) {
        if (migration.version > currentVersion) {
            try {
                db.exec('BEGIN TRANSACTION');
                db.exec(migration.sql);
                db.pragma(`user_version = ${migration.version}`);
                db.exec('COMMIT');
            }
            catch (error) {
                db.exec('ROLLBACK');
                db.close();
                throw error;
            }
        }
    }
    const instance = {
        getSchemaVersion() {
            return db.pragma('user_version', { simple: true });
        },
        getMigrations() {
            const version = db.pragma('user_version', { simple: true });
            return MIGRATIONS.filter((m) => m.version <= version).map(({ version: v, description }) => ({
                version: v,
                description,
            }));
        },
        // --- Settings ---
        getSetting(key) {
            const row = db.prepare('SELECT value FROM settings WHERE key = ?').get(key);
            return row?.value;
        },
        setSetting(key, value) {
            db.prepare(`
        INSERT INTO settings (key, value, updated_at)
        VALUES (?, ?, datetime('now'))
        ON CONFLICT(key) DO UPDATE SET value = excluded.value, updated_at = excluded.updated_at
      `).run(key, value);
        },
        getAllSettings() {
            const rows = db.prepare('SELECT key, value FROM settings').all();
            const result = Object.create(null);
            for (const row of rows) {
                result[row.key] = row.value;
            }
            return result;
        },
        deleteSetting(key) {
            const info = db.prepare('DELETE FROM settings WHERE key = ?').run(key);
            return info.changes > 0;
        },
        // --- Layouts ---
        getLayout(name) {
            const row = db.prepare('SELECT config FROM layouts WHERE name = ?').get(name);
            if (!row)
                return undefined;
            return JSON.parse(row.config);
        },
        setLayout(name, zones) {
            db.prepare(`
        INSERT INTO layouts (name, config, updated_at)
        VALUES (?, ?, datetime('now'))
        ON CONFLICT(name) DO UPDATE SET config = excluded.config, updated_at = excluded.updated_at
      `).run(name, JSON.stringify(zones));
        },
        getAllLayouts() {
            const rows = db.prepare('SELECT name, config FROM layouts').all();
            const result = Object.create(null);
            for (const row of rows) {
                result[row.name] = JSON.parse(row.config);
            }
            return result;
        },
        deleteLayout(name) {
            const info = db.prepare('DELETE FROM layouts WHERE name = ?').run(name);
            return info.changes > 0;
        },
        // --- Plugin state ---
        getPluginState(pluginId) {
            const row = db.prepare('SELECT state FROM plugin_state WHERE plugin_id = ?').get(pluginId);
            if (!row)
                return undefined;
            return JSON.parse(row.state);
        },
        setPluginState(pluginId, state) {
            db.prepare(`
        INSERT INTO plugin_state (plugin_id, state, updated_at)
        VALUES (?, ?, datetime('now'))
        ON CONFLICT(plugin_id) DO UPDATE SET state = excluded.state, updated_at = excluded.updated_at
      `).run(pluginId, JSON.stringify(state));
        },
        getAllPluginStates() {
            const rows = db.prepare('SELECT plugin_id, state FROM plugin_state').all();
            const result = Object.create(null);
            for (const row of rows) {
                result[row.plugin_id] = JSON.parse(row.state);
            }
            return result;
        },
        deletePluginState(pluginId) {
            const info = db.prepare('DELETE FROM plugin_state WHERE plugin_id = ?').run(pluginId);
            return info.changes > 0;
        },
        // --- Scene Schedules ---
        getSchedule(id) {
            const row = db
                .prepare('SELECT schedule, created_at FROM scene_schedules WHERE id = ?')
                .get(id);
            if (!row)
                return undefined;
            const parsed = JSON.parse(row.schedule);
            return {
                ...parsed,
                createdAt: new Date(row.created_at),
                updatedAt: new Date(parsed.updatedAt),
            };
        },
        setSchedule(schedule) {
            db.prepare(`
        INSERT INTO scene_schedules (id, name, schedule, created_at, updated_at)
        VALUES (?, ?, ?, ?, datetime('now'))
        ON CONFLICT(id) DO UPDATE SET name = excluded.name, schedule = excluded.schedule, updated_at = excluded.updated_at
      `).run(schedule.id, schedule.name, JSON.stringify({
                id: schedule.id,
                name: schedule.name,
                entries: schedule.entries,
                updatedAt: schedule.updatedAt,
            }), schedule.createdAt.toISOString());
        },
        getAllSchedules() {
            const rows = db
                .prepare('SELECT id, schedule, created_at FROM scene_schedules')
                .all();
            const result = Object.create(null);
            for (const row of rows) {
                const parsed = JSON.parse(row.schedule);
                result[row.id] = {
                    ...parsed,
                    createdAt: new Date(row.created_at),
                    updatedAt: new Date(parsed.updatedAt),
                };
            }
            return result;
        },
        deleteSchedule(id) {
            const info = db.prepare('DELETE FROM scene_schedules WHERE id = ?').run(id);
            return info.changes > 0;
        },
        // --- Plugin Secrets (encrypted at rest) ---
        getPluginSecret(pluginId, secretKey) {
            const row = db
                .prepare('SELECT encrypted_value FROM plugin_secrets WHERE plugin_id = ? AND secret_key = ?')
                .get(pluginId, secretKey);
            return row?.encrypted_value;
        },
        setPluginSecret(pluginId, secretKey, encryptedValue) {
            db.prepare(`
        INSERT INTO plugin_secrets (plugin_id, secret_key, encrypted_value, created_at, updated_at)
        VALUES (?, ?, ?, datetime('now'), datetime('now'))
        ON CONFLICT(plugin_id, secret_key) DO UPDATE SET encrypted_value = excluded.encrypted_value, updated_at = excluded.updated_at
      `).run(pluginId, secretKey, encryptedValue);
        },
        getPluginSecrets(pluginId) {
            const rows = db
                .prepare('SELECT secret_key, encrypted_value FROM plugin_secrets WHERE plugin_id = ?')
                .all(pluginId);
            const result = Object.create(null);
            for (const row of rows) {
                result[row.secret_key] = row.encrypted_value;
            }
            return result;
        },
        deletePluginSecret(pluginId, secretKey) {
            const info = db
                .prepare('DELETE FROM plugin_secrets WHERE plugin_id = ? AND secret_key = ?')
                .run(pluginId, secretKey);
            return info.changes > 0;
        },
        deleteAllPluginSecrets(pluginId) {
            const info = db.prepare('DELETE FROM plugin_secrets WHERE plugin_id = ?').run(pluginId);
            return info.changes;
        },
        close() {
            db.close();
        },
    };
    return instance;
}
//# sourceMappingURL=database.js.map