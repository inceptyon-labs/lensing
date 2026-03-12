import type { PluginHealthReport, SystemHealthSnapshot, ConnectivityStatus, ResourceBudgetViolation, HealthStoreState } from '@lensing/types';
/** Options for creating a health store */
export interface HealthStoreOptions {
    onChange?: (action: string) => void;
}
/** Health store interface for aggregating plugin and system health */
export interface HealthStore {
    /** Update health report for a specific plugin */
    updatePluginHealth(pluginId: string, report: PluginHealthReport): void;
    /** Get health report for a specific plugin */
    getPluginHealth(pluginId: string): PluginHealthReport | undefined;
    /** Get health reports for all plugins */
    getAllPluginHealth(): PluginHealthReport[];
    /** Update system health snapshot */
    updateSystemHealth(snapshot: SystemHealthSnapshot): void;
    /** Get latest system health snapshot */
    getSystemHealth(): SystemHealthSnapshot | undefined;
    /** Update connectivity status */
    updateConnectivity(status: ConnectivityStatus): void;
    /** Get current connectivity status */
    getConnectivity(): ConnectivityStatus | undefined;
    /** Record a resource budget violation */
    addViolation(violation: ResourceBudgetViolation): void;
    /** Get all recorded violations */
    getViolations(): ResourceBudgetViolation[];
    /** Clear all recorded violations */
    clearViolations(): void;
    /** Get error list for a specific plugin */
    getPluginErrors(pluginId: string): string[];
    /** Get complete health store state */
    getState(): HealthStoreState;
    /** Register a callback for state changes. Returns a function to unsubscribe. */
    onChange(callback: (action: string) => void): () => void;
}
/** Create a health store with the factory pattern */
export declare function createHealthStore(options?: HealthStoreOptions): HealthStore;
//# sourceMappingURL=health-store.d.ts.map