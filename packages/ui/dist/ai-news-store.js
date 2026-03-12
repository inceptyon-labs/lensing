// ── Helpers ───────────────────────────────────────────────────────────────────
function copySummary(s) {
    return { ...s };
}
function copyData(d) {
    return {
        summaries: d.summaries.map(copySummary),
        lastUpdated: d.lastUpdated,
    };
}
// ── Factory ───────────────────────────────────────────────────────────────────
export function createAiNewsStore(options = {}) {
    const { maxStale_ms = 1_800_000 } = options;
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
        getByCategory(category) {
            if (!data)
                return [];
            return data.summaries.filter((s) => s.category === category).map(copySummary);
        },
        getBySource(source) {
            if (!data)
                return [];
            const needle = source.toLowerCase();
            return data.summaries.filter((s) => s.source.toLowerCase().includes(needle)).map(copySummary);
        },
        getCategories() {
            if (!data)
                return [];
            return [...new Set(data.summaries.map((s) => s.category))];
        },
        getSources() {
            if (!data)
                return [];
            return [...new Set(data.summaries.map((s) => s.source))];
        },
    };
}
//# sourceMappingURL=ai-news-store.js.map