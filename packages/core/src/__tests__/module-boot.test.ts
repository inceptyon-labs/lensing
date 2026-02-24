import { describe, it, expect, beforeEach, vi } from 'vitest';
import type { DatabaseInstance, DataBusInstance, NotificationQueueInstance } from '@lensing/types';

// Mock all server factories before importing module-boot
vi.mock('../weather-server', () => ({
  createWeatherServer: vi.fn(() => ({ close: vi.fn() })),
}));
vi.mock('../crypto-server', () => ({
  createCryptoServer: vi.fn(() => ({ close: vi.fn() })),
}));
vi.mock('../news-server', () => ({
  createNewsServer: vi.fn(() => ({ close: vi.fn() })),
}));
vi.mock('../sports-server', () => ({
  createSportsServer: vi.fn(() => ({ close: vi.fn() })),
}));
vi.mock('../caldav-client', () => ({
  createCalendarServer: vi.fn(() => ({ close: vi.fn() })),
}));
vi.mock('../home-assistant-server', () => ({
  createHomeAssistantServer: vi.fn(() => ({ close: vi.fn() })),
}));
vi.mock('../allergies-server', () => ({
  createAllergiesServer: vi.fn(() => ({ close: vi.fn() })),
}));
vi.mock('../pir-server', () => ({
  createPIRServer: vi.fn(() => ({ close: vi.fn() })),
}));

import { bootEnabledModules, rebootModule } from '../module-boot';
import type { BootedModule } from '../module-boot';
import { createWeatherServer } from '../weather-server';
import { createCryptoServer } from '../crypto-server';

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

function createMockDeps() {
  return {
    dataBus: { publish: vi.fn(), subscribe: vi.fn(), close: vi.fn() } as unknown as DataBusInstance,
    notifications: { emit: vi.fn(), close: vi.fn() } as unknown as NotificationQueueInstance,
  };
}

describe('bootEnabledModules', () => {
  let db: DatabaseInstance;
  let deps: ReturnType<typeof createMockDeps>;

  beforeEach(() => {
    vi.clearAllMocks();
    db = createMockDb();
    deps = createMockDeps();
  });

  it('should return empty array when no modules are enabled', () => {
    const modules = bootEnabledModules(db, deps);
    expect(modules).toHaveLength(0);
  });

  it('should boot an enabled module', () => {
    db.setSetting('weather.enabled', 'true');
    db.setSetting('weather.apiKey', 'test-key');
    db.setSetting('weather.lat', '40.7');
    db.setSetting('weather.lon', '-74');

    const modules = bootEnabledModules(db, deps);
    expect(modules).toHaveLength(1);
    expect(modules[0]!.id).toBe('weather');
    expect(createWeatherServer).toHaveBeenCalledOnce();
  });

  it('should skip disabled modules', () => {
    db.setSetting('weather.enabled', 'false');
    db.setSetting('crypto.enabled', 'true');
    db.setSetting('crypto.watchlist', 'bitcoin');

    const modules = bootEnabledModules(db, deps);
    expect(modules).toHaveLength(1);
    expect(modules[0]!.id).toBe('crypto');
    expect(createWeatherServer).not.toHaveBeenCalled();
    expect(createCryptoServer).toHaveBeenCalledOnce();
  });

  it('should catch and log errors without crashing', () => {
    db.setSetting('weather.enabled', 'true');
    vi.mocked(createWeatherServer).mockImplementationOnce(() => {
      throw new Error('API error');
    });

    const log = { info: vi.fn(), error: vi.fn(), debug: vi.fn() };
    const modules = bootEnabledModules(db, deps, log);
    expect(modules).toHaveLength(0);
    expect(log.error).toHaveBeenCalledWith('Module boot failed: weather', expect.any(Error));
  });

  it('should boot multiple modules', () => {
    db.setSetting('weather.enabled', 'true');
    db.setSetting('weather.apiKey', 'key');
    db.setSetting('weather.lat', '0');
    db.setSetting('weather.lon', '0');
    db.setSetting('crypto.enabled', 'true');
    db.setSetting('crypto.watchlist', 'bitcoin,ethereum');

    const modules = bootEnabledModules(db, deps);
    expect(modules).toHaveLength(2);
    expect(modules.map((m) => m.id)).toEqual(['weather', 'crypto']);
  });

  it('should log total booted count', () => {
    db.setSetting('crypto.enabled', 'true');
    const log = { info: vi.fn(), error: vi.fn(), debug: vi.fn() };
    bootEnabledModules(db, deps, log);
    expect(log.info).toHaveBeenCalledWith('Built-in modules booted', { count: 1 });
  });
});

