import { describe, it, expect, beforeEach, vi } from 'vitest';
import { createWeatherStore } from '../weather-store';

describe('WeatherStore', () => {
  const mockWeatherData = {
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

  let store: ReturnType<typeof createWeatherStore>;

  beforeEach(() => {
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
