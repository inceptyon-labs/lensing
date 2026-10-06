import type {
  DataBusInstance,
  WeatherAlert,
  WeatherAlertSeverity,
  WeatherAlertsData,
  WeatherNowcast,
  WeatherProvider,
} from '@lensing/types';
import { WEATHER_ALERTS_CHANNEL, WEATHER_ALERTS_PLUGIN_ID } from '@lensing/types';

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
  /** Probability of precipitation as a percentage (0–100) */
  precipChance?: number;
}

/** Full weather data payload */
export interface WeatherData {
  current: WeatherCurrent;
  forecast: WeatherForecastDay[];
  /** Open-Meteo only; times are Unix ms */
  nowcast?: WeatherNowcast;
  lastUpdated: number; // Unix timestamp in ms
}

/** Fetch function signature (matches global `fetch`) */
export type FetchFn = (
  url: string,
  init?: RequestInit
) => Promise<{
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
  /** Geographic location to query (required if locationQuery not set) */
  location?: WeatherLocation;
  /** City name, zip code, or place to geocode (alternative to location) */
  locationQuery?: string;
  /** Unit system: 'imperial' (°F) or 'metric' (°C) */
  units?: 'imperial' | 'metric';
  /** Max staleness in ms before considering cache stale (default: 3600000 = 1 hour) */
  maxStale_ms?: number;
  /** Refresh interval in ms (default: 600000 = 10 min) */
  refreshInterval_ms?: number;
  /** Injectable fetch function (defaults to global fetch) */
  fetchFn?: FetchFn;
  /** Poll NWS active alerts for the location (default: true) */
  alerts?: boolean;
  /** NWS alerts poll interval in ms (default: 300000 = 5 min) */
  alertsInterval_ms?: number;
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
  precipitation_probability_max?: number[];
}

interface OpenMeteoResponse {
  current: OpenMeteoCurrent;
  current_units?: OpenMeteoCurrentUnits;
  daily: OpenMeteoDaily;
  utc_offset_seconds?: number;
  minutely_15?: {
    time: string[];
    precipitation: number[];
    precipitation_probability?: Array<number | null>;
  };
  hourly?: { time: string[]; uv_index: number[] };
}

/** Local wall-clock 'YYYY-MM-DDTHH:mm' to Unix ms, independent of host timezone */
function localToUnixMs(time: string, utcOffsetSeconds: number): number {
  const m = /^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2})/.exec(time);
  if (!m) return NaN;
  const [y, mo, d, h, min] = m.slice(1).map(Number);
  return Date.UTC(y, mo - 1, d, h, min) - utcOffsetSeconds * 1000;
}

function transformNowcast(om: OpenMeteoResponse): WeatherNowcast | undefined {
  const { minutely_15: m, hourly: h } = om;
  if (!m || !h || !Array.isArray(m.time) || !Array.isArray(h.time)) return undefined;
  if (!Array.isArray(m.precipitation) || !Array.isArray(h.uv_index)) return undefined;
  const offset = om.utc_offset_seconds ?? 0;
  return {
    precipitation: m.time.map((t, i) => {
      const prob = m.precipitation_probability?.[i];
      return {
        time: localToUnixMs(t, offset),
        mm: m.precipitation[i],
        ...(prob != null ? { probability: prob } : {}),
      };
    }),
    uv: h.time.map((t, i) => ({ time: localToUnixMs(t, offset), index: h.uv_index[i] })),
  };
}

// ── NWS alerts ────────────────────────────────────────────────────────────────

const NWS_HEADERS = {
  'User-Agent': 'Lensing dashboard (github.com/inceptyon-labs/lensing)',
  Accept: 'application/geo+json',
};

const SEVERITY_RANK: Record<WeatherAlertSeverity, number> = {
  Extreme: 0,
  Severe: 1,
  Moderate: 2,
  Minor: 3,
  Unknown: 4,
};

interface NwsProperties {
  id?: string;
  event?: string;
  headline?: string | null;
  severity?: string;
  urgency?: string;
  messageType?: string;
  onset?: string | null;
  expires?: string | null;
  ends?: string | null;
}

