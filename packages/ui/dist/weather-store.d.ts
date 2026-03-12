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
export declare function createWeatherStore(options?: WeatherStoreOptions): WeatherStore;
//# sourceMappingURL=weather-store.d.ts.map