// ── Factory ────────────────────────────────────────────────────────────────
export function createPresenceStore(_options = {}) {
    let data = null;
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
    function buildState() {
        if (!data) {
            return {
                detected: false,
                available: false,
                lastMotionAt: 0,
                timeSinceMotionMs: 0,
                lastUpdated: 0,
            };
        }
        return {
            detected: data.detected,
            available: data.available,
            lastMotionAt: data.lastMotionAt,
            timeSinceMotionMs: data.lastMotionAt > 0 ? Date.now() - data.lastMotionAt : 0,
            lastUpdated: data.lastUpdated,
        };
    }
    return {
        getState() {
            return buildState();
        },
        setData(newData) {
            data = { ...newData };
            notifyChange();
        },
        isMotionDetected() {
            return data?.detected ?? false;
        },
        onChange(callback) {
            callbacks.push(callback);
            return () => {
                const idx = callbacks.indexOf(callback);
                if (idx !== -1)
                    callbacks.splice(idx, 1);
            };
        },
    };
}
//# sourceMappingURL=presence-store.js.map