function parseTime(value: string | null | undefined): number | null {
  if (!value) return null;
  const t = Date.parse(value);
  return Number.isNaN(t) ? null : t;
}

function transformNwsAlerts(raw: unknown, now: number): WeatherAlert[] {
  const features = (raw as { features?: Array<{ properties?: NwsProperties }> } | null)?.features;
  if (!Array.isArray(features)) throw new Error('NWS response missing features');
  const alerts: WeatherAlert[] = [];
  for (const f of features) {
    const p = f.properties;
    if (!p || p.messageType === 'Cancel') continue;
    const ends = parseTime(p.ends);
    const expires = parseTime(p.expires);
    const end = ends ?? expires;
    if (end !== null && end <= now) continue;
    const event = p.event ?? 'Alert';
    const severity =
      p.severity && p.severity in SEVERITY_RANK ? (p.severity as WeatherAlertSeverity) : 'Unknown';
    alerts.push({
      id: p.id ?? `${event}-${p.onset ?? ''}`,
      event,
      headline: p.headline ?? event,
      severity,
      urgency: p.urgency ?? 'Unknown',
      onset: parseTime(p.onset),
      ends,
      expires: expires ?? ends ?? now,
    });
  }
  return alerts.sort(
    (a, b) =>
      SEVERITY_RANK[a.severity] - SEVERITY_RANK[b.severity] ||
      (a.onset ?? Infinity) - (b.onset ?? Infinity)
  );
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
    precipChance: daily.precipitation_probability_max?.[i],
  }));
}

