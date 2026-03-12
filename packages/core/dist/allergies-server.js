const PLUGIN_ID = 'allergies-server';
const DATA_BUS_CHANNEL = 'allergies.current';
const DEFAULT_ALERT_THRESHOLD = 7.3; // Medium-High
const DEFAULT_MAX_STALE_MS = 3_600_000; // 1 hour
const USER_AGENT = 'Mozilla/5.0 (X11; Linux aarch64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36';
// ── Severity mapping ─────────────────────────────────────────────────────
const SEVERITY_LEVELS = [
    { max: 2.4, level: 'Low', color: '#4caf50' },
    { max: 4.8, level: 'Low-Medium', color: '#8bc34a' },
    { max: 7.2, level: 'Medium', color: '#ffeb3b' },
    { max: 9.6, level: 'Medium-High', color: '#ff9800' },
    { max: 12, level: 'High', color: '#f44336' },
];
export function getPollenLevel(index) {
    for (const s of SEVERITY_LEVELS) {
        if (index <= s.max)
            return s.level;
    }
    return 'High';
}
export function getPollenColor(index) {
    for (const s of SEVERITY_LEVELS) {
        if (index <= s.max)
            return s.color;
    }
    return '#f44336';
}
// ── Transform ────────────────────────────────────────────────────────────
function transformTriggers(triggers) {
    return (triggers ?? []).map((t) => ({
        name: t.Name,
        plantType: t.PlantType,
    }));
}
function transformResponse(raw) {
    const loc = raw.Location;
    if (!loc || !Array.isArray(loc.periods))
        return null;
    const periods = loc.periods.map((p) => ({
        type: p.Type,
        index: p.Index,
        triggers: transformTriggers(p.Triggers),
    }));
    const today = periods.find((p) => p.type === 'Today') ?? periods[1] ?? periods[0];
    if (!today)
        return null;
    return {
        index: today.index,
        level: getPollenLevel(today.index),
        color: getPollenColor(today.index),
        location: loc.DisplayLocation || `${loc.City}, ${loc.State}`,
        periods,
        triggers: today.triggers,
        lastUpdated: Date.now(),
    };
}
// ── Factory ──────────────────────────────────────────────────────────────
export function createAllergiesServer(options) {
    const { zipCode, dataBus, notifications, fetchFn = fetch, alertThreshold = DEFAULT_ALERT_THRESHOLD, maxStale_ms = DEFAULT_MAX_STALE_MS, } = options;
    if (!zipCode || !/^\d{5}$/.test(zipCode.trim())) {
        throw new Error('AllergiesServer: zipCode is required (5-digit US zip code)');
    }
    const zip = zipCode.trim();
    let lastData = null;
    let lastFetchedAt = null;
    let closed = false;
    const updateListeners = [];
    const errorListeners = [];
    const notificationQueue = notifications;
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
    function buildUrl() {
        return `https://www.pollen.com/api/forecast/current/pollen/${zip}`;
    }
    function checkAndEmitAlert(data) {
        if (data.index >= alertThreshold) {
            const emitOptions = {
                source: PLUGIN_ID,
                priority: data.index >= 9.7 ? 'urgent' : 'warning',
                title: `Pollen Alert — ${data.level}`,
                body: `Pollen index: ${data.index.toFixed(1)}/12 in ${data.location}`,
                dedupe_key: `${PLUGIN_ID}-alert`,
            };
            notificationQueue.emit(emitOptions);
        }
    }
    function copyData(d) {
        return {
            index: d.index,
            level: d.level,
            color: d.color,
            location: d.location,
            periods: d.periods.map((p) => ({
                type: p.type,
                index: p.index,
                triggers: p.triggers.map((t) => ({ ...t })),
            })),
            triggers: d.triggers.map((t) => ({ ...t })),
            lastUpdated: d.lastUpdated,
        };
    }
    async function refresh() {
        if (closed)
            return;
        // Return cached data if still fresh
        if (lastFetchedAt !== null && maxStale_ms > 0 && Date.now() - lastFetchedAt < maxStale_ms) {
            return;
        }
        let response;
        try {
            response = await fetchFn(buildUrl(), {
                headers: {
                    Referer: `https://www.pollen.com/forecast/current/pollen/${zip}`,
                    'User-Agent': USER_AGENT,
                },
            });
        }
        catch (err) {
            const message = err instanceof Error ? err.message : String(err);
            notifyError(`Pollen fetch failed: ${message}`);
            return;
        }
        if (!response.ok) {
            notifyError(`Pollen API error ${response.status ?? ''}: ${response.statusText ?? 'unknown'}`);
            return;
        }
        let raw;
        try {
            raw = (await response.json());
        }
        catch (err) {
            const message = err instanceof Error ? err.message : String(err);
            notifyError(`Pollen response parse error: ${message}`);
            return;
        }
        if (!raw?.Location) {
            notifyError('Pollen response missing Location data');
            return;
        }
        const data = transformResponse(raw);
        if (!data) {
            notifyError('Pollen response missing period data');
            return;
        }
        lastData = copyData(data);
        lastFetchedAt = Date.now();
        dataBus.publish(DATA_BUS_CHANNEL, PLUGIN_ID, data);
        checkAndEmitAlert(data);
        notifyUpdate(data);
    }
    return {
        refresh,
        getAllergyData() {
            if (!lastData)
                return null;
            return copyData(lastData);
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
//# sourceMappingURL=allergies-server.js.map