import { WEATHER_ALERTS_CHANNEL, WEATHER_ALERTS_PLUGIN_ID } from '@lensing/types';
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
/** Local wall-clock 'YYYY-MM-DDTHH:mm' to Unix ms, independent of host timezone */
function localToUnixMs(time, utcOffsetSeconds) {
    const m = /^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2})/.exec(time);
    if (!m)
        return NaN;
    const [y, mo, d, h, min] = m.slice(1).map(Number);
    return Date.UTC(y, mo - 1, d, h, min) - utcOffsetSeconds * 1000;
}
function transformNowcast(om) {
    const { minutely_15: m, hourly: h } = om;
    if (!m || !h || !Array.isArray(m.time) || !Array.isArray(h.time))
        return undefined;
    if (!Array.isArray(m.precipitation) || !Array.isArray(h.uv_index))
        return undefined;
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
const SEVERITY_RANK = {
    Extreme: 0,
    Severe: 1,
    Moderate: 2,
    Minor: 3,
    Unknown: 4,
};
function parseTime(value) {
    if (!value)
        return null;
    const t = Date.parse(value);
    return Number.isNaN(t) ? null : t;
}
function transformNwsAlerts(raw, now) {
    const features = raw?.features;
    if (!Array.isArray(features))
        throw new Error('NWS response missing features');
    const alerts = [];
    for (const f of features) {
        const p = f.properties;
        if (!p || p.messageType === 'Cancel')
            continue;
        const ends = parseTime(p.ends);
        const expires = parseTime(p.expires);
        const end = ends ?? expires;
        if (end !== null && end <= now)
            continue;
        const event = p.event ?? 'Alert';
        const severity = p.severity && p.severity in SEVERITY_RANK ? p.severity : 'Unknown';
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
    return alerts.sort((a, b) => SEVERITY_RANK[a.severity] - SEVERITY_RANK[b.severity] ||
        (a.onset ?? Infinity) - (b.onset ?? Infinity));
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
        `&minutely_15=precipitation,precipitation_probability&forecast_minutely_15=24` +
        `&hourly=uv_index&forecast_hours=24` +
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
    const alertsEnabled = options.alerts ?? true;
    const alertsInterval_ms = options.alertsInterval_ms ?? 300_000;
    let alertsTimer = null;
    let alertsStarted = false;
    let alertsStopped = false;
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
    async function pollAlerts() {
        if (closed || alertsStopped || !location)
            return;
        const point = `${location.lat.toFixed(4)},${location.lon.toFixed(4)}`;
        const url = `https://api.weather.gov/alerts/active?point=${point}&status=actual`;
        try {
            const response = await fetchFn(url, { headers: NWS_HEADERS });
            if (closed)
                return;
            if (!response.ok) {
                if (response.status === 400 || response.status === 404) {
                    alertsStopped = true;
                    stopAlertsTimer();
                    notifyError(`Weather alerts unavailable for this location (HTTP ${response.status})`);
                }
                else {
                    notifyError(`Weather alerts error ${response.status ?? ''}: ${response.statusText ?? 'unknown'}`);
                }
                return;
            }
            const raw = await response.json();
            if (closed)
                return;
            const data = {
                alerts: transformNwsAlerts(raw, Date.now()),
                lastUpdated: Date.now(),
            };
            dataBus?.publish(WEATHER_ALERTS_CHANNEL, WEATHER_ALERTS_PLUGIN_ID, data);
        }
        catch (err) {
            if (closed)
                return;
            const message = err instanceof Error ? err.message : String(err);
            notifyError(`Weather alerts fetch failed: ${message}`);
        }
    }
    function stopAlertsTimer() {
        if (alertsTimer !== null) {
            clearInterval(alertsTimer);
            alertsTimer = null;
        }
    }
    function startAlerts() {
        if (!alertsEnabled || alertsStarted || closed || !location)
            return;
        alertsStarted = true;
        void pollAlerts();
        alertsTimer = setInterval(() => void pollAlerts(), alertsInterval_ms);
        if (typeof alertsTimer === 'object' && 'unref' in alertsTimer)
            alertsTimer.unref();
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
            const nowcast = transformNowcast(om);
            return {
                current: transformOpenMeteoCurrent(om.current),
                forecast: transformOpenMeteoForecast(om.daily),
                ...(nowcast ? { nowcast } : {}),
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
        const startedAt = Date.now();
        let response;
        try {
            const pending = fetchFn(buildUrl());
            // Location is known: start alerts once the weather request is in flight
            startAlerts();
            response = await pending;
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
        lastFetchedAt = startedAt;
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
            stopAlertsTimer();
        },
    };
}
//# sourceMappingURL=weather-server.js.map