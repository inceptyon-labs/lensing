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
