// Weather data types (mirrored from @lensing/ui — core cannot depend on ui)

/** Current weather conditions */
export interface WeatherCurrent {
  temp: number;
  feelsLike: number;
  conditions: string;
  humidity: number;
  icon: string;
}

/** A single day in the weather forecast */
export interface WeatherForecastDay {
  date: string; // ISO date string (YYYY-MM-DD)
  high: number;
  low: number;
  conditions: string;
  icon: string;
}

/** Full weather data payload */
export interface WeatherData {
  current: WeatherCurrent;
  forecast: WeatherForecastDay[];
  lastUpdated: number; // Unix timestamp in ms
}

/** Fetch function signature (matches global `fetch`) */
export type FetchFn = (url: string) => Promise<{
  ok: boolean;
  status?: number;
  statusText?: string;
  json: () => Promise<unknown>;
}>;

/** Location for weather queries */
export interface WeatherLocation {
  lat: number;
  lon: number;
}

/** Configuration for createWeatherServer */
export interface WeatherServerOptions {
  /** OpenWeatherMap API key */
  apiKey: string;
  /** Geographic location to query */
  location: WeatherLocation;
  /** Unit system: 'imperial' (°F) or 'metric' (°C) */
  units?: 'imperial' | 'metric';
  /** Max staleness in ms before considering cache stale (default: 3600000 = 1 hour) */
  maxStale_ms?: number;
  /** Refresh interval in ms (default: 600000 = 10 min) */
  refreshInterval_ms?: number;
  /** Injectable fetch function (defaults to global fetch) */
  fetchFn?: FetchFn;
}

/** Instance returned by createWeatherServer */
export interface WeatherServerInstance {
  /** Manually trigger a weather data refresh */
  refresh(): Promise<void>;
  /** Get the last fetched weather data (null if not yet fetched) */
  getWeatherData(): WeatherData | null;
  /** Register a listener called when new data arrives; returns unsubscribe */
  onUpdate(callback: (data: WeatherData) => void): () => void;
  /** Register a listener called when an error occurs */
  onError(callback: (error: string) => void): void;
  /** Stop background refresh and release resources */
  close(): void;
}

// ── OpenWeatherMap response types ─────────────────────────────────────────────

interface OWMCurrentWeather {
  description: string;
  icon: string;
}

interface OWMCurrent {
  temp: number;
  feels_like: number;
  humidity: number;
  weather: OWMCurrentWeather[];
}

interface OWMDailyWeather {
  description: string;
  icon: string;
}

interface OWMDaily {
  dt: number;
  temp: { max: number; min: number };
  weather: OWMDailyWeather[];
}

interface OWMResponse {
  current: OWMCurrent;
  daily: OWMDaily[];
}

// ── Transform ─────────────────────────────────────────────────────────────────

function transformCurrent(c: OWMCurrent): WeatherCurrent {
  const w = c.weather[0] ?? { description: 'unknown', icon: '' };
  return {
    temp: c.temp,
    feelsLike: c.feels_like,
    humidity: c.humidity,
    conditions: w.description,
    icon: w.icon,
  };
}

function transformForecast(daily: OWMDaily[]): WeatherForecastDay[] {
  return daily.map((d) => {
    const w = d.weather[0] ?? { description: 'unknown', icon: '' };
    return {
      date: new Date(d.dt * 1000).toISOString().split('T')[0],
      high: d.temp.max,
      low: d.temp.min,
      conditions: w.description,
      icon: w.icon,
    };
  });
}

// ── Factory ───────────────────────────────────────────────────────────────────

/**
 * Creates a weather server module that fetches, caches, and publishes weather data.
 */
export function createWeatherServer(options: WeatherServerOptions): WeatherServerInstance {
  const {
    apiKey,
    location,
    units = 'imperial',
    fetchFn = fetch as unknown as FetchFn,
  } = options;

  if (!apiKey) {
    throw new Error('WeatherServer: apiKey is required');
  }
  if (!location) {
    throw new Error('WeatherServer: location is required');
  }

  const maxStale_ms = options.maxStale_ms ?? 3600000;

  let lastData: WeatherData | null = null;
  let lastFetchedAt: number | null = null;
  const updateListeners: Array<(data: WeatherData) => void> = [];
  const errorListeners: Array<(error: string) => void> = [];
  let closed = false;

  function notifyUpdate(data: WeatherData): void {
    for (const cb of updateListeners) {
      try {
        cb(data);
      } catch {
        // isolate listener errors
      }
    }
  }

  function notifyError(message: string): void {
    for (const cb of errorListeners) {
      try {
        cb(message);
      } catch {
        // isolate listener errors
      }
    }
  }

  function buildUrl(): string {
    const base = 'https://api.openweathermap.org/data/3.0/onecall';
    return `${base}?lat=${location.lat}&lon=${location.lon}&units=${units}&appid=${apiKey}&exclude=minutely,hourly,alerts`;
  }

  async function refresh(): Promise<void> {
    if (closed) return;

    // Return cached data if still fresh
    if (lastFetchedAt !== null && maxStale_ms > 0 && Date.now() - lastFetchedAt < maxStale_ms) {
      return;
    }

    let response: Awaited<ReturnType<FetchFn>>;
    try {
      response = await fetchFn(buildUrl());
    } catch (err) {
      const message = err instanceof Error ? err.message : String(err);
      notifyError(`Weather fetch failed: ${message}`);
      return;
    }

    if (!response.ok) {
      notifyError(`Weather API error ${response.status ?? ''}: ${response.statusText ?? 'unknown'}`);
      return;
    }

    let raw: OWMResponse;
    try {
      raw = (await response.json()) as OWMResponse;
    } catch (err) {
      const message = err instanceof Error ? err.message : String(err);
      notifyError(`Weather response parse error: ${message}`);
      return;
    }

    const data: WeatherData = {
      current: transformCurrent(raw.current),
      forecast: transformForecast(raw.daily),
      lastUpdated: Date.now(),
    };

    lastData = data;
    lastFetchedAt = Date.now();
    notifyUpdate(data);
  }

  return {
    refresh,

    getWeatherData(): WeatherData | null {
      return lastData;
    },

    onUpdate(callback: (data: WeatherData) => void): () => void {
      updateListeners.push(callback);
      return () => {
        const idx = updateListeners.indexOf(callback);
        if (idx !== -1) updateListeners.splice(idx, 1);
      };
    },

    onError(callback: (error: string) => void): void {
      errorListeners.push(callback);
    },

    close(): void {
      closed = true;
    },
  };
}
