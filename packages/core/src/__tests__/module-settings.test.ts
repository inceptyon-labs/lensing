import { describe, it, expect, beforeEach } from 'vitest';
import { readModuleConfig, writeModuleConfig } from '../module-settings';
import type { DatabaseInstance, ModuleSettingsSchema } from '@lensing/types';

/** Minimal in-memory DB stub for settings */
function createMockDb(): DatabaseInstance {
  const settings = new Map<string, string>();
  return {
    getSetting: (key: string) => settings.get(key),
    setSetting: (key: string, value: string) => {
      settings.set(key, value);
    },
    getAllSettings: () => Object.fromEntries(settings),
    deleteSetting: (key: string) => settings.delete(key),
    // Stubs for unused methods
    getSchemaVersion: () => 0,
    getMigrations: () => [],
    getLayout: () => undefined,
    setLayout: () => {},
    getAllLayouts: () => ({}),
    deleteLayout: () => false,
    getPluginState: () => undefined,
    setPluginState: () => {},
    getAllPluginStates: () => ({}),
    deletePluginState: () => false,
    getSchedule: () => undefined,
    setSchedule: () => {},
    getAllSchedules: () => ({}),
    deleteSchedule: () => false,
    close: () => {},
  } as unknown as DatabaseInstance;
}

const testSchema: ModuleSettingsSchema = {
  id: 'weather',
  name: 'Weather',
  description: 'Test weather module',
  fields: [
    { key: 'apiKey', type: 'password', label: 'API Key', required: true },
    { key: 'lat', type: 'number', label: 'Latitude', required: true },
    { key: 'lon', type: 'number', label: 'Longitude', required: true },
    {
      key: 'units',
      type: 'select',
      label: 'Units',
      default: 'imperial',
      options: [
        { label: 'Imperial', value: 'imperial' },
        { label: 'Metric', value: 'metric' },
      ],
    },
  ],
};

describe('readModuleConfig', () => {
  let db: DatabaseInstance;

  beforeEach(() => {
    db = createMockDb();
  });

  it('should return enabled false when no settings exist', () => {
    const config = readModuleConfig(db, testSchema);
    expect(config.enabled).toBe(false);
  });

  it('should read enabled flag from DB', () => {
    db.setSetting('weather.enabled', 'true');
    const config = readModuleConfig(db, testSchema);
    expect(config.enabled).toBe(true);
  });

  it('should read string/password fields as strings', () => {
    db.setSetting('weather.apiKey', 'secret123');
    const config = readModuleConfig(db, testSchema);
    expect(config.values['apiKey']).toBe('secret123');
  });

  it('should coerce number fields from string', () => {
    db.setSetting('weather.lat', '40.7');
    const config = readModuleConfig(db, testSchema);
    expect(config.values['lat']).toBe(40.7);
  });

  it('should fall back to schema defaults for missing fields', () => {
    const config = readModuleConfig(db, testSchema);
    expect(config.values['units']).toBe('imperial');
  });

  it('should not include fields with no DB value and no default', () => {
    const config = readModuleConfig(db, testSchema);
    expect(config.values).not.toHaveProperty('apiKey');
    expect(config.values).not.toHaveProperty('lat');
  });

  it('should coerce invalid number to 0', () => {
    db.setSetting('weather.lat', 'not-a-number');
    const config = readModuleConfig(db, testSchema);
    expect(config.values['lat']).toBe(0);
  });
});

describe('writeModuleConfig', () => {
  let db: DatabaseInstance;

  beforeEach(() => {
    db = createMockDb();
  });

  it('should write enabled flag', () => {
    writeModuleConfig(db, 'weather', { enabled: true, values: {} });
    expect(db.getSetting('weather.enabled')).toBe('true');
  });

  it('should write field values as strings', () => {
    writeModuleConfig(db, 'weather', {
      enabled: true,
      values: { apiKey: 'key123', lat: 40.7, lon: -74 },
    });
    expect(db.getSetting('weather.apiKey')).toBe('key123');
    expect(db.getSetting('weather.lat')).toBe('40.7');
    expect(db.getSetting('weather.lon')).toBe('-74');
  });

  it('should round-trip through read/write', () => {
    const original = { enabled: true, values: { apiKey: 'abc', lat: 51.5, units: 'metric' } };
    writeModuleConfig(db, 'weather', original);
    const result = readModuleConfig(db, testSchema);
    expect(result.enabled).toBe(true);
    expect(result.values['apiKey']).toBe('abc');
    expect(result.values['lat']).toBe(51.5);
    expect(result.values['units']).toBe('metric');
  });
});
