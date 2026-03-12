import { describe, it, expect } from 'vitest';
import { CURRENT_CONFIG_VERSION, } from '../config-transfer';
describe('Config Transfer Types', () => {
    it('should export CURRENT_CONFIG_VERSION as 1', () => {
        expect(CURRENT_CONFIG_VERSION).toBe(1);
    });
    it('should allow constructing a valid ConfigExportV1', () => {
        const exported = {
            version: 1,
            exportedAt: '2026-02-21T00:00:00Z',
            schemaVersion: 1,
            settings: { theme: 'dark' },
            layouts: {},
            pluginState: {},
        };
        expect(exported.version).toBe(1);
        expect(exported.exportedAt).toBeTruthy();
        expect(exported.schemaVersion).toBe(1);
        expect(exported.settings).toEqual({ theme: 'dark' });
    });
    it('should allow layouts with zone config arrays', () => {
        const exported = {
            version: 1,
            exportedAt: '2026-02-21T00:00:00Z',
            schemaVersion: 1,
            settings: {},
            layouts: {
                default: [{ zone: 'center', columns: 2, rows: 2, plugins: ['weather'] }],
            },
            pluginState: {},
        };
        expect(exported.layouts['default']).toHaveLength(1);
    });
    it('should define ConfigMigration with fromVersion and toVersion', () => {
        const migration = {
            fromVersion: 0,
            toVersion: 1,
            migrate: (data) => ({ ...data, version: 1 }),
        };
        expect(migration.fromVersion).toBe(0);
        expect(migration.toVersion).toBe(1);
        expect(typeof migration.migrate).toBe('function');
    });
    it('should define ConfigTransferOptions requiring database', () => {
        const options = {
            database: {},
        };
        expect(options.database).toBeDefined();
    });
    it('should define ConfigTransferInstance with export, import, reset methods', () => {
        const instance = {
            exportConfig: async () => ({}),
            importConfig: async () => ({ success: true, migrationsApplied: 0 }),
            resetConfig: async () => { },
        };
        expect(typeof instance.exportConfig).toBe('function');
        expect(typeof instance.importConfig).toBe('function');
        expect(typeof instance.resetConfig).toBe('function');
    });
});
//# sourceMappingURL=config-transfer.test.js.map