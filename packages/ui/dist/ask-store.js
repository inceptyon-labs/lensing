/** Create an ask store with the factory pattern */
export function createAskStore(options) {
    let history = [];
    let currentResponse = null;
    let status = 'idle';
    let lastError = null;
    const listeners = new Set();
    function notifyListeners() {
        listeners.forEach((fn) => fn());
    }
    return {
        async submitQuestion(question) {
            status = 'loading';
            lastError = null;
            notifyListeners();
            try {
                const entry = await options.fetch(question);
                history.push(entry);
                currentResponse = entry;
                status = 'idle';
            }
            catch (err) {
                status = 'error';
                lastError = err instanceof Error ? err.message : String(err);
                throw err;
            }
            finally {
                notifyListeners();
            }
        },
        getHistory() {
            return [...history];
        },
        getStatus() {
            return status;
        },
        getCurrentResponse() {
            return currentResponse;
        },
        getLastError() {
            return lastError;
        },
        clearHistory() {
            history = [];
            currentResponse = null;
            status = 'idle';
            lastError = null;
            notifyListeners();
        },
        onChange(callback) {
            listeners.add(callback);
        },
    };
}
//# sourceMappingURL=ask-store.js.map