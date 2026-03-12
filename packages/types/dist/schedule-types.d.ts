/** Cron time in HH:MM format (24-hour) */
export type CronTime = string & {
    readonly __brand: 'CronTime';
};
/** Schedule entry: time of day + scene to switch to */
export interface SceneScheduleEntry {
    /** Time in HH:MM format (24-hour) */
    time: CronTime;
    /** Scene name to switch to */
    sceneName: string;
}
/** Complete scene schedule with multiple time-based entries */
export interface SceneSchedule {
    /** Unique schedule identifier */
    id: string;
    /** Human-readable name */
    name: string;
    /** List of scheduled entries (sorted by time) */
    entries: SceneScheduleEntry[];
    /** When this schedule was created */
    createdAt: Date;
    /** When this schedule was last updated */
    updatedAt: Date;
}
/** Helper to create a CronTime from a string with full validation */
export declare function cronTime(input: string): CronTime;
/** Check if current time matches or exceeds a cron time (UTC) */
export declare function isCronTimeReached(cronTime: CronTime, now?: Date): boolean;
/** Get the next scheduled scene entry for the current day (UTC) */
export declare function getNextScheduleEntry(schedule: SceneSchedule, now?: Date): SceneScheduleEntry | undefined;
//# sourceMappingURL=schedule-types.d.ts.map