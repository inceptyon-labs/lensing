/** Cron time in HH:MM format (24-hour) */
export type CronTime = string & { readonly __brand: 'CronTime' };

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

/** Helper to create a CronTime from a string (validation can be added) */
export function cronTime(input: string): CronTime {
  // Basic validation: HH:MM format
  if (!input.match(/^\d{2}:\d{2}$/)) {
    throw new Error(`Invalid cron time format: ${input}. Expected HH:MM`);
  }
  return input as CronTime;
}

/** Check if current time matches or exceeds a cron time (UTC) */
export function isCronTimeReached(cronTime: CronTime, now: Date = new Date()): boolean {
  const [hours, minutes] = cronTime.split(':').map(Number);
  const currentHours = now.getUTCHours();
  const currentMinutes = now.getUTCMinutes();

  // Compare as total minutes since midnight (UTC)
  const cronTotalMinutes = hours * 60 + minutes;
  const currentTotalMinutes = currentHours * 60 + currentMinutes;

  return currentTotalMinutes >= cronTotalMinutes;
}

/** Get the next scheduled scene entry for the current day (UTC) */
export function getNextScheduleEntry(
  schedule: SceneSchedule,
  now: Date = new Date()
): SceneScheduleEntry | undefined {
  const currentTotalMinutes = now.getUTCHours() * 60 + now.getUTCMinutes();

  for (const entry of schedule.entries) {
    const [hours, minutes] = entry.time.split(':').map(Number);
    const entryTotalMinutes = hours * 60 + minutes;

    if (entryTotalMinutes > currentTotalMinutes) {
      return entry;
    }
  }

  // No more entries today, return first entry (tomorrow)
  return schedule.entries[0];
}
