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
    date: string;
    high: number;
    low: number;
    conditions: string;
    icon: string;
    /** Probability of precipitation as a percentage (0–100) */
    precipChance?: number;
}
/** Short-range precipitation and UV outlook (Open-Meteo only) */
export interface WeatherNowcast {
    /** 15-minute steps covering the next 6 hours; mm of precipitation per step */
    precipitation: Array<{
        time: number;
        mm: number;
        probability?: number;
    }>;
    /** Hourly UV index covering the next 24 hours */
    uv: Array<{
        time: number;
        index: number;
    }>;
}
/** Full weather data payload */
export interface WeatherData {
    current: WeatherCurrent;
    forecast: WeatherForecastDay[];
    /** Present for Open-Meteo; times are Unix ms */
    nowcast?: WeatherNowcast;
    lastUpdated: number;
}
/** NWS alert severity, most to least severe */
export type WeatherAlertSeverity = 'Extreme' | 'Severe' | 'Moderate' | 'Minor' | 'Unknown';
/** An active National Weather Service alert for the configured location */
export interface WeatherAlert {
    id: string;
    /** e.g. "Tornado Warning", "Flood Watch" */
    event: string;
    headline: string;
    severity: WeatherAlertSeverity;
    urgency: string;
    /** Unix ms, or null when not given */
    onset: number | null;
    /** When the hazard ends (Unix ms), or null when not given */
    ends: number | null;
    /** When the alert message expires (Unix ms) */
    expires: number;
}
/** Payload published on WEATHER_ALERTS_CHANNEL; alerts sorted most severe first */
export interface WeatherAlertsData {
    alerts: WeatherAlert[];
    lastUpdated: number;
}
/** Data bus plugin id and channel for NWS alerts (published by the weather module) */
export declare const WEATHER_ALERTS_PLUGIN_ID = "weather-alerts";
export declare const WEATHER_ALERTS_CHANNEL = "weather.alerts";
//# sourceMappingURL=weather.d.ts.map