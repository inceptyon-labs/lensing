/** Create a health store with the factory pattern */
export function createHealthStore(options = {}) {
    const plugins = new Map();
    let system;
    let connectivity;
    let violations = [];
    const listeners = new Set();
    if (options.onChange) {
        listeners.add(options.onChange);
    }
    function notify(action) {
        listeners.forEach((fn) => {
            try {
                fn(action);
            }
            catch (error) {
                // Isolate listener failures to prevent cascading
                console.error(`Health store listener failed for action "${action}":`, error);
            }
        });
    }
    return {
        updatePluginHealth(pluginId, report) {
            // Defensive copy to prevent external mutation
            plugins.set(pluginId, {
                ...report,
                errors: [...report.errors],
                resourceUsage: { ...report.resourceUsage },
            });
            notify('plugin_health_updated');
        },
        getPluginHealth(pluginId) {
            const report = plugins.get(pluginId);
            if (!report)
                return undefined;
            // Defensive copy on read to prevent external mutation
            return {
                ...report,
                errors: [...report.errors],
                resourceUsage: { ...report.resourceUsage },
            };
        },
        getAllPluginHealth() {
            return Array.from(plugins.values()).map((report) => ({
                ...report,
                errors: [...report.errors],
                resourceUsage: { ...report.resourceUsage },
            }));
        },
        updateSystemHealth(snapshot) {
            system = snapshot;
            notify('system_health_updated');
        },
        getSystemHealth() {
            return system;
        },
        updateConnectivity(status) {
            connectivity = status;
            notify('connectivity_updated');
        },
        getConnectivity() {
            return connectivity;
        },
        addViolation(violation) {
            violations.push(violation);
            notify('violation_added');
        },
        getViolations() {
            return [...violations];
        },
        clearViolations() {
            violations = [];
            notify('violations_cleared');
        },
        getPluginErrors(pluginId) {
            return plugins.get(pluginId)?.errors ?? [];
        },
        getState() {
            return {
                plugins: new Map(plugins),
                system: system ?? {
                    cpuPercent: 0,
                    memoryUsedBytes: 0,
                    memoryTotalBytes: 0,
                    diskUsedBytes: 0,
                    diskTotalBytes: 0,
                    chromiumMemoryBytes: 0,
                    timestamp: new Date().toISOString(),
                },
                connectivity: connectivity ?? {
                    online: false,
                    latencyMs: 0,
                    lastCheckAt: new Date().toISOString(),
                },
                violations: [...violations],
            };
        },
        onChange(callback) {
            listeners.add(callback);
            return () => listeners.delete(callback);
        },
    };
}
//# sourceMappingURL=health-store.js.map