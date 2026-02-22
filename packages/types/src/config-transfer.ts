import type { DatabaseInstance, ZoneConfig } from './index';

/** Current version of the config export format */
export const CURRENT_CONFIG_VERSION = 1;

/** Config export payload (version 1) */
export interface ConfigExportV1 {
  version: 1;
  exportedAt: string; // ISO 8601
  schemaVersion: number; // SQLite schema version at export time
  settings: Record<string, string>;
  layouts: Record<string, ZoneConfig[]>;
  pluginState: Record<string, unknown>;
}

/** Union of all config export versions (extensible for future versions) */
export type ConfigExport = ConfigExportV1;

/** Result returned by importConfig */
export interface ImportResult {
  success: boolean;
  migrationsApplied: number;
}

/** A migration from one export format version to the next */
export interface ConfigMigration {
  fromVersion: number;
  toVersion: number;
  migrate: (data: Record<string, unknown>) => Record<string, unknown>;
}

/** Options for createConfigTransfer */
export interface ConfigTransferOptions {
  database: DatabaseInstance;
}

/** Instance returned by createConfigTransfer */
export interface ConfigTransferInstance {
  /** Export all config data to a portable JSON object */
  exportConfig(): Promise<ConfigExportV1>;
  /** Import config from a previously exported object; applies migrations if needed */
  importConfig(data: unknown): Promise<ImportResult>;
  /** Reset all config data to empty state */
  resetConfig(): Promise<void>;
}
