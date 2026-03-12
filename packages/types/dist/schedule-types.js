/** Helper to create a CronTime from a string with full validation */
export function cronTime(input) {
    // Validate HH:MM format and ranges
    if (!input.match(/^\d{2}:\d{2}$/)) {
        throw new Error(`Invalid cron time format: ${input}. Expected HH:MM`);
    }
    const [hours, minutes] = input.split(':').map(Number);
    if (hours < 0 || hours > 23) {
        throw new Error(`Invalid hour: ${hours}. Must be 00-23`);
    }
    if (minutes < 0 || minutes > 59) {
        throw new Error(`Invalid minute: ${minutes}. Must be 00-59`);
    }
    return input;
}
/** Check if current time matches or exceeds a cron time (UTC) */
export function isCronTimeReached(cronTime, now = new Date()) {
    const [hours, minutes] = cronTime.split(':').map(Number);
    const currentHours = now.getUTCHours();
    const currentMinutes = now.getUTCMinutes();
    // Compare as total minutes since midnight (UTC)
    const cronTotalMinutes = hours * 60 + minutes;
    const currentTotalMinutes = currentHours * 60 + currentMinutes;
    return currentTotalMinutes >= cronTotalMinutes;
}
/** Get the next scheduled scene entry for the current day (UTC) */
export function getNextScheduleEntry(schedule, now = new Date()) {
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
//# sourceMappingURL=schedule-types.js.map