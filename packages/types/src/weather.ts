/** Supported weather data providers */
export type WeatherProvider = 'openweathermap' | 'open-meteo';

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
  lastUpdated: number; // Unix timestamp in ms
}
