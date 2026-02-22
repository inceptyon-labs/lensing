import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { createDatabase } from '../database';
import { createConfigTransfer } from '../config-transfer';
import type { DatabaseInstance, ZoneConfig } from '@lensing/types';
import type { ConfigTransferInstance } from '@lensing/types';

// ── Helpers ───────────────────────────────────────────────────────────────────

const TEST_LAYOUT: ZoneConfig[] = [{ zone: 'center', columns: 2, rows: 2, plugins: ['weather'] }];

// ── Tests ─────────────────────────────────────────────────────────────────────

describe('Config Transfer', () => {
  let db: DatabaseInstance;
  let transfer: ConfigTransferInstance;

  beforeEach(() => {
    db = createDatabase({ path: ':memory:' });
    transfer = createConfigTransfer({ database: db });
  });

  afterEach(() => {
    db.close();
  });

  // ── exportConfig ────────────────────────────────────────────────────────────

  it('should export an empty config with correct shape', async () => {
    const exported = await transfer.exportConfig();

    expect(exported.version).toBe(1);
    expect(typeof exported.exportedAt).toBe('string');
    expect(new Date(exported.exportedAt).getTime()).toBeGreaterThan(0);
    expect(typeof exported.schemaVersion).toBe('number');
    expect(exported.settings).toEqual({});
    expect(exported.layouts).toEqual({});
    expect(exported.pluginState).toEqual({});
  });

  it('should export settings from the database', async () => {
    db.setSetting('theme', 'dark');
    db.setSetting('language', 'en');

    const exported = await transfer.exportConfig();

    expect(exported.settings).toEqual({ theme: 'dark', language: 'en' });
  });

  it('should export layouts from the database', async () => {
    db.setLayout('default', TEST_LAYOUT);

    const exported = await transfer.exportConfig();

    expect(exported.layouts['default']).toEqual(TEST_LAYOUT);
  });

  it('should export plugin state from the database', async () => {
    db.setPluginState('weather', { lastCity: 'NYC', temp: 72 });

    const exported = await transfer.exportConfig();

    expect(exported.pluginState['weather']).toEqual({ lastCity: 'NYC', temp: 72 });
  });

  it('should include schemaVersion matching database schema version', async () => {
    const schemaVersion = db.getSchemaVersion();
    const exported = await transfer.exportConfig();

    expect(exported.schemaVersion).toBe(schemaVersion);
  });

  it('should return defensive copies (mutating result does not affect database)', async () => {
    db.setSetting('key', 'value');
    const exported = await transfer.exportConfig();

    exported.settings['key'] = 'mutated';
    const exported2 = await transfer.exportConfig();

    expect(exported2.settings['key']).toBe('value');
  });

  // ── importConfig ────────────────────────────────────────────────────────────

  it('should import settings into the database', async () => {
    const data = {
      version: 1,
      exportedAt: new Date().toISOString(),
      schemaVersion: 1,
      settings: { theme: 'light', language: 'fr' },
      layouts: {},
      pluginState: {},
    };

    const result = await transfer.importConfig(data);

    expect(result.success).toBe(true);
    expect(db.getSetting('theme')).toBe('light');
    expect(db.getSetting('language')).toBe('fr');
  });

  it('should import layouts into the database', async () => {
    const data = {
      version: 1,
      exportedAt: new Date().toISOString(),
      schemaVersion: 1,
      settings: {},
      layouts: { default: TEST_LAYOUT },
      pluginState: {},
    };

    await transfer.importConfig(data);

    expect(db.getLayout('default')).toEqual(TEST_LAYOUT);
  });

  it('should import plugin state into the database', async () => {
    const data = {
      version: 1,
      exportedAt: new Date().toISOString(),
      schemaVersion: 1,
      settings: {},
      layouts: {},
      pluginState: { weather: { city: 'LA' } },
    };

    await transfer.importConfig(data);

    expect(db.getPluginState('weather')).toEqual({ city: 'LA' });
  });

  it('should overwrite existing data on import', async () => {
    db.setSetting('theme', 'dark');

    const data = {
      version: 1,
      exportedAt: new Date().toISOString(),
      schemaVersion: 1,
      settings: { theme: 'light' },
      layouts: {},
      pluginState: {},
    };

    await transfer.importConfig(data);

    expect(db.getSetting('theme')).toBe('light');
  });

  it('should return migrationsApplied: 0 when version matches current', async () => {
    const data = {
      version: 1,
      exportedAt: new Date().toISOString(),
      schemaVersion: 1,
      settings: {},
      layouts: {},
      pluginState: {},
    };

    const result = await transfer.importConfig(data);

    expect(result.migrationsApplied).toBe(0);
  });

  it('should reject import with missing version field', async () => {
    const result = await transfer.importConfig({ settings: {}, layouts: {}, pluginState: {} });

    expect(result.success).toBe(false);
  });

  it('should reject import with non-object data', async () => {
    const result = await transfer.importConfig('not an object');

    expect(result.success).toBe(false);
  });

  it('should reject import with null data', async () => {
    const result = await transfer.importConfig(null);

    expect(result.success).toBe(false);
  });

  it('should reject import with version higher than current', async () => {
    const result = await transfer.importConfig({
      version: 9999,
      exportedAt: new Date().toISOString(),
      schemaVersion: 1,
      settings: {},
      layouts: {},
      pluginState: {},
    });

    expect(result.success).toBe(false);
  });

  it('should reject import with version NaN', async () => {
    const result = await transfer.importConfig({
      version: NaN,
      settings: {},
      layouts: {},
      pluginState: {},
    });

    expect(result.success).toBe(false);
  });

  it('should reject import with version 0', async () => {
    const result = await transfer.importConfig({
      version: 0,
      settings: {},
      layouts: {},
      pluginState: {},
    });

    expect(result.success).toBe(false);
  });

  it('should reject import with negative version', async () => {
    const result = await transfer.importConfig({
      version: -1,
      settings: {},
      layouts: {},
      pluginState: {},
    });

    expect(result.success).toBe(false);
  });

  it('should reject import with fractional version', async () => {
    const result = await transfer.importConfig({
      version: 0.5,
      settings: {},
      layouts: {},
      pluginState: {},
    });

    expect(result.success).toBe(false);
  });

  // ── resetConfig ─────────────────────────────────────────────────────────────

  it('should clear all settings on reset', async () => {
    db.setSetting('theme', 'dark');
    db.setSetting('language', 'en');

    await transfer.resetConfig();

    expect(db.getAllSettings()).toEqual({});
  });

  it('should clear all layouts on reset', async () => {
    db.setLayout('default', TEST_LAYOUT);

    await transfer.resetConfig();

    expect(db.getAllLayouts()).toEqual({});
  });

  it('should clear all plugin state on reset', async () => {
    db.setPluginState('weather', { city: 'NYC' });

    await transfer.resetConfig();

    expect(db.getAllPluginStates()).toEqual({});
  });

  it('should succeed on reset of already-empty database', async () => {
    await expect(transfer.resetConfig()).resolves.toBeUndefined();
    expect(db.getAllSettings()).toEqual({});
  });

  // ── round-trip ──────────────────────────────────────────────────────────────

  it('should round-trip export and import', async () => {
    db.setSetting('theme', 'dark');
    db.setLayout('main', TEST_LAYOUT);
    db.setPluginState('crypto', { coins: ['btc'] });

    const exported = await transfer.exportConfig();

    // Reset and reimport
    await transfer.resetConfig();
    await transfer.importConfig(exported);

    expect(db.getSetting('theme')).toBe('dark');
    expect(db.getLayout('main')).toEqual(TEST_LAYOUT);
    expect(db.getPluginState('crypto')).toEqual({ coins: ['btc'] });
  });
});
