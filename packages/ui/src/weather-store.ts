export interface WeatherCurrent {
  temp: number;
  feelsLike: number;
  conditions: string;
  humidity: number;
  icon: string;
}

export interface WeatherForecastDay {
  date: string;
  high: number;
  low: number;
  conditions: string;
  icon: string;
}

export interface WeatherData {
  current: WeatherCurrent;
  forecast: WeatherForecastDay[];
  lastUpdated: number;
}

export interface WeatherStoreOptions {
  maxStale_ms?: number;
}

export interface WeatherStoreState {
  data: WeatherData | null;
  isLoading: boolean;
  error: string | null;
}

export interface WeatherStore {
  getState(): WeatherStoreState;
  setWeatherData(data: WeatherData): void;
  setLoading(loading: boolean): void;
  setError(error: string): void;
  isStale(): boolean;
  getCurrentConditions(): WeatherCurrent | null;
  getForecast(limit?: number): WeatherForecastDay[];
  onChange(callback: () => void): void;
}

export function createWeatherStore(options: WeatherStoreOptions = {}): WeatherStore {
  const { maxStale_ms = 3600000 } = options; // default 1 hour

  let data: WeatherData | null = null;
  let isLoading = false;
  let error: string | null = null;
  const callbacks: Array<() => void> = [];

  function notifyChange() {
    for (const callback of callbacks) {
      callback();
    }
  }

  return {
    getState() {
      return { data, isLoading, error };
    },

    setWeatherData(newData) {
      data = newData;
      error = null;
      isLoading = false;
      notifyChange();
    },

    setLoading(loading) {
      isLoading = loading;
      notifyChange();
    },

    setError(errorMessage) {
      error = errorMessage;
      data = null;
      isLoading = false;
      notifyChange();
    },

    isStale() {
      if (!data) return false;
      const age = Date.now() - data.lastUpdated;
      return age > maxStale_ms;
    },

    getCurrentConditions() {
      return data?.current ?? null;
    },

    getForecast(limit) {
      if (!data) return [];
      if (limit !== undefined) {
        return data.forecast.slice(0, limit);
      }
      return data.forecast;
    },

    onChange(callback) {
      callbacks.push(callback);
    },
  };
}
