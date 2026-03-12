// ── WMO Weather Code Mapping ──────────────────────────────────────────────────
/** Map WMO weather interpretation codes to human-readable conditions */
export const WMO_CODE_MAP = {
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
function wmoToConditions(code) {
    return WMO_CODE_MAP[code] ?? 'Unknown';
}
function transformOpenMeteoCurrent(c) {
    return {
        temp: c.temperature_2m,
        feelsLike: c.apparent_temperature,
        humidity: c.relative_humidity_2m,
        conditions: wmoToConditions(c.weather_code),
        icon: '',
    };
}
function transformOpenMeteoForecast(daily) {
    return daily.time.map((date, i) => ({
        date,
        high: daily.temperature_2m_max[i],
        low: daily.temperature_2m_min[i],
        conditions: wmoToConditions(daily.weather_code[i]),
        icon: '',
        precipChance: daily.precipitation_probability_max?.[i],
    }));
}
function buildOpenMeteoUrl(location, units) {
    const tempUnit = units === 'imperial' ? 'fahrenheit' : 'celsius';
    return (`https://api.open-meteo.com/v1/forecast` +
        `?latitude=${location.lat}&longitude=${location.lon}` +
        `&current=temperature_2m,apparent_temperature,weather_code,relative_humidity_2m` +
        `&daily=temperature_2m_max,temperature_2m_min,weather_code,precipitation_probability_max` +
        `&timezone=auto&forecast_days=5&temperature_unit=${tempUnit}`);
}
// ── Transform ─────────────────────────────────────────────────────────────────
function transformCurrent(c) {
    const w = c.weather[0] ?? { description: 'unknown', icon: '' };
    return {
        temp: c.temp,
        feelsLike: c.feels_like,
        humidity: c.humidity,
        conditions: w.description,
        icon: w.icon,
    };
}
function transformForecast(daily) {
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
export function createWeatherServer(options) {
    const { provider = 'open-meteo', apiKey, locationQuery, units = 'imperial', fetchFn = fetch, dataBus, } = options;
    if (provider === 'openweathermap' && !apiKey) {
        throw new Error('WeatherServer: apiKey is required for OpenWeatherMap provider');
    }
    if (!options.location && !locationQuery) {
        throw new Error('WeatherServer: location or locationQuery is required');
    }
    // Mutable location — resolved from geocoding or provided directly
    let location = options.location;
    let geocodeResolved = !locationQuery; // skip geocoding if no query
    const maxStale_ms = options.maxStale_ms ?? 3600000;
    let lastData = null;
    let lastFetchedAt = null;
    const updateListeners = [];
    const errorListeners = [];
    let closed = false;
    function notifyUpdate(data) {
        for (const cb of updateListeners) {
            try {
                cb(data);
            }
            catch {
                // isolate listener errors
            }
        }
    }
    function notifyError(message) {
        for (const cb of errorListeners) {
            try {
                cb(message);
            }
            catch {
                // isolate listener errors
            }
        }
    }
    async function resolveGeocode() {
        if (geocodeResolved)
            return true;
        let response;
        try {
            const url = `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(locationQuery)}&count=1`;
            response = await fetchFn(url);
        }
        catch (err) {
            const message = err instanceof Error ? err.message : String(err);
            notifyError(`Geocoding failed: ${message}`);
            return false;
        }
        if (!response.ok) {
            notifyError(`Geocoding failed: HTTP ${response.status ?? ''} ${response.statusText ?? ''}`);
            return false;
        }
        let data;
        try {
            data = await response.json();
        }
        catch (err) {
            const message = err instanceof Error ? err.message : String(err);
            notifyError(`Geocoding failed: ${message}`);
            return false;
        }
        const results = data.results;
        if (!results || results.length === 0) {
            notifyError(`No results found for location: "${locationQuery}"`);
            return false;
        }
        location = { lat: results[0].latitude, lon: results[0].longitude };
        geocodeResolved = true;
        return true;
    }
    function buildUrl() {
        // location is guaranteed to be set by the time buildUrl is called
        // (either provided directly or resolved via geocoding)
        const loc = location;
        if (provider === 'open-meteo') {
            return buildOpenMeteoUrl(loc, units);
        }
        // OpenWeatherMap OneCall 3.0 requires `appid` as a query parameter.
        // It does not support header-based API key auth — this is a vendor limitation.
        const base = 'https://api.openweathermap.org/data/3.0/onecall';
        return `${base}?lat=${loc.lat}&lon=${loc.lon}&units=${units}&appid=${apiKey}&exclude=minutely,hourly,alerts`;
    }
    function transformResponse(raw) {
        if (provider === 'open-meteo') {
            const om = raw;
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
        const owm = raw;
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
    async function refresh() {
        if (closed)
            return;
        // Resolve geocoding if needed (only on first call)
        if (!geocodeResolved) {
            const ok = await resolveGeocode();
            if (!ok)
                return;
        }
        // Return cached data if still fresh
        if (lastFetchedAt !== null && maxStale_ms > 0 && Date.now() - lastFetchedAt < maxStale_ms) {
            return;
        }
        let response;
        try {
            response = await fetchFn(buildUrl());
        }
        catch (err) {
            const message = err instanceof Error ? err.message : String(err);
            notifyError(`Weather fetch failed: ${message}`);
            return;
        }
        if (!response.ok) {
            notifyError(`Weather API error ${response.status ?? ''}: ${response.statusText ?? 'unknown'}`);
            return;
        }
        let raw;
        try {
            raw = await response.json();
        }
        catch (err) {
            const message = err instanceof Error ? err.message : String(err);
            notifyError(`Weather response parse error: ${message}`);
            return;
        }
        const data = transformResponse(raw);
        if (!data)
            return;
        lastData = data;
        lastFetchedAt = Date.now();
        notifyUpdate(data);
        if (dataBus) {
            dataBus.publish('weather.current', 'weather-server', data);
        }
    }
    return {
        refresh,
        getWeatherData() {
            return lastData;
        },
        onUpdate(callback) {
            updateListeners.push(callback);
            return () => {
                const idx = updateListeners.indexOf(callback);
                if (idx !== -1)
                    updateListeners.splice(idx, 1);
            };
        },
        onError(callback) {
            errorListeners.push(callback);
        },
        close() {
            closed = true;
        },
    };
}
//# sourceMappingURL=weather-server.js.map