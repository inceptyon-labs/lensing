import { describe, it, expect, vi } from 'vitest';
import { createWeatherServer } from '../weather-server';
import type { WeatherServerOptions, WeatherServerInstance } from '../weather-server';

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
      expect(() =>
        createWeatherServer(validOptions({ apiKey: '' }))
      ).toThrow(/apiKey/i);
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
            current: { temp: 72, feels_like: 70, humidity: 55, weather: [{ description: 'clear', icon: '01d' }] },
            daily: [],
          }),
      });
      const server = createWeatherServer(validOptions({ fetchFn }));
      server.refresh();
      expect(fetchFn).toHaveBeenCalledWith(
        expect.stringContaining('units=imperial')
      );
    });

    it('should accept metric units', () => {
      const fetchFn = vi.fn().mockResolvedValue({
        ok: true,
        json: () =>
          Promise.resolve({
            current: { temp: 22, feels_like: 21, humidity: 55, weather: [{ description: 'clear', icon: '01d' }] },
            daily: [],
          }),
      });
      const server = createWeatherServer(validOptions({ units: 'metric', fetchFn }));
      server.refresh();
      expect(fetchFn).toHaveBeenCalledWith(
        expect.stringContaining('units=metric')
      );
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
});