describe('rebootModule', () => {
  let db: DatabaseInstance;
  let deps: ReturnType<typeof createMockDeps>;

  beforeEach(() => {
    vi.clearAllMocks();
    db = createMockDb();
    deps = createMockDeps();
  });

  it('should reboot a running module (old closed, new in array)', () => {
    const oldClose = vi.fn();
    const modules: BootedModule[] = [{ id: 'weather', instance: { close: oldClose } }];

    db.setSetting('weather.enabled', 'true');
    db.setSetting('weather.apiKey', 'new-key');
    db.setSetting('weather.lat', '40.7');
    db.setSetting('weather.lon', '-74');

    const result = rebootModule('weather', modules, db, deps);

    expect(oldClose).toHaveBeenCalledOnce();
    expect(result).not.toBeNull();
    expect(modules).toHaveLength(1);
    expect(modules[0]!.id).toBe('weather');
    expect(modules[0]!.instance).not.toEqual({ close: oldClose });
    expect(createWeatherServer).toHaveBeenCalledOnce();
  });

  it('should boot a module not previously running', () => {
    const modules: BootedModule[] = [];

    db.setSetting('weather.enabled', 'true');
    db.setSetting('weather.apiKey', 'key');
    db.setSetting('weather.lat', '0');
    db.setSetting('weather.lon', '0');

    const result = rebootModule('weather', modules, db, deps);

    expect(result).not.toBeNull();
    expect(modules).toHaveLength(1);
    expect(modules[0]!.id).toBe('weather');
  });

  it('should return null and remove old for disabled module', () => {
    const oldClose = vi.fn();
    const modules: BootedModule[] = [{ id: 'weather', instance: { close: oldClose } }];

    db.setSetting('weather.enabled', 'false');

    const result = rebootModule('weather', modules, db, deps);

    expect(oldClose).toHaveBeenCalledOnce();
    expect(result).toBeNull();
    expect(modules).toHaveLength(0);
  });

  it('should return null for unknown module ID', () => {
    const modules: BootedModule[] = [];

    const result = rebootModule('nonexistent' as any, modules, db, deps);

    expect(result).toBeNull();
    expect(modules).toHaveLength(0);
  });

  it('should continue reboot even if old close() throws', () => {
    const oldClose = vi.fn(() => {
      throw new Error('Close failed');
    });
    const modules: BootedModule[] = [{ id: 'weather', instance: { close: oldClose } }];

    db.setSetting('weather.enabled', 'true');
    db.setSetting('weather.apiKey', 'key');
    db.setSetting('weather.lat', '0');
    db.setSetting('weather.lon', '0');

    const log = { info: vi.fn(), error: vi.fn(), debug: vi.fn() };
    const result = rebootModule('weather', modules, db, deps, log);

    expect(oldClose).toHaveBeenCalledOnce();
    expect(log.error).toHaveBeenCalledWith('Module close failed: weather', expect.any(Error));
    expect(result).not.toBeNull();
    expect(modules).toHaveLength(1);
    expect(modules[0]!.id).toBe('weather');
  });

  it('should throw on boot error after closing old', () => {
    const oldClose = vi.fn();
    const modules: BootedModule[] = [{ id: 'weather', instance: { close: oldClose } }];

    db.setSetting('weather.enabled', 'true');
    vi.mocked(createWeatherServer).mockImplementationOnce(() => {
      throw new Error('Boot failed');
    });

    expect(() => rebootModule('weather', modules, db, deps)).toThrow('Boot failed');
    expect(oldClose).toHaveBeenCalledOnce();
    // Old module removed even though new boot failed
    expect(modules).toHaveLength(0);
  });
});
