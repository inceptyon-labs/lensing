// ── Helpers ───────────────────────────────────────────────────────────────────
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
// ── Factory ───────────────────────────────────────────────────────────────────
export function createHomeAssistantStore(options = {}) {
    const { maxStale_ms = 120_000 } = options;
    let data = null;
    let isLoading = false;
    let error = null;
    const callbacks = [];
    let notifying = false;
    function notifyChange() {
        if (notifying)
            return;
        notifying = true;
        try {
            for (const cb of [...callbacks]) {
                try {
                    cb();
                }
                catch {
                    // isolate callback errors
                }
            }
        }
        finally {
            notifying = false;
        }
    }
    return {
        getState() {
            return {
                data: data ? copyData(data) : null,
                isLoading,
                error,
            };
        },
        setData(newData) {
            data = copyData(newData);
            error = null;
            isLoading = false;
            notifyChange();
        },
        setLoading(loading) {
            isLoading = loading;
            notifyChange();
        },
        setError(errorMessage) {
            error = errorMessage;
            data = null;
            isLoading = false;
            notifyChange();
        },
        isStale() {
            if (!data)
                return false;
            if (!Number.isFinite(data.lastUpdated))
                return true;
            return Date.now() - data.lastUpdated > maxStale_ms;
        },
        onChange(callback) {
            callbacks.push(callback);
            return () => {
                const idx = callbacks.indexOf(callback);
                if (idx !== -1)
                    callbacks.splice(idx, 1);
            };
        },
        getLights() {
            if (!data)
                return [];
            return data.devices.filter((e) => e.domain === 'light').map(copyEntity);
        },
        getSwitches() {
            if (!data)
                return [];
            return data.devices.filter((e) => e.domain === 'switch').map(copyEntity);
        },
        getLocks() {
            if (!data)
                return [];
            return data.devices.filter((e) => e.domain === 'lock').map(copyEntity);
        },
        getClimate() {
            if (!data)
                return [];
            return data.devices.filter((e) => e.domain === 'climate').map(copyEntity);
        },
        getSensorsByType(deviceClass) {
            if (!data)
                return [];
            return data.sensors
                .filter((e) => e.attributes['device_class'] === deviceClass)
                .map(copyEntity);
        },
    };
}
//# sourceMappingURL=home-assistant-store.js.map