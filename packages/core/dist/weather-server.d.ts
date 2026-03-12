import type { DataBusInstance, WeatherProvider } from '@lensing/types';
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
    date: string;
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
    lastUpdated: number;
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
/** Map WMO weather interpretation codes to human-readable conditions */
export declare const WMO_CODE_MAP: Record<number, string>;
/**
 * Creates a weather server module that fetches, caches, and publishes weather data.
 */
export declare function createWeatherServer(options: WeatherServerOptions): WeatherServerInstance;
//# sourceMappingURL=weather-server.d.ts.map