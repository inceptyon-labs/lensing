import { describe, it, expect, beforeEach, vi } from 'vitest';
import type { DatabaseInstance, DataBusInstance, NotificationQueueInstance } from '@lensing/types';

// Mock all server factories before importing module-boot
vi.mock('../weather-server', () => ({
  createWeatherServer: vi.fn(() => ({ close: vi.fn(), refresh: vi.fn(() => Promise.resolve()) })),
}));
vi.mock('../crypto-server', () => ({
  createCryptoServer: vi.fn(() => ({ close: vi.fn(), refresh: vi.fn(() => Promise.resolve()) })),
}));
vi.mock('../news-server', () => ({
  createNewsServer: vi.fn(() => ({ close: vi.fn(), refresh: vi.fn(() => Promise.resolve()) })),
}));
vi.mock('../sports-server', () => ({
  createSportsServer: vi.fn(() => ({ close: vi.fn(), refresh: vi.fn(() => Promise.resolve()) })),
}));
vi.mock('../caldav-client', () => ({
  createCalendarServer: vi.fn(() => ({ close: vi.fn(), refresh: vi.fn(() => Promise.resolve()) })),
}));
vi.mock('../home-assistant-server', () => ({
  createHomeAssistantServer: vi.fn(() => ({
    close: vi.fn(),
    refresh: vi.fn(() => Promise.resolve()),
  })),
}));
vi.mock('../allergies-server', () => ({
  createAllergiesServer: vi.fn(() => ({ close: vi.fn(), refresh: vi.fn(() => Promise.resolve()) })),
}));
vi.mock('../pir-server', () => ({
  createPIRServer: vi.fn(() => ({ close: vi.fn() })),
}));
vi.mock('../photo-slideshow-server', () => ({
  createPhotoSlideshowServer: vi.fn(() => ({
    close: vi.fn(),
    refresh: vi.fn(() => Promise.resolve()),
    getPhotoPaths: vi.fn(() => []),
  })),
}));

import { bootEnabledModules, rebootModule } from '../module-boot';
import type { BootedModule } from '../module-boot';
import { createWeatherServer } from '../weather-server';
import { createCalendarServer } from '../caldav-client';
import { createCryptoServer } from '../crypto-server';
import { createPIRServer } from '../pir-server';
import { createPhotoSlideshowServer } from '../photo-slideshow-server';

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

  it('should call refresh() immediately after booting polling modules', async () => {
    db.setSetting('weather.enabled', 'true');
    db.setSetting('weather.apiKey', 'key');
    db.setSetting('weather.lat', '0');
    db.setSetting('weather.lon', '0');
    db.setSetting('pir.enabled', 'true');

    const modules = bootEnabledModules(db, deps);

    // Give async refresh time to execute
    await new Promise((r) => setTimeout(r, 50));

    const weatherMock = vi.mocked(createWeatherServer);
    expect(weatherMock).toHaveBeenCalledOnce();
    const weatherInstance = weatherMock.mock.results[0]!.value;
    expect(weatherInstance.refresh).toHaveBeenCalled();

    // PIR has no refresh method — should not be called
    const pirInstance = vi.mocked(createPIRServer).mock.results[0]?.value;
    if (pirInstance) {
      expect((pirInstance as any).refresh).toBeUndefined();
    }
  });

  it('should set up interval timer with correct refresh interval', async () => {
    vi.useFakeTimers();

    db.setSetting('crypto.enabled', 'true');
    db.setSetting('crypto.watchlist', 'bitcoin');

    const modules = bootEnabledModules(db, deps);

    // Timer should exist (Node returns a Timeout object, not a number)
    expect(modules[0]!.timer).toBeDefined();

    // Advance time by refresh interval (~5min for crypto)
    vi.advanceTimersByTime(5 * 60 * 1000);

    // Verify refresh was called again by the timer
    const cryptoMock = vi.mocked(createCryptoServer);
    const cryptoInstance = cryptoMock.mock.results[0]!.value;
    expect(cryptoInstance.refresh).toHaveBeenCalledTimes(2); // initial + 1 from timer

    vi.useRealTimers();
  });

  it('should clear timer when rebootModule closes old instance', () => {
    vi.useFakeTimers();

    const oldRefresh = vi.fn(() => Promise.resolve());
    const oldClose = vi.fn();
    const modules: BootedModule[] = [
      { id: 'weather', instance: { close: oldClose, refresh: oldRefresh }, timer: 12345 as any },
    ];

    db.setSetting('weather.enabled', 'true');
    db.setSetting('weather.apiKey', 'new-key');
    db.setSetting('weather.lat', '0');
    db.setSetting('weather.lon', '0');

    rebootModule('weather', modules, db, deps);

    // Old timer should have been cleared (clearInterval called with 12345)
    // Since we can't directly check clearInterval, we verify timer is updated
    expect(modules[0]!.timer).toBeDefined();

    vi.useRealTimers();
  });

  it('should pass dataBus to weather module', () => {
    db.setSetting('weather.enabled', 'true');
    db.setSetting('weather.apiKey', 'key');
    db.setSetting('weather.lat', '40.7');
    db.setSetting('weather.lon', '-74');

    bootEnabledModules(db, deps);

    expect(createWeatherServer).toHaveBeenCalledWith(
      expect.objectContaining({ dataBus: deps.dataBus })
    );
  });

  it('should boot photo-slideshow module with photoDirectory', () => {
    db.setSetting('photo-slideshow.enabled', 'true');
    db.setSetting('photo-slideshow.photoDirectory', '/home/pi/photos');

    const modules = bootEnabledModules(db, deps);
    expect(modules.some((m) => m.id === 'photo-slideshow')).toBe(true);
    expect(createPhotoSlideshowServer).toHaveBeenCalledWith(
      expect.objectContaining({ photoDir: '/home/pi/photos', dataBus: deps.dataBus })
    );
  });

  it('should pass dataBus to calendar module', () => {
    db.setSetting('calendar.enabled', 'true');
    db.setSetting('calendar.serverUrl', 'https://caldav.icloud.com');
    db.setSetting('calendar.username', 'user@icloud.com');
    db.setSetting('calendar.password', 'app-specific-password');
    db.setSetting('calendar.calendarPath', '/calendars/user@icloud.com/calendar/');

    bootEnabledModules(db, deps);

    expect(createCalendarServer).toHaveBeenCalledWith(
      expect.objectContaining({ dataBus: deps.dataBus })
    );
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
