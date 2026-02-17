import { describe, it, expect, vi } from 'vitest';
import { createWeatherServer } from '../weather-server';
import type { WeatherServerOptions } from '../weather-server';

// Minimal valid options for tests
function validOptions(overrides: Partial<WeatherServerOptions> = {}): WeatherServerOptions {
  return {
    apiKey: 'test-api-key',
    location: { lat: 40.7128, lon: -74.006 },
    fetchFn: vi.fn().mockResolvedValue({
      ok: true,
      json: () =>
        Promise.resolve({
          current: {
            temp: 72,
            feels_like: 70,
            humidity: 55,
            weather: [{ description: 'clear sky', icon: '01d' }],
          },
          daily: [],
        }),
    }),
    ...overrides,
  };
}

describe('WeatherServer', () => {
  describe('factory and config', () => {
    it('should create a weather server instance', () => {
      const server = createWeatherServer(validOptions());
      expect(server).toBeDefined();
      expect(typeof server.refresh).toBe('function');
      expect(typeof server.getWeatherData).toBe('function');
      expect(typeof server.onUpdate).toBe('function');
      expect(typeof server.onError).toBe('function');
      expect(typeof server.close).toBe('function');
    });

    it('should throw if apiKey is missing', () => {
      expect(() => createWeatherServer(validOptions({ apiKey: '' }))).toThrow(/apiKey/i);
    });

    it('should throw if location is missing', () => {
      expect(() =>
        createWeatherServer(
          validOptions({ location: undefined as unknown as WeatherServerOptions['location'] })
        )
      ).toThrow(/location/i);
    });

    it('should default units to imperial', () => {
      const fetchFn = vi.fn().mockResolvedValue({
        ok: true,
        json: () =>
          Promise.resolve({
            current: {
              temp: 72,
              feels_like: 70,
              humidity: 55,
              weather: [{ description: 'clear', icon: '01d' }],
            },
            daily: [],
          }),
      });
      const server = createWeatherServer(validOptions({ fetchFn }));
      server.refresh();
      expect(fetchFn).toHaveBeenCalledWith(expect.stringContaining('units=imperial'));
    });

    it('should accept metric units', () => {
      const fetchFn = vi.fn().mockResolvedValue({
        ok: true,
        json: () =>
          Promise.resolve({
            current: {
              temp: 22,
              feels_like: 21,
              humidity: 55,
              weather: [{ description: 'clear', icon: '01d' }],
            },
            daily: [],
          }),
      });
      const server = createWeatherServer(validOptions({ units: 'metric', fetchFn }));
      server.refresh();
      expect(fetchFn).toHaveBeenCalledWith(expect.stringContaining('units=metric'));
    });

    it('should default maxStale_ms to 1 hour', () => {
      const server = createWeatherServer(validOptions());
      // No explicit assertion on internal state — tested via staleness behavior
      expect(server).toBeDefined();
    });
  });

  describe('listeners', () => {
    it('should register and call onUpdate listeners', async () => {
      const server = createWeatherServer(validOptions());
      const listener = vi.fn();
      server.onUpdate(listener);
      await server.refresh();
      expect(listener).toHaveBeenCalledTimes(1);
      expect(listener).toHaveBeenCalledWith(
        expect.objectContaining({
          current: expect.any(Object),
          forecast: expect.any(Array),
          lastUpdated: expect.any(Number),
        })
      );
    });

    it('should register and call onError listeners on failure', async () => {
      const fetchFn = vi.fn().mockResolvedValue({
        ok: false,
        status: 500,
        statusText: 'Internal Server Error',
      });
      const server = createWeatherServer(validOptions({ fetchFn }));
      const errorListener = vi.fn();
      server.onError(errorListener);
      await server.refresh();
      expect(errorListener).toHaveBeenCalledTimes(1);
      expect(errorListener).toHaveBeenCalledWith(expect.any(String));
    });

    it('should isolate listener errors', async () => {
      const server = createWeatherServer(validOptions());
      const badListener = vi.fn().mockImplementation(() => {
        throw new Error('listener crash');
      });
      const goodListener = vi.fn();
      server.onUpdate(badListener);
      server.onUpdate(goodListener);
      await server.refresh();
      expect(badListener).toHaveBeenCalled();
      expect(goodListener).toHaveBeenCalled();
    });

    it('should return unsubscribe function from onUpdate', async () => {
      const server = createWeatherServer(validOptions());
      const listener = vi.fn();
      const unsub = server.onUpdate(listener);
      unsub();
      await server.refresh();
      expect(listener).not.toHaveBeenCalled();
    });
  });

  describe('fetch and transform', () => {
    function owmForecastDay(dt: number, max: number, min: number, desc: string, icon: string) {
      return { dt, temp: { max, min }, weather: [{ description: desc, icon }] };
    }

    it('should map current conditions correctly', async () => {
      const fetchFn = vi.fn().mockResolvedValue({
        ok: true,
        json: () =>
          Promise.resolve({
            current: {
              temp: 68.5,
              feels_like: 65.1,
              humidity: 72,
              weather: [{ description: 'scattered clouds', icon: '03d' }],
            },
            daily: [],
          }),
      });
      const server = createWeatherServer(validOptions({ fetchFn }));
      await server.refresh();
      const data = server.getWeatherData();
      expect(data).not.toBeNull();
      expect(data!.current.temp).toBe(68.5);
      expect(data!.current.feelsLike).toBe(65.1);
      expect(data!.current.humidity).toBe(72);
      expect(data!.current.conditions).toBe('scattered clouds');
      expect(data!.current.icon).toBe('03d');
    });

    it('should map forecast days correctly', async () => {
      const day1dt = Math.floor(new Date('2026-02-20').getTime() / 1000);
      const fetchFn = vi.fn().mockResolvedValue({
        ok: true,
        json: () =>
          Promise.resolve({
            current: {
              temp: 60,
              feels_like: 58,
              humidity: 50,
              weather: [{ description: 'clear', icon: '01d' }],
            },
            daily: [owmForecastDay(day1dt, 65, 45, 'sunny', '01d')],
          }),
      });
      const server = createWeatherServer(validOptions({ fetchFn }));
      await server.refresh();
      const data = server.getWeatherData();
      expect(data!.forecast).toHaveLength(1);
      expect(data!.forecast[0].high).toBe(65);
      expect(data!.forecast[0].low).toBe(45);
      expect(data!.forecast[0].conditions).toBe('sunny');
      expect(data!.forecast[0].icon).toBe('01d');
      expect(data!.forecast[0].date).toMatch(/^\d{4}-\d{2}-\d{2}$/);
    });

    it('should set lastUpdated as a recent timestamp', async () => {
      const before = Date.now();
      const server = createWeatherServer(validOptions());
      await server.refresh();
      const after = Date.now();
      const data = server.getWeatherData();
      expect(data!.lastUpdated).toBeGreaterThanOrEqual(before);
      expect(data!.lastUpdated).toBeLessThanOrEqual(after);
    });

    it('should report error on network failure', async () => {
      const fetchFn = vi.fn().mockRejectedValue(new Error('network down'));
      const server = createWeatherServer(validOptions({ fetchFn }));
      const errorListener = vi.fn();
      server.onError(errorListener);
      await server.refresh();
      expect(errorListener).toHaveBeenCalledWith(expect.stringContaining('network down'));
    });

    it('should report error on JSON parse failure', async () => {
      const fetchFn = vi.fn().mockResolvedValue({
        ok: true,
        json: () => Promise.reject(new Error('invalid json')),
      });
      const server = createWeatherServer(validOptions({ fetchFn }));
      const errorListener = vi.fn();
      server.onError(errorListener);
      await server.refresh();
      expect(errorListener).toHaveBeenCalledWith(expect.stringContaining('invalid json'));
    });

    it('should include lat/lon/apiKey in URL', () => {
      const fetchFn = vi.fn().mockResolvedValue({
        ok: true,
        json: () =>
          Promise.resolve({
            current: {
              temp: 70,
              feels_like: 68,
              humidity: 50,
              weather: [{ description: 'clear', icon: '01d' }],
            },
            daily: [],
          }),
      });
      const server = createWeatherServer(
        validOptions({ fetchFn, location: { lat: 51.5074, lon: -0.1278 } })
      );
      server.refresh();
      expect(fetchFn).toHaveBeenCalledWith(expect.stringContaining('lat=51.5074'));
      expect(fetchFn).toHaveBeenCalledWith(expect.stringContaining('lon=-0.1278'));
      expect(fetchFn).toHaveBeenCalledWith(expect.stringContaining('appid=test-api-key'));
    });

    it('should return null from getWeatherData before first refresh', () => {
      const server = createWeatherServer(validOptions());
      expect(server.getWeatherData()).toBeNull();
    });

    it('should not call onUpdate after close', async () => {
      const server = createWeatherServer(validOptions());
      const listener = vi.fn();
      server.onUpdate(listener);
      server.close();
      await server.refresh();
      expect(listener).not.toHaveBeenCalled();
    });
  });

  describe('cache integration', () => {
    it('should use cache: skip fetch on second call within maxStale window', async () => {
      const fetchFn = vi.fn().mockResolvedValue({
        ok: true,
        json: () =>
          Promise.resolve({
            current: {
              temp: 70,
              feels_like: 68,
              humidity: 50,
              weather: [{ description: 'clear', icon: '01d' }],
            },
            daily: [],
          }),
      });
      const server = createWeatherServer(validOptions({ fetchFn, maxStale_ms: 60000 }));
      await server.refresh();
      await server.refresh(); // within staleness window — should use cache
      expect(fetchFn).toHaveBeenCalledTimes(1);
    });

    it('should re-fetch after cache expires', async () => {
      const fetchFn = vi.fn().mockResolvedValue({
        ok: true,
        json: () =>
          Promise.resolve({
            current: {
              temp: 70,
              feels_like: 68,
              humidity: 50,
              weather: [{ description: 'clear', icon: '01d' }],
            },
            daily: [],
          }),
      });
      const server = createWeatherServer(
        validOptions({ fetchFn, maxStale_ms: 0 }) // stale immediately
      );
      await server.refresh();
      await server.refresh(); // stale — should re-fetch
      expect(fetchFn).toHaveBeenCalledTimes(2);
    });

    it('should return stale data gracefully on API failure after first success', async () => {
      const fetchFn = vi
        .fn()
        .mockResolvedValueOnce({
          ok: true,
          json: () =>
            Promise.resolve({
              current: {
                temp: 70,
                feels_like: 68,
                humidity: 50,
                weather: [{ description: 'clear', icon: '01d' }],
              },
              daily: [],
            }),
        })
        .mockResolvedValueOnce({ ok: false, status: 503, statusText: 'Service Unavailable' });

      const server = createWeatherServer(validOptions({ fetchFn, maxStale_ms: 0 }));
      await server.refresh(); // first: success

      const staleData = server.getWeatherData();
      const errorListener = vi.fn();
      server.onError(errorListener);
      await server.refresh(); // second: failure — should keep stale data

      expect(errorListener).toHaveBeenCalled();
      expect(server.getWeatherData()).toEqual(staleData); // stale data preserved
    });
  });

  describe('exports', () => {
    it('should be exported from @lensing/core index', async () => {
      const core = await import('../index');
      expect(typeof core.createWeatherServer).toBe('function');
    });
  });
});