function buildOpenMeteoUrl(location: WeatherLocation, units: 'imperial' | 'metric'): string {
  const tempUnit = units === 'imperial' ? 'fahrenheit' : 'celsius';
  return (
    `https://api.open-meteo.com/v1/forecast` +
    `?latitude=${location.lat}&longitude=${location.lon}` +
    `&current=temperature_2m,apparent_temperature,weather_code,relative_humidity_2m` +
    `&daily=temperature_2m_max,temperature_2m_min,weather_code,precipitation_probability_max` +
    `&minutely_15=precipitation,precipitation_probability&forecast_minutely_15=24` +
    `&hourly=uv_index&forecast_hours=24` +
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
  pop?: number; // probability of precipitation (0–1)
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
      precipChance: d.pop != null ? Math.round(d.pop * 100) : undefined,
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
    locationQuery,
    units = 'imperial',
    fetchFn = fetch as unknown as FetchFn,
    dataBus,
  } = options;

  if (provider === 'openweathermap' && !apiKey) {
    throw new Error('WeatherServer: apiKey is required for OpenWeatherMap provider');
  }
  if (!options.location && !locationQuery) {
    throw new Error('WeatherServer: location or locationQuery is required');
  }

  // Mutable location — resolved from geocoding or provided directly
  let location: WeatherLocation | undefined = options.location;
  let geocodeResolved = !locationQuery; // skip geocoding if no query

  const maxStale_ms = options.maxStale_ms ?? 3600000;
  const alertsEnabled = options.alerts ?? true;
  const alertsInterval_ms = options.alertsInterval_ms ?? 300_000;
  let alertsTimer: ReturnType<typeof setInterval> | null = null;
  let alertsStarted = false;
  let alertsStopped = false;

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

  async function resolveGeocode(): Promise<boolean> {
    if (geocodeResolved) return true;

    let response: Awaited<ReturnType<FetchFn>>;
    try {
      const url = `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(locationQuery!)}&count=1`;
      response = await fetchFn(url);
    } catch (err) {
      const message = err instanceof Error ? err.message : String(err);
      notifyError(`Geocoding failed: ${message}`);
      return false;
    }

    if (!response.ok) {
      notifyError(`Geocoding failed: HTTP ${response.status ?? ''} ${response.statusText ?? ''}`);
      return false;
    }

    let data: unknown;
    try {
      data = await response.json();
    } catch (err) {
      const message = err instanceof Error ? err.message : String(err);
      notifyError(`Geocoding failed: ${message}`);
      return false;
    }

    const results = (data as { results?: Array<{ latitude: number; longitude: number }> }).results;
    if (!results || results.length === 0) {
      notifyError(`No results found for location: "${locationQuery}"`);
      return false;
    }

    location = { lat: results[0].latitude, lon: results[0].longitude };
    geocodeResolved = true;
    return true;
  }

  async function pollAlerts(): Promise<void> {
    if (closed || alertsStopped || !location) return;
    const point = `${location.lat.toFixed(4)},${location.lon.toFixed(4)}`;
    const url = `https://api.weather.gov/alerts/active?point=${point}&status=actual`;
    try {
      const response = await fetchFn(url, { headers: NWS_HEADERS });
      if (closed) return;
      if (!response.ok) {
        if (response.status === 400 || response.status === 404) {
          alertsStopped = true;
          stopAlertsTimer();
          notifyError(`Weather alerts unavailable for this location (HTTP ${response.status})`);
        } else {
          notifyError(
            `Weather alerts error ${response.status ?? ''}: ${response.statusText ?? 'unknown'}`
          );
        }
        return;
      }
      const raw = await response.json();
      if (closed) return;
      const data: WeatherAlertsData = {
        alerts: transformNwsAlerts(raw, Date.now()),
        lastUpdated: Date.now(),
      };
      dataBus?.publish(WEATHER_ALERTS_CHANNEL, WEATHER_ALERTS_PLUGIN_ID, data);
    } catch (err) {
      if (closed) return;
      const message = err instanceof Error ? err.message : String(err);
      notifyError(`Weather alerts fetch failed: ${message}`);
    }
  }

  function stopAlertsTimer(): void {
    if (alertsTimer !== null) {
      clearInterval(alertsTimer);
      alertsTimer = null;
    }
  }

  function startAlerts(): void {
    if (!alertsEnabled || alertsStarted || closed || !location) return;
    alertsStarted = true;
    void pollAlerts();
    alertsTimer = setInterval(() => void pollAlerts(), alertsInterval_ms);
    if (typeof alertsTimer === 'object' && 'unref' in alertsTimer) alertsTimer.unref();
  }

  function buildUrl(): string {
    // location is guaranteed to be set by the time buildUrl is called
    // (either provided directly or resolved via geocoding)
    const loc = location!;
    if (provider === 'open-meteo') {
      return buildOpenMeteoUrl(loc, units);
    }
    // OpenWeatherMap OneCall 3.0 requires `appid` as a query parameter.
    // It does not support header-based API key auth — this is a vendor limitation.
    const base = 'https://api.openweathermap.org/data/3.0/onecall';
    return `${base}?lat=${loc.lat}&lon=${loc.lon}&units=${units}&appid=${apiKey}&exclude=minutely,hourly,alerts`;
  }

  function transformResponse(raw: unknown): WeatherData | null {
    if (provider === 'open-meteo') {
      const om = raw as OpenMeteoResponse;
      if (!om.current || !om.daily) {
        notifyError('Weather response missing required fields: current or daily');
        return null;
      }
      const nowcast = transformNowcast(om);
      return {
        current: transformOpenMeteoCurrent(om.current),
        forecast: transformOpenMeteoForecast(om.daily),
        ...(nowcast ? { nowcast } : {}),
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

    // Resolve geocoding if needed (only on first call)
    if (!geocodeResolved) {
      const ok = await resolveGeocode();
      if (!ok) return;
    }
    // Return cached data if still fresh
    if (lastFetchedAt !== null && maxStale_ms > 0 && Date.now() - lastFetchedAt < maxStale_ms) {
      return;
    }

    const startedAt = Date.now();
    let response: Awaited<ReturnType<FetchFn>>;
    try {
      const pending = fetchFn(buildUrl());
      // Location is known: start alerts once the weather request is in flight
      startAlerts();
      response = await pending;
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
    lastFetchedAt = startedAt;
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
      stopAlertsTimer();
    },
  };
}
