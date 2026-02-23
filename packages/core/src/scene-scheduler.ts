import type {
  SceneSchedule,
  SceneScheduleEntry,
  DatabaseInstance,
  SceneManagerInstance,
} from '@lensing/types';

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

/** Get total minutes since midnight (UTC) for a given date */
function utcMinutes(date: Date): number {
  return date.getUTCHours() * 60 + date.getUTCMinutes();
}

/** Find the most recent schedule entry that should be active now */
function getCurrentApplicableEntry(
  schedule: SceneSchedule,
  now: Date
): SceneScheduleEntry | null {
  const current = utcMinutes(now);
  let applicable: SceneScheduleEntry | null = null;

  for (const entry of schedule.entries) {
    const [hours, minutes] = entry.time.split(':').map(Number);
    const entryMinutes = hours * 60 + minutes;
    if (entryMinutes <= current) {
      applicable = entry;
    }
  }

  return applicable;
}

export function createSceneScheduler(options: SceneSchedulerOptions): SceneSchedulerInstance {
  const { db, sceneManager, timerInterval_ms = 60_000 } = options;

  let activeSchedule: SceneSchedule | undefined = undefined;
  let lastAppliedEntry: SceneScheduleEntry | null = null;
  let isOverride = false;
  let preOverrideScene: string | null = null;
  let overrideTimer: ReturnType<typeof setTimeout> | null = null;
  let ticker: ReturnType<typeof setInterval> | null = null;
  let closed = false;

  const changeListeners: Array<(sceneName: string) => void> = [];

  function notifyChange(sceneName: string): void {
    for (const cb of [...changeListeners]) {
      try {
        cb(sceneName);
      } catch {
        // isolate listener errors
      }
    }
  }

  function applyCurrentScene(): void {
    if (!activeSchedule || isOverride || closed) return;
    const applicable = getCurrentApplicableEntry(activeSchedule, new Date());
    if (!applicable) return;
    if (applicable.sceneName === lastAppliedEntry?.sceneName) return;

    lastAppliedEntry = applicable;
    notifyChange(applicable.sceneName);
    try {
      sceneManager.switchTo(applicable.sceneName);
    } catch {
      // scene may not exist — still notify listeners
    }
  }

  // Load any persisted schedule on creation
  const stored = db.getAllSchedules();
  const storedIds = Object.keys(stored);
  if (storedIds.length > 0) {
    activeSchedule = stored[storedIds[0]];
  }

  return {
    getActiveSchedule(): SceneSchedule | undefined {
      return activeSchedule;
    },

    setSchedule(schedule: SceneSchedule): void {
      db.setSchedule(schedule);
      activeSchedule = schedule;
      lastAppliedEntry = null; // reset so current entry is re-applied
      applyCurrentScene();
    },

    getNextScheduledScene(): SceneScheduleEntry | undefined {
      if (!activeSchedule || activeSchedule.entries.length === 0) return undefined;

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

    overrideScene(sceneName: string, duration_ms?: number): void {
      preOverrideScene = sceneManager.getActiveSceneName();
      isOverride = true;

      if (overrideTimer !== null) {
        clearTimeout(overrideTimer);
        overrideTimer = null;
      }

      try {
        sceneManager.switchTo(sceneName);
        notifyChange(sceneName);
      } catch {
        // scene may not exist
      }

      if (duration_ms !== undefined) {
        overrideTimer = setTimeout(() => {
          if (closed) return;
          isOverride = false;
          overrideTimer = null;
          // Restore to pre-override scene
          if (preOverrideScene !== null) {
            try {
              sceneManager.switchTo(preOverrideScene);
              notifyChange(preOverrideScene);
            } catch {
              // ignore
            }
          }
        }, duration_ms);
      }
    },

    start(): void {
      if (ticker !== null || closed) return;
      ticker = setInterval(() => {
        if (!closed) applyCurrentScene();
      }, timerInterval_ms);
    },

    stop(): void {
      if (ticker !== null) {
        clearInterval(ticker);
        ticker = null;
      }
    },

    close(): void {
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

    onSceneChange(callback: (sceneName: string) => void): () => void {
      changeListeners.push(callback);
      return () => {
        const idx = changeListeners.indexOf(callback);
        if (idx !== -1) changeListeners.splice(idx, 1);
      };
    },
  };
}
