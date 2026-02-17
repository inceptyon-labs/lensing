import { describe, it, expect, beforeEach, vi } from 'vitest';
import { createWeatherStore } from '../weather-store';

describe('WeatherStore', () => {
  let mockWeatherData: any;
  let store: ReturnType<typeof createWeatherStore>;

  beforeEach(() => {
    // Create fresh mock data for each test to avoid cross-test mutations
    mockWeatherData = {
      current: {
        temp: 72,
        feelsLike: 70,
        conditions: 'Partly Cloudy',
        humidity: 65,
        icon: 'partly-cloudy',
      },
      forecast: [
        { date: '2026-02-17', high: 75, low: 65, conditions: 'Sunny', icon: 'sunny' },
        { date: '2026-02-18', high: 68, low: 60, conditions: 'Rainy', icon: 'rainy' },
        { date: '2026-02-19', high: 70, low: 62, conditions: 'Cloudy', icon: 'cloudy' },
      ],
      lastUpdated: Date.now(),
    };
    store = createWeatherStore({
      maxStale_ms: 3600000, // 1 hour
    });
  });

  describe('initial state', () => {
    it('should start with no data', () => {
      const state = store.getState();
      expect(state.data).toBeNull();
    });

    it('should start with loading false', () => {
      const state = store.getState();
      expect(state.isLoading).toBe(false);
    });

    it('should start with no error', () => {
      const state = store.getState();
      expect(state.error).toBeNull();
    });
  });

  describe('setWeatherData', () => {
    it('should store weather data', () => {
      store.setWeatherData(mockWeatherData);
      const state = store.getState();
      expect(state.data).toEqual(mockWeatherData);
    });

    it('should clear error on successful data set', () => {
      store.setError('Previous error');
      store.setWeatherData(mockWeatherData);
      const state = store.getState();
      expect(state.error).toBeNull();
    });

    it('should set loading to false', () => {
      store.setLoading(true);
      store.setWeatherData(mockWeatherData);
      const state = store.getState();
      expect(state.isLoading).toBe(false);
    });
  });

  describe('setLoading', () => {
    it('should set loading state to true', () => {
      store.setLoading(true);
      const state = store.getState();
      expect(state.isLoading).toBe(true);
    });

    it('should set loading state to false', () => {
      store.setLoading(true);
      store.setLoading(false);
      const state = store.getState();
      expect(state.isLoading).toBe(false);
    });
  });

  describe('setError', () => {
    it('should set error message', () => {
      store.setError('Failed to fetch weather');
      const state = store.getState();
      expect(state.error).toBe('Failed to fetch weather');
    });

    it('should clear data on error', () => {
      store.setWeatherData(mockWeatherData);
      store.setError('Failed to fetch weather');
      const state = store.getState();
      expect(state.data).toBeNull();
    });

    it('should set loading to false', () => {
      store.setLoading(true);
      store.setError('Failed to fetch weather');
      const state = store.getState();
      expect(state.isLoading).toBe(false);
    });
  });

  describe('isStale', () => {
    it('should return false when data is fresh', () => {
      const fresh = { ...mockWeatherData, lastUpdated: Date.now() };
      store.setWeatherData(fresh);
      expect(store.isStale()).toBe(false);
    });

    it('should return true when data exceeds maxStale', () => {
      const stale = {
        ...mockWeatherData,
        lastUpdated: Date.now() - 3600001, // 1 hour + 1ms
      };
      store.setWeatherData(stale);
      expect(store.isStale()).toBe(true);
    });

    it('should return false when no data', () => {
      expect(store.isStale()).toBe(false);
    });

    it('should handle custom maxStale threshold', () => {
      const customStore = createWeatherStore({ maxStale_ms: 1800000 }); // 30 min
      const data = {
        ...mockWeatherData,
        lastUpdated: Date.now() - 1800001, // 30 min + 1ms
      };
      customStore.setWeatherData(data);
      expect(customStore.isStale()).toBe(true);
    });
  });

  describe('getCurrentConditions', () => {
    it('should return current conditions', () => {
      store.setWeatherData(mockWeatherData);
      const current = store.getCurrentConditions();
      expect(current).toEqual(mockWeatherData.current);
    });

    it('should return null when no data', () => {
      const current = store.getCurrentConditions();
      expect(current).toBeNull();
    });
  });

  describe('getForecast', () => {
    it('should return forecast array', () => {
      store.setWeatherData(mockWeatherData);
      const forecast = store.getForecast();
      expect(forecast).toEqual(mockWeatherData.forecast);
    });

    it('should return empty array when no data', () => {
      const forecast = store.getForecast();
      expect(forecast).toEqual([]);
    });

    it('should limit forecast to specified days', () => {
      store.setWeatherData(mockWeatherData);
      const forecast = store.getForecast(2);
      expect(forecast).toHaveLength(2);
      expect(forecast).toEqual(mockWeatherData.forecast.slice(0, 2));
    });
  });

  describe('immutability', () => {
    it('should not allow mutation of returned data through mutation of input', () => {
      const input = { ...mockWeatherData };
      store.setWeatherData(input);
      input.current.temp = 999;
      const current = store.getCurrentConditions();
      expect(current?.temp).toBe(72);
    });

    it('should not allow mutation of returned state data', () => {
      store.setWeatherData(mockWeatherData);
      const state = store.getState();
      if (state.data) {
        state.data.current.temp = 999;
      }
      const current = store.getCurrentConditions();
      expect(current?.temp).toBe(72);
    });

    it('should not allow mutation of forecast array from getState', () => {
      store.setWeatherData(mockWeatherData);
      const state = store.getState();
      if (state.data) {
        state.data.forecast.push({
          date: '2026-02-20',
          high: 80,
          low: 70,
          conditions: 'Sunny',
          icon: 'sunny',
        });
      }
      const forecast = store.getForecast();
      expect(forecast).toHaveLength(3);
    });

    it('should not allow mutation of forecast through getForecast', () => {
      store.setWeatherData(mockWeatherData);
      const forecast = store.getForecast();
      forecast[0].high = 999;
      const retrieved = store.getForecast();
      expect(retrieved[0].high).toBe(75);
    });
  });

  describe('callback robustness', () => {
    it('should isolate callback errors from other listeners', () => {
      const goodCallback = vi.fn();
      const badCallback = vi.fn(() => {
        throw new Error('Callback error');
      });
      const anotherGoodCallback = vi.fn();

      store.onChange(goodCallback);
      store.onChange(badCallback);
      store.onChange(anotherGoodCallback);

      store.setWeatherData(mockWeatherData);

      expect(goodCallback).toHaveBeenCalledTimes(1);
      expect(badCallback).toHaveBeenCalledTimes(1);
      expect(anotherGoodCallback).toHaveBeenCalledTimes(1);
    });
  });

  describe('re-entrancy guard', () => {
    it('should prevent infinite recursion from callback updates', () => {
      const callback = vi.fn(() => {
        store.setLoading(true);
      });
      store.onChange(callback);
      store.setWeatherData(mockWeatherData);
      // Only called once, not recursively
      expect(callback).toHaveBeenCalledTimes(1);
    });
  });

  describe('staleness edge cases', () => {
    it('should treat NaN lastUpdated as stale', () => {
      const badData = {
        ...mockWeatherData,
        lastUpdated: NaN,
      };
      store.setWeatherData(badData);
      expect(store.isStale()).toBe(true);
    });

    it('should treat Infinity lastUpdated as stale', () => {
      const badData = {
        ...mockWeatherData,
        lastUpdated: Infinity,
      };
      store.setWeatherData(badData);
      expect(store.isStale()).toBe(true);
    });
  });

  describe('getForecast limit normalization', () => {
    it('should normalize negative limit to 0', () => {
      store.setWeatherData(mockWeatherData);
      const forecast = store.getForecast(-5);
      expect(forecast).toHaveLength(0);
    });

    it('should normalize float limit to floor', () => {
      store.setWeatherData(mockWeatherData);
      const forecast = store.getForecast(1.9);
      expect(forecast).toHaveLength(1);
    });

    it('should handle very large limits', () => {
      store.setWeatherData(mockWeatherData);
      const forecast = store.getForecast(999999);
      expect(forecast).toHaveLength(3);
    });
  });

  describe('onChange callback', () => {
    it('should fire callback when data changes', () => {
      const callback = vi.fn();
      store.onChange(callback);
      store.setWeatherData(mockWeatherData);
      expect(callback).toHaveBeenCalledTimes(1);
    });

    it('should fire callback when loading changes', () => {
      const callback = vi.fn();
      store.onChange(callback);
      store.setLoading(true);
      expect(callback).toHaveBeenCalledTimes(1);
    });

    it('should fire callback when error changes', () => {
      const callback = vi.fn();
      store.onChange(callback);
      store.setError('Test error');
      expect(callback).toHaveBeenCalledTimes(1);
    });

    it('should support multiple callbacks', () => {
      const cb1 = vi.fn();
      const cb2 = vi.fn();
      store.onChange(cb1);
      store.onChange(cb2);
      store.setWeatherData(mockWeatherData);
      expect(cb1).toHaveBeenCalledTimes(1);
      expect(cb2).toHaveBeenCalledTimes(1);
    });
  });
});
