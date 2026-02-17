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

  let notifying = false;

  function notifyChange() {
    // Guard against re-entrant updates
    if (notifying) return;
    notifying = true;

    try {
      for (const callback of callbacks) {
        try {
          callback();
        } catch (err) {
          // Isolate callback errors to prevent one bad listener from breaking others
          console.error('Error in weather store listener:', err);
        }
      }
    } finally {
      notifying = false;
    }
  }

  return {
    getState() {
      if (!data) {
        return {
          data: null,
          isLoading,
          error,
        };
      }

      return {
        data: {
          current: {
            temp: data.current.temp,
            feelsLike: data.current.feelsLike,
            conditions: data.current.conditions,
            humidity: data.current.humidity,
            icon: data.current.icon,
          },
          forecast: data.forecast.map((day) => ({
            date: day.date,
            high: day.high,
            low: day.low,
            conditions: day.conditions,
            icon: day.icon,
          })),
          lastUpdated: data.lastUpdated,
        },
        isLoading,
        error,
      };
    },

    setWeatherData(newData) {
      // Create explicit copies to prevent external mutations
      data = {
        current: {
          temp: newData.current.temp,
          feelsLike: newData.current.feelsLike,
          conditions: newData.current.conditions,
          humidity: newData.current.humidity,
          icon: newData.current.icon,
        },
        forecast: newData.forecast.map((day) => ({
          date: day.date,
          high: day.high,
          low: day.low,
          conditions: day.conditions,
          icon: day.icon,
        })),
        lastUpdated: newData.lastUpdated,
      };
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
      // Validate lastUpdated is a finite number
      if (!Number.isFinite(data.lastUpdated)) return true;
      const age = Date.now() - data.lastUpdated;
      return age > maxStale_ms;
    },

    getCurrentConditions() {
      if (!data?.current) return null;
      return {
        temp: data.current.temp,
        feelsLike: data.current.feelsLike,
        conditions: data.current.conditions,
        humidity: data.current.humidity,
        icon: data.current.icon,
      };
    },

    getForecast(limit) {
      if (!data) return [];
      const forecast = data.forecast.map((day) => ({
        date: day.date,
        high: day.high,
        low: day.low,
        conditions: day.conditions,
        icon: day.icon,
      }));
      if (limit !== undefined) {
        // Normalize limit to non-negative integer
        const normalizedLimit = Math.max(0, Math.floor(limit));
        return forecast.slice(0, normalizedLimit);
      }
      return forecast;
    },

    onChange(callback) {
      callbacks.push(callback);
    },
  };
}
