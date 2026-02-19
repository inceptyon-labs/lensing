import Database from 'better-sqlite3';
import type { DatabaseInstance, DatabaseOptions, SchemaMigration, ZoneConfig } from '@lensing/types';

const DEFAULT_PATH = 'data/lensing.db';

const MIGRATIONS: Array<SchemaMigration & { sql: string }> = [
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
];

export function createDatabase(options: DatabaseOptions = {}): DatabaseInstance {
  const path = options.path ?? DEFAULT_PATH;
  const db = new Database(path);

  db.pragma('journal_mode = WAL');

  // Schema version tracking via user_version pragma
  const currentVersion = (db.pragma('user_version', { simple: true }) as number) ?? 0;

  // Apply pending migrations
  for (const migration of MIGRATIONS) {
    if (migration.version > currentVersion) {
      db.exec(migration.sql);
      db.pragma(`user_version = ${migration.version}`);
    }
  }

  const instance: DatabaseInstance = {
    getSchemaVersion(): number {
      return db.pragma('user_version', { simple: true }) as number;
    },

    getMigrations(): SchemaMigration[] {
      const version = db.pragma('user_version', { simple: true }) as number;
      return MIGRATIONS.filter((m) => m.version <= version).map(({ version: v, description }) => ({
        version: v,
        description,
      }));
    },

    // --- Settings ---

    getSetting(key: string): string | undefined {
      const row = db.prepare('SELECT value FROM settings WHERE key = ?').get(key) as
        | { value: string }
        | undefined;
      return row?.value;
    },

    setSetting(key: string, value: string): void {
      db.prepare(`
        INSERT INTO settings (key, value, updated_at)
        VALUES (?, ?, datetime('now'))
        ON CONFLICT(key) DO UPDATE SET value = excluded.value, updated_at = excluded.updated_at
      `).run(key, value);
    },

    getAllSettings(): Record<string, string> {
      const rows = db.prepare('SELECT key, value FROM settings').all() as Array<{
        key: string;
        value: string;
      }>;
      const result: Record<string, string> = {};
      for (const row of rows) {
        result[row.key] = row.value;
      }
      return result;
    },

    deleteSetting(key: string): boolean {
      const info = db.prepare('DELETE FROM settings WHERE key = ?').run(key);
      return info.changes > 0;
    },

    // --- Layouts ---

    getLayout(name: string): ZoneConfig[] | undefined {
      const row = db.prepare('SELECT config FROM layouts WHERE name = ?').get(name) as
        | { config: string }
        | undefined;
      if (!row) return undefined;
      return JSON.parse(row.config) as ZoneConfig[];
    },

    setLayout(name: string, zones: ZoneConfig[]): void {
      db.prepare(`
        INSERT INTO layouts (name, config, updated_at)
        VALUES (?, ?, datetime('now'))
        ON CONFLICT(name) DO UPDATE SET config = excluded.config, updated_at = excluded.updated_at
      `).run(name, JSON.stringify(zones));
    },

    getAllLayouts(): Record<string, ZoneConfig[]> {
      const rows = db.prepare('SELECT name, config FROM layouts').all() as Array<{
        name: string;
        config: string;
      }>;
      const result: Record<string, ZoneConfig[]> = {};
      for (const row of rows) {
        result[row.name] = JSON.parse(row.config) as ZoneConfig[];
      }
      return result;
    },

    deleteLayout(name: string): boolean {
      const info = db.prepare('DELETE FROM layouts WHERE name = ?').run(name);
      return info.changes > 0;
    },

    // --- Plugin state ---

    getPluginState<T = unknown>(pluginId: string): T | undefined {
      const row = db.prepare('SELECT state FROM plugin_state WHERE plugin_id = ?').get(pluginId) as
        | { state: string }
        | undefined;
      if (!row) return undefined;
      return JSON.parse(row.state) as T;
    },

    setPluginState<T = unknown>(pluginId: string, state: T): void {
      db.prepare(`
        INSERT INTO plugin_state (plugin_id, state, updated_at)
        VALUES (?, ?, datetime('now'))
        ON CONFLICT(plugin_id) DO UPDATE SET state = excluded.state, updated_at = excluded.updated_at
      `).run(pluginId, JSON.stringify(state));
    },

    getAllPluginStates(): Record<string, unknown> {
      const rows = db.prepare('SELECT plugin_id, state FROM plugin_state').all() as Array<{
        plugin_id: string;
        state: string;
      }>;
      const result: Record<string, unknown> = {};
      for (const row of rows) {
        result[row.plugin_id] = JSON.parse(row.state);
      }
      return result;
    },

    deletePluginState(pluginId: string): boolean {
      const info = db.prepare('DELETE FROM plugin_state WHERE plugin_id = ?').run(pluginId);
      return info.changes > 0;
    },

    close(): void {
      db.close();
    },
  };

  return instance;
}
