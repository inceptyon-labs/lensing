// ── Severity maps ──────────────────────────────────────────────────────────
function pollenLevel(index) {
    if (index <= 2.4)
        return 'Low';
    if (index <= 4.8)
        return 'Low-Medium';
    if (index <= 7.2)
        return 'Medium';
    if (index <= 9.6)
        return 'Medium-High';
    return 'High';
}
function pollenColor(index) {
    if (index <= 2.4)
        return '#4caf50';
    if (index <= 4.8)
        return '#8bc34a';
    if (index <= 7.2)
        return '#ffeb3b';
    if (index <= 9.6)
        return '#ff9800';
    return '#f44336';
}
// ── Factory ────────────────────────────────────────────────────────────────
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
export function createAllergiesStore(options = {}) {
    const { maxStale_ms = 3_600_000 } = options;
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
            for (const cb of callbacks) {
                try {
                    cb();
                }
                catch {
                    // isolate listener errors
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
        getPollenLevel(index) {
            return pollenLevel(index);
        },
        getPollenColor(index) {
            return pollenColor(index);
        },
        onChange(callback) {
            callbacks.push(callback);
        },
    };
}
//# sourceMappingURL=allergies-store.js.map