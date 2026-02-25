import type { DataBusInstance, WeatherProvider } from '@lensing/types';

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
  /** Weather data provider (default: 'open-meteo') */
  provider?: WeatherProvider;
  /** API key (required for OpenWeatherMap, ignored for Open-Meteo) */
  apiKey?: string;
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
  /** Optional data bus to publish weather data after each refresh */
  dataBus?: DataBusInstance;
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

// ── WMO Weather Code Mapping ──────────────────────────────────────────────────

/** Map WMO weather interpretation codes to human-readable conditions */
export const WMO_CODE_MAP: Record<number, string> = {
  0: 'Clear sky',
  1: 'Mostly clear',
  2: 'Partly cloudy',
  3: 'Overcast',
  45: 'Fog',
  48: 'Fog',
  51: 'Drizzle',
  53: 'Drizzle',
  55: 'Drizzle',
  56: 'Freezing drizzle',
  57: 'Freezing drizzle',
  61: 'Rain',
  63: 'Rain',
  65: 'Rain',
  66: 'Freezing rain',
  67: 'Freezing rain',
  71: 'Snow',
  73: 'Snow',
  75: 'Snow',
  77: 'Snow grains',
  80: 'Rain showers',
  81: 'Rain showers',
  82: 'Rain showers',
  85: 'Snow showers',
  86: 'Snow showers',
  95: 'Thunderstorm',
  96: 'Thunderstorm',
  99: 'Thunderstorm',
};

function wmoToConditions(code: number): string {
  return WMO_CODE_MAP[code] ?? 'Unknown';
}

// ── Open-Meteo response types ─────────────────────────────────────────────────

interface OpenMeteoCurrentUnits {
  temperature_2m: string;
}

interface OpenMeteoCurrent {
  temperature_2m: number;
  apparent_temperature: number;
  weather_code: number;
  relative_humidity_2m: number;
}

interface OpenMeteoDaily {
  time: string[];
  temperature_2m_max: number[];
  temperature_2m_min: number[];
  weather_code: number[];
}

interface OpenMeteoResponse {
  current: OpenMeteoCurrent;
  current_units?: OpenMeteoCurrentUnits;
  daily: OpenMeteoDaily;
}

function transformOpenMeteoCurrent(c: OpenMeteoCurrent): WeatherCurrent {
  return {
    temp: c.temperature_2m,
    feelsLike: c.apparent_temperature,
    humidity: c.relative_humidity_2m,
    conditions: wmoToConditions(c.weather_code),
    icon: '',
  };
}

function transformOpenMeteoForecast(daily: OpenMeteoDaily): WeatherForecastDay[] {
  return daily.time.map((date, i) => ({
    date,
    high: daily.temperature_2m_max[i],
    low: daily.temperature_2m_min[i],
    conditions: wmoToConditions(daily.weather_code[i]),
    icon: '',
  }));
}

function buildOpenMeteoUrl(location: WeatherLocation, units: 'imperial' | 'metric'): string {
  const tempUnit = units === 'imperial' ? 'fahrenheit' : 'celsius';
  return (
    `https://api.open-meteo.com/v1/forecast` +
    `?latitude=${location.lat}&longitude=${location.lon}` +
    `&current=temperature_2m,apparent_temperature,weather_code,relative_humidity_2m` +
    `&daily=temperature_2m_max,temperature_2m_min,weather_code` +
    `&timezone=auto&forecast_days=5&temperature_unit=${tempUnit}`
  );
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
    provider = 'open-meteo',
    apiKey,
    location,
    units = 'imperial',
    fetchFn = fetch as unknown as FetchFn,
    dataBus,
  } = options;

  if (provider === 'openweathermap' && !apiKey) {
    throw new Error('WeatherServer: apiKey is required for OpenWeatherMap provider');
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
    if (provider === 'open-meteo') {
      return buildOpenMeteoUrl(location, units);
    }
    const base = 'https://api.openweathermap.org/data/3.0/onecall';
    return `${base}?lat=${location.lat}&lon=${location.lon}&units=${units}&appid=${apiKey}&exclude=minutely,hourly,alerts`;
  }

  function transformResponse(raw: unknown): WeatherData | null {
    if (provider === 'open-meteo') {
      const om = raw as OpenMeteoResponse;
      if (!om.current || !om.daily) {
        notifyError('Weather response missing required fields: current or daily');
        return null;
      }
      return {
        current: transformOpenMeteoCurrent(om.current),
        forecast: transformOpenMeteoForecast(om.daily),
        lastUpdated: Date.now(),
      };
    }
    // OpenWeatherMap
    const owm = raw as OWMResponse;
    if (!owm.current || !Array.isArray(owm.daily)) {
      notifyError('Weather response missing required fields: current or daily');
      return null;
    }
    return {
      current: transformCurrent(owm.current),
      forecast: transformForecast(owm.daily),
      lastUpdated: Date.now(),
    };
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
      notifyError(
        `Weather API error ${response.status ?? ''}: ${response.statusText ?? 'unknown'}`
      );
      return;
    }

    let raw: unknown;
    try {
      raw = await response.json();
    } catch (err) {
      const message = err instanceof Error ? err.message : String(err);
      notifyError(`Weather response parse error: ${message}`);
      return;
    }

    const data = transformResponse(raw);
    if (!data) return;

    lastData = data;
    lastFetchedAt = Date.now();
    notifyUpdate(data);
    if (dataBus) {
      dataBus.publish('weather.current', 'weather-server', data);
    }
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
