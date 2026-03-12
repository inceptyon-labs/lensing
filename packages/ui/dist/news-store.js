// ── Helpers ───────────────────────────────────────────────────────────────────
function copyArticle(a) {
    return { ...a };
}
function copyData(d) {
    return {
        articles: d.articles.map(copyArticle),
        lastUpdated: d.lastUpdated,
    };
}
// ── Factory ───────────────────────────────────────────────────────────────────
export function createNewsStore(options = {}) {
    const { maxStale_ms = 600_000 } = options;
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
            return data.articles.filter((a) => a.category === category).map(copyArticle);
        },
        getCategories() {
            if (!data)
                return [];
            return [...new Set(data.articles.map((a) => a.category))];
        },
        truncateSummary(text, maxLength) {
            if (text.length <= maxLength)
                return text;
            return text.slice(0, maxLength) + '...';
        },
    };
}
//# sourceMappingURL=news-store.js.map