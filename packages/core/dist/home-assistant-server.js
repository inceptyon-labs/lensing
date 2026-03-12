import { DEFAULT_HA_MAX_STALE_MS, DEFAULT_HA_DOMAINS } from '@lensing/types';
const PLUGIN_ID = 'home-assistant-server';
const DATA_BUS_DEVICES_CHANNEL = 'home.devices';
const DATA_BUS_SENSORS_CHANNEL = 'home.sensors';
const SENSOR_DOMAINS = new Set(['sensor', 'binary_sensor']);
// ── Transform helpers ──────────────────────────────────────────────────────
function transformEntity(raw) {
    const domain = raw.entity_id.split('.')[0] ?? '';
    const friendly_name = typeof raw.attributes.friendly_name === 'string' ? raw.attributes.friendly_name : raw.entity_id;
    return {
        entity_id: raw.entity_id,
        state: raw.state,
        domain,
        friendly_name,
        attributes: { ...raw.attributes },
        last_changed: Date.parse(raw.last_changed),
        last_updated: Date.parse(raw.last_updated),
    };
}
// ── Defensive copies ───────────────────────────────────────────────────────
function copyEntity(e) {
    return { ...e, attributes: { ...e.attributes } };
}
function copyData(d) {
    return {
        devices: d.devices.map(copyEntity),
        sensors: d.sensors.map(copyEntity),
        lastUpdated: d.lastUpdated,
    };
}
// ── Factory ────────────────────────────────────────────────────────────────
export function createHomeAssistantServer(options) {
    const { url, token, dataBus, maxStale_ms = DEFAULT_HA_MAX_STALE_MS, fetchFn, domains, wsFn, } = options;
    const effectiveFetch = (fetchFn ?? fetch);
    // Compute active domain set once: use explicit domains or fall back to DEFAULT_HA_DOMAINS
    const activeDomains = domains ?? DEFAULT_HA_DOMAINS;
    const activeDomainSet = activeDomains.length > 0 ? new Set(activeDomains) : null;
    let lastData = null;
    let lastFetchedAt = null;
    let closed = false;
    let refreshing = false;
    let currentWs = null;
    const updateListeners = [];
    const errorListeners = [];
    function notifyUpdate(data) {
        for (const cb of [...updateListeners]) {
            try {
                cb(data);
            }
            catch {
                // isolate listener errors
            }
        }
    }
    function notifyError(message) {
        for (const cb of [...errorListeners]) {
            try {
                cb(message);
            }
            catch {
                // isolate listener errors
            }
        }
    }
    function publishAndNotify(data) {
        dataBus.publish(DATA_BUS_DEVICES_CHANNEL, PLUGIN_ID, data);
        dataBus.publish(DATA_BUS_SENSORS_CHANNEL, PLUGIN_ID, data);
        notifyUpdate(data);
    }
    function handleStateChanged(raw) {
        if (!lastData) {
            // No initial data yet; initialise empty store
            lastData = { devices: [], sensors: [], lastUpdated: Date.now() };
        }
        const entity = transformEntity(raw);
        // Apply domain filter (same as REST refresh)
        if (activeDomainSet !== null && !activeDomainSet.has(entity.domain)) {
            return;
        }
        const isSensor = SENSOR_DOMAINS.has(entity.domain);
        if (isSensor) {
            const idx = lastData.sensors.findIndex((e) => e.entity_id === entity.entity_id);
            if (idx !== -1) {
                lastData.sensors[idx] = copyEntity(entity);
            }
            else {
                lastData.sensors.push(copyEntity(entity));
            }
        }
        else {
            const idx = lastData.devices.findIndex((e) => e.entity_id === entity.entity_id);
            if (idx !== -1) {
                lastData.devices[idx] = copyEntity(entity);
            }
            else {
                lastData.devices.push(copyEntity(entity));
            }
        }
        lastData.lastUpdated = Date.now();
        const publishData = copyData(lastData);
        publishAndNotify(publishData);
    }
    function connectWs() {
        if (!wsFn)
            return;
        if (closed)
            return;
        // Derive ws URL: replace http(s):// with ws(s)://
        const wsUrl = url.replace(/^https:\/\//, 'wss://').replace(/^http:\/\//, 'ws://') + '/api/websocket';
        const ws = wsFn(wsUrl);
        currentWs = ws;
        ws.onopen = () => {
            // Nothing to do on open; wait for auth_required
        };
        ws.onmessage = (event) => {
            let msg;
            try {
                msg = JSON.parse(event.data);
            }
            catch {
                return;
            }
            const type = msg.type;
            if (type === 'auth_required') {
                ws.send(JSON.stringify({ type: 'auth', access_token: token }));
            }
            else if (type === 'auth_ok') {
                ws.send(JSON.stringify({ type: 'subscribe_events', id: 1, event_type: 'state_changed' }));
            }
            else if (type === 'auth_invalid') {
                const message = typeof msg.message === 'string' ? msg.message : 'Authentication failed';
                notifyError(`Home Assistant auth error: ${message}`);
            }
            else if (type === 'event') {
                const event = msg.event;
                if (!event)
                    return;
                const eventType = event.event_type;
                if (eventType !== 'state_changed')
                    return;
                const data = event.data;
                if (!data)
                    return;
                const newState = data.new_state;
                if (newState === null || newState === undefined)
                    return;
                handleStateChanged(newState);
            }
        };
        ws.onclose = (closeEvent) => {
            const code = closeEvent?.code ?? 1000;
            if (code !== 1000 && !closed) {
                setTimeout(() => connectWs(), 3000);
            }
        };
        ws.onerror = (_event) => {
            // Errors will be followed by close; reconnect handled there
        };
    }
    async function refresh() {
        if (closed)
            return;
        if (refreshing)
            return;
        if (lastFetchedAt !== null && maxStale_ms > 0 && Date.now() - lastFetchedAt < maxStale_ms) {
            return;
        }
        refreshing = true;
        try {
            let response;
            try {
                response = await effectiveFetch(`${url}/api/states`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        'Content-Type': 'application/json',
                    },
                });
            }
            catch (err) {
                const message = err instanceof Error ? err.message : String(err);
                notifyError(`Home Assistant fetch failed: ${message}`);
                return;
            }
            if (!response.ok) {
                notifyError(`Home Assistant API error ${response.status ?? ''}: ${response.statusText ?? 'unknown'}`);
                return;
            }
            let raw;
            try {
                raw = await response.json();
            }
            catch (err) {
                const message = err instanceof Error ? err.message : String(err);
                notifyError(`Home Assistant response parse error: ${message}`);
                return;
            }
            if (!Array.isArray(raw)) {
                notifyError('Home Assistant response parse error: expected array of states');
                return;
            }
            const rawStates = raw;
            let entities = rawStates.map(transformEntity);
            // Apply domain filter
            if (activeDomainSet !== null) {
                entities = entities.filter((e) => activeDomainSet.has(e.domain));
            }
            const sensors = entities.filter((e) => SENSOR_DOMAINS.has(e.domain));
            const devices = entities.filter((e) => !SENSOR_DOMAINS.has(e.domain));
            const now = Date.now();
            lastData = {
                devices: devices.map(copyEntity),
                sensors: sensors.map(copyEntity),
                lastUpdated: now,
            };
            lastFetchedAt = now;
            const publishData = {
                devices: devices.map(copyEntity),
                sensors: sensors.map(copyEntity),
                lastUpdated: now,
            };
            dataBus.publish(DATA_BUS_DEVICES_CHANNEL, PLUGIN_ID, publishData);
            dataBus.publish(DATA_BUS_SENSORS_CHANNEL, PLUGIN_ID, publishData);
            notifyUpdate(publishData);
        }
        finally {
            refreshing = false;
        }
    }
    // Initiate WS connection if factory provided
    if (wsFn) {
        connectWs();
    }
    return {
        refresh,
        getData() {
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
            currentWs?.close();
        },
    };
}
//# sourceMappingURL=home-assistant-server.js.map