/**
 * Calculates exponential backoff delay with jitter.
 * Jitter prevents thundering herd when multiple clients reconnect simultaneously.
 */
export function calculateBackoff(attempt, options) {
    const { baseDelay, maxDelay } = options;
    // Exponential: baseDelay * 2^attempt
    const exponential = baseDelay * Math.pow(2, attempt);
    // Cap at maxDelay
    const capped = Math.min(exponential, maxDelay);
    // Add jitter: random between capped * 0.5 and capped * 1.0
    const jitter = capped * (0.5 + Math.random() * 0.5);
    return Math.min(jitter, maxDelay);
}
/**
 * Creates a reconnection manager with exponential backoff.
 * Handles Pi sleep/wake, network blips, and host restarts gracefully.
 * Exposes connection status for UI indicators.
 */
export function createReconnectManager(options) {
    const { onReconnect, onStatusChange, baseDelay = 1000, maxDelay = 30000, maxRetries = Infinity, } = options;
    let status = 'disconnected';
    let attemptCount = 0;
    let timer = null;
    function setStatus(newStatus) {
        if (status !== newStatus) {
            status = newStatus;
            onStatusChange?.(newStatus);
        }
    }
    function scheduleReconnect() {
        if (attemptCount >= maxRetries) {
            setStatus('disconnected');
            return;
        }
        const delay = calculateBackoff(attemptCount, { baseDelay, maxDelay });
        attemptCount++;
        timer = setTimeout(() => {
            timer = null;
            onReconnect();
        }, delay);
    }
    function cancelTimer() {
        if (timer !== null) {
            clearTimeout(timer);
            timer = null;
        }
    }
    return {
        /** Current connection status */
        get status() {
            return status;
        },
        /** Current attempt count */
        get attempts() {
            return attemptCount;
        },
        /** Signal that connection is established */
        connect() {
            cancelTimer();
            attemptCount = 0;
            setStatus('connected');
        },
        /** Signal that connection was lost (triggers reconnect) */
        connectionLost() {
            cancelTimer(); // Cancel any existing pending reconnect timer
            setStatus('reconnecting');
            scheduleReconnect();
        },
        /** Explicitly disconnect (cancels pending reconnect) */
        disconnect() {
            cancelTimer();
            attemptCount = 0;
            setStatus('disconnected');
        },
        /** Clean up all resources */
        destroy() {
            cancelTimer();
        },
    };
}
//# sourceMappingURL=ws-reconnect.js.map