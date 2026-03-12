import type { SceneSchedule, SceneScheduleEntry, DatabaseInstance, SceneManagerInstance } from '@lensing/types';
export interface SceneSchedulerOptions {
    db: DatabaseInstance;
    sceneManager: SceneManagerInstance;
    /** Polling interval for time checks (default: 60_000ms) */
    timerInterval_ms?: number;
}
export interface SceneSchedulerInstance {
    /** Get the currently loaded schedule */
    getActiveSchedule(): SceneSchedule | undefined;
    /** Save and immediately apply a schedule */
    setSchedule(schedule: SceneSchedule): void;
    /** Get the next scheduled entry after the current time */
    getNextScheduledScene(): SceneScheduleEntry | undefined;
    /** Manually override scene, optionally restoring after duration_ms */
    overrideScene(sceneName: string, duration_ms?: number): void;
    /** Start the auto-switch timer */
    start(): void;
    /** Stop the auto-switch timer */
    stop(): void;
    /** Cleanup all resources */
    close(): void;
    /** Register a callback when the scheduler switches scenes */
    onSceneChange(callback: (sceneName: string) => void): () => void;
}
export declare function createSceneScheduler(options: SceneSchedulerOptions): SceneSchedulerInstance;
//# sourceMappingURL=scene-scheduler.d.ts.map