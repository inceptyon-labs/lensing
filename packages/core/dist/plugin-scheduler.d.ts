import type { PluginManifest } from '@lensing/types';
/** Options for createPluginScheduler */
export interface SchedulerOptions {
    /** Default interval in ms when manifest has no max_refresh_ms */
    defaultInterval?: number;
}
/** Status of a scheduled plugin */
export type SchedulerStatus = 'stopped' | 'running' | 'error';
/** State entry for a single scheduled plugin */
export interface SchedulerEntry {
    pluginId: string;
    interval: number;
    status: SchedulerStatus;
    lastRun?: number;
    nextRun?: number;
    runCount: number;
    error?: string;
}
/** Public interface for the plugin scheduler */
export interface PluginSchedulerInstance {
    register(pluginId: string, manifest: PluginManifest, handler: () => Promise<void>, overrideInterval?: number): void;
    unregister(pluginId: string): void;
    start(pluginId: string): void;
    stop(pluginId: string): void;
    restart(pluginId: string): void;
    startAll(): void;
    stopAll(): void;
    getState(): Map<string, SchedulerEntry>;
    getPluginState(pluginId: string): SchedulerEntry | undefined;
    close(): void;
}
/** Create a centralized plugin scheduler */
export declare function createPluginScheduler(options?: SchedulerOptions): PluginSchedulerInstance;
//# sourceMappingURL=plugin-scheduler.d.ts.map