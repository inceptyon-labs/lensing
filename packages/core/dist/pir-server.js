import { DEFAULT_PIR_IDLE_TIMEOUT_MS, DEFAULT_PIR_GPIO_PIN } from '@lensing/types';
const PLUGIN_ID = 'pir';
const DATA_BUS_CHANNEL = 'presence.pir';
export function createPIRServer(options) {
    const { dataBus, gpioFactory, gpioPin = DEFAULT_PIR_GPIO_PIN, idleTimeout_ms = DEFAULT_PIR_IDLE_TIMEOUT_MS, } = options;
    let closed = false;
    let watcher = null;
    let idleTimer = null;
    let startupError = null;
    const updateListeners = [];
    const errorListeners = [];
    let presenceData = {
        detected: false,
        lastMotionAt: 0,
        available: false,
        lastUpdated: Date.now(),
    };
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
    function copyData(d) {
        return { ...d };
    }
    function publishAndNotify(data) {
        try {
            dataBus.publish(DATA_BUS_CHANNEL, PLUGIN_ID, data);
        }
        catch (err) {
            const message = err instanceof Error ? err.message : String(err);
            notifyError(`Data bus publish error: ${message}`);
        }
        notifyUpdate(data);
    }
    function clearIdleTimer() {
        if (idleTimer !== null) {
            clearTimeout(idleTimer);
            idleTimer = null;
        }
    }
    function scheduleIdle() {
        clearIdleTimer();
        idleTimer = setTimeout(() => {
            if (closed)
                return;
            presenceData = {
                ...presenceData,
                detected: false,
                lastUpdated: Date.now(),
            };
            publishAndNotify(copyData(presenceData));
        }, idleTimeout_ms);
    }
    function handleGpioValue(value) {
        if (closed)
            return;
        if (value === 1) {
            const now = Date.now();
            presenceData = {
                ...presenceData,
                detected: true,
                lastMotionAt: now,
                lastUpdated: now,
            };
            publishAndNotify(copyData(presenceData));
            scheduleIdle();
        }
        // GPIO LOW (0) does not immediately clear — let idle timer fire
    }
    // Initialise GPIO
    if (gpioFactory) {
        try {
            watcher = gpioFactory(gpioPin);
            presenceData = { ...presenceData, available: true };
            watcher.watch(handleGpioValue);
        }
        catch (err) {
            // Clean up watcher if it was created but watch() failed
            if (watcher !== null) {
                try {
                    watcher.close();
                }
                catch {
                    // ignore cleanup errors
                }
                watcher = null;
            }
            const message = err instanceof Error ? err.message : String(err);
            presenceData = { ...presenceData, available: false };
            startupError = `GPIO error: ${message}`;
        }
    }
    return {
        getData() {
            return copyData(presenceData);
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
            // Replay startup error to newly registered listener
            if (startupError !== null) {
                try {
                    callback(startupError);
                }
                catch {
                    // isolate listener errors
                }
            }
        },
        close() {
            closed = true;
            clearIdleTimer();
            try {
                watcher?.close();
            }
            catch {
                // ignore GPIO close errors
            }
        },
    };
}
//# sourceMappingURL=pir-server.js.map