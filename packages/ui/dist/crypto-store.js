// ── Helpers ────────────────────────────────────────────────────────────────
function copyCoin(coin) {
    return { ...coin };
}
function copyData(d) {
    return {
        coins: d.coins.map(copyCoin),
        lastUpdated: d.lastUpdated,
    };
}
// ── Factory ────────────────────────────────────────────────────────────────
export function createCryptoStore(options = {}) {
    const { maxStale_ms = 300_000 } = options;
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
        getChangeColor(pct) {
            if (!Number.isFinite(pct))
                return 'var(--dim-light)';
            if (Math.abs(pct) < 0.1)
                return 'var(--dim-light)';
            return pct > 0 ? 'var(--alert-success)' : 'var(--alert-urgent)';
        },
        getChangeLabel(pct) {
            const safe = Number.isFinite(pct) ? pct : 0;
            const prefix = safe >= 0 ? '+' : '';
            return `${prefix}${safe.toFixed(2)}%`;
        },
        formatPrice(price) {
            if (!Number.isFinite(price))
                return '$0';
            // Use Intl.NumberFormat for locale-aware formatting
            return new Intl.NumberFormat('en-US', {
                style: 'currency',
                currency: 'USD',
                minimumFractionDigits: price < 1 ? 4 : 2,
                maximumFractionDigits: price < 1 ? 6 : 2,
            }).format(price);
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
        getCoinById(id) {
            if (!data)
                return null;
            const coin = data.coins.find((c) => c.id === id);
            return coin ? copyCoin(coin) : null;
        },
    };
}
//# sourceMappingURL=crypto-store.js.map