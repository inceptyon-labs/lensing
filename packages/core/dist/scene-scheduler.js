/** Get total minutes since midnight (UTC) for a given date */
function utcMinutes(date) {
    return date.getUTCHours() * 60 + date.getUTCMinutes();
}
/** Find the most recent schedule entry that should be active now */
function getCurrentApplicableEntry(schedule, now) {
    const current = utcMinutes(now);
    let applicable = null;
    for (const entry of schedule.entries) {
        const [hours, minutes] = entry.time.split(':').map(Number);
        const entryMinutes = hours * 60 + minutes;
        if (entryMinutes <= current) {
            applicable = entry;
        }
    }
    // If no entry found for today yet, use last entry (yesterday carryover)
    if (!applicable && schedule.entries.length > 0) {
        applicable = schedule.entries[schedule.entries.length - 1];
    }
    return applicable;
}
export function createSceneScheduler(options) {
    const { db, sceneManager, timerInterval_ms = 60_000 } = options;
    let activeSchedule = undefined;
    let lastAppliedEntry = null;
    let isOverride = false;
    let overrideTimer = null;
    let ticker = null;
    let closed = false;
    const changeListeners = [];
    function notifyChange(sceneName) {
        for (const cb of [...changeListeners]) {
            try {
                cb(sceneName);
            }
            catch {
                // isolate listener errors
            }
        }
    }
    function applyCurrentScene() {
        if (!activeSchedule || isOverride || closed)
            return;
        const applicable = getCurrentApplicableEntry(activeSchedule, new Date());
        if (!applicable)
            return;
        if (applicable.sceneName === lastAppliedEntry?.sceneName)
            return;
        lastAppliedEntry = applicable;
        try {
            sceneManager.switchTo(applicable.sceneName);
        }
        catch {
            // scene may not exist — reset and don't notify
            lastAppliedEntry = null;
            return;
        }
        // Only notify listeners after successful scene switch
        notifyChange(applicable.sceneName);
    }
    // Load any persisted schedule on creation
    const stored = db.getAllSchedules();
    const storedIds = Object.keys(stored);
    if (storedIds.length > 0) {
        activeSchedule = stored[storedIds[0]];
    }
    return {
        getActiveSchedule() {
            return activeSchedule;
        },
        setSchedule(schedule) {
            // Sort entries by time for deterministic behavior
            const sorted = {
                ...schedule,
                entries: [...schedule.entries].sort((a, b) => {
                    const [aH, aM] = a.time.split(':').map(Number);
                    const [bH, bM] = b.time.split(':').map(Number);
                    return aH * 60 + aM - (bH * 60 + bM);
                }),
            };
            db.setSchedule(sorted);
            activeSchedule = sorted;
            lastAppliedEntry = null; // reset so current entry is re-applied
            applyCurrentScene();
        },
        getNextScheduledScene() {
            if (!activeSchedule || activeSchedule.entries.length === 0)
                return undefined;
            const current = utcMinutes(new Date());
            for (const entry of activeSchedule.entries) {
                const [hours, minutes] = entry.time.split(':').map(Number);
                if (hours * 60 + minutes > current) {
                    return entry;
                }
            }
            // All entries passed today — wrap to first (tomorrow)
            return activeSchedule.entries[0];
        },
        overrideScene(sceneName, duration_ms) {
            isOverride = true;
            if (overrideTimer !== null) {
                clearTimeout(overrideTimer);
                overrideTimer = null;
            }
            try {
                sceneManager.switchTo(sceneName);
            }
            catch {
                // scene may not exist — still set override flag for duration timer
            }
            // Notify listeners after switchTo (whether successful or not)
            notifyChange(sceneName);
            if (duration_ms !== undefined) {
                overrideTimer = setTimeout(() => {
                    if (closed)
                        return;
                    isOverride = false;
                    overrideTimer = null;
                    // Clear state and re-evaluate current schedule
                    lastAppliedEntry = null;
                    applyCurrentScene(); // This will call notifyChange if successful
                }, duration_ms);
            }
        },
        start() {
            if (ticker !== null || closed)
                return;
            ticker = setInterval(() => {
                if (!closed)
                    applyCurrentScene();
            }, timerInterval_ms);
        },
        stop() {
            if (ticker !== null) {
                clearInterval(ticker);
                ticker = null;
            }
        },
        close() {
            closed = true;
            if (ticker !== null) {
                clearInterval(ticker);
                ticker = null;
            }
            if (overrideTimer !== null) {
                clearTimeout(overrideTimer);
                overrideTimer = null;
            }
        },
        onSceneChange(callback) {
            changeListeners.push(callback);
            return () => {
                const idx = changeListeners.indexOf(callback);
                if (idx !== -1)
                    changeListeners.splice(idx, 1);
            };
        },
    };
}
//# sourceMappingURL=scene-scheduler.js.map