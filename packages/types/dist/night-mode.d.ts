/** Parsed night-mode module config */
export interface NightConfig {
    enabled: boolean;
    startTime: string;
    endTime: string;
    /** Monitor backlight percentage during the night window */
    brightness: number;
}
/** True when `now` (local time) falls in [start, end); the window may cross midnight. */
export declare function isNightTime(now: Date, start: string, end: string): boolean;
/** Parse the night-mode module config, tolerating string values and missing keys. */
export declare function parseNightConfig(config: Record<string, unknown> | undefined): NightConfig;
//# sourceMappingURL=night-mode.d.ts.map