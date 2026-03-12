function makeMessage(channel, pluginId, data) {
    const frozenData = Object.freeze(typeof data === 'object' && data !== null ? { ...data } : data);
    return Object.freeze({
        channel,
        plugin_id: pluginId,
        data: frozenData,
        timestamp: new Date().toISOString(),
    });
}
function safeCall(cb, ...args) {
    try {
        cb(...args);
    }
    catch {
        // Isolate subscriber errors
    }
}
export function createDataBus() {
    const channels = new Map();
    const subscribers = new Map();
    const globalListeners = new Set();
    let closed = false;
    return {
        publish(channel, pluginId, data) {
            if (closed)
                return;
            const msg = makeMessage(channel, pluginId, data);
            channels.set(channel, msg);
            const subs = subscribers.get(channel);
            if (subs) {
                for (const cb of [...subs]) {
                    safeCall(cb, msg);
                }
            }
            for (const cb of [...globalListeners]) {
                safeCall(cb, msg);
            }
        },
        subscribe(channel, callback) {
            if (!subscribers.has(channel)) {
                subscribers.set(channel, new Set());
            }
            subscribers.get(channel).add(callback);
            return () => {
                subscribers.get(channel)?.delete(callback);
            };
        },
        getLatest(channel) {
            return channels.get(channel);
        },
        getChannels() {
            return Array.from(channels.keys());
        },
        onMessage(callback) {
            globalListeners.add(callback);
            return () => {
                globalListeners.delete(callback);
            };
        },
        clear() {
            channels.clear();
            subscribers.clear();
            globalListeners.clear();
        },
        close() {
            closed = true;
            channels.clear();
            subscribers.clear();
            globalListeners.clear();
        },
    };
}
//# sourceMappingURL=data-bus.js.map