import type { NotificationPriority, NotificationFilter, NotificationEntry } from '@lensing/types';

// ── Types ──────────────────────────────────────────────────────────────────────

export interface EmitOptions {
  source: string;
  priority: NotificationPriority;
  title: string;
  body?: string;
  ttl_ms?: number;
  dedupe_key?: string;
}

export interface NotificationQueueOptions {
  /** Default TTL for notifications in ms (default: 3600000 = 1 hour) */
  defaultTtl_ms?: number;
  /** Interval for TTL sweep in ms (default: 60000 = 1 minute) */
  sweepInterval_ms?: number;
  /** Deduplication window in ms — same dedupe_key within window updates existing (default: 300000 = 5 min) */
  dedupeWindow_ms?: number;
}

export interface NotificationQueueInstance {
  /** Emit a notification; returns the id */
  emit(options: EmitOptions): string;
  /** List notifications, optionally filtered and ordered by priority */
  list(filter?: NotificationFilter): NotificationEntry[];
  /** Mark a notification as read */
  markRead(id: string): void;
  /** Remove a notification */
  dismiss(id: string): void;
  /** Remove all notifications */
  clear(): void;
  /** Emit a system-level notification */
  emitSystemEvent(event: 'plugin_error' | 'connectivity_loss', detail: string): string;
  /** Register a listener called when a new notification is emitted; returns unsubscribe */
  onNotification(callback: (entry: NotificationEntry) => void): () => void;
  /** Stop the sweep timer and release resources */
  close(): void;
}

// ── Constants ──────────────────────────────────────────────────────────────────

const DEFAULT_TTL_MS = 3_600_000; // 1 hour
const DEFAULT_SWEEP_INTERVAL_MS = 60_000; // 1 minute
const DEFAULT_DEDUPE_WINDOW_MS = 300_000; // 5 minutes

const PRIORITY_ORDER: Record<NotificationPriority, number> = {
  urgent: 0,
  warning: 1,
  info: 2,
};

// ── Helpers ────────────────────────────────────────────────────────────────────

function generateId(): string {
  return `notif-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}

// ── Factory ────────────────────────────────────────────────────────────────────

/**
 * Creates an in-memory notification queue with priority levels, TTL expiry,
 * deduplication, and a plugin emission API.
 */
export function createNotificationQueue(
  options: NotificationQueueOptions = {}
): NotificationQueueInstance {
  const defaultTtl_ms = options.defaultTtl_ms ?? DEFAULT_TTL_MS;
  const sweepInterval_ms = options.sweepInterval_ms ?? DEFAULT_SWEEP_INTERVAL_MS;
  const dedupeWindow_ms = options.dedupeWindow_ms ?? DEFAULT_DEDUPE_WINDOW_MS;

  const notifications = new Map<
    string,
    NotificationEntry & { ttl_ms: number; dedupe_key?: string }
  >();
  const listeners: Array<(entry: NotificationEntry) => void> = [];
  let closed = false;
  let sweepTimer: ReturnType<typeof setInterval> | null = null;

  // Start TTL sweep
  sweepTimer = setInterval(() => {
    const now = Date.now();
    for (const [id, entry] of notifications) {
      const age = now - new Date(entry.created_at).getTime();
      if (age > entry.ttl_ms) {
        notifications.delete(id);
      }
    }
  }, sweepInterval_ms);

  function notifyListeners(entry: NotificationEntry): void {
    for (const cb of listeners) {
      try {
        cb({ ...entry });
      } catch {
        // isolate listener errors
      }
    }
  }

  function doEmit(opts: EmitOptions): string {
    if (closed) return '';

    const ttl = opts.ttl_ms ?? defaultTtl_ms;
    const now = new Date().toISOString();

    // Deduplication: if same dedupe_key exists within window (same source, not expired), update it
    if (opts.dedupe_key) {
      for (const [id, existing] of notifications) {
        if (existing.dedupe_key === opts.dedupe_key && existing.source === opts.source) {
          const age = Date.now() - new Date(existing.created_at).getTime();
          // Only dedupe if not expired
          if (age <= dedupeWindow_ms && age <= existing.ttl_ms) {
            // Update existing entry
            const updated = {
              ...existing,
              priority: opts.priority,
              title: opts.title,
              body: opts.body,
              ttl_ms: ttl,
              created_at: now,
            };
            notifications.set(id, updated);
            notifyListeners(updated);
            return id;
          }
        }
      }
    }

    const id = generateId();
    const entry = {
      id,
      source: opts.source,
      priority: opts.priority,
      title: opts.title,
      body: opts.body,
      ttl_ms: ttl,
      created_at: now,
      read: false,
      dismissed: false,
      dedupe_key: opts.dedupe_key,
    };

    notifications.set(id, entry);
    notifyListeners(entry);
    return id;
  }

  return {
    emit(opts: EmitOptions): string {
      return doEmit(opts);
    },

    list(filter?: NotificationFilter): NotificationEntry[] {
      const now = Date.now();
      let entries = Array.from(notifications.values())
        // Filter out expired entries
        .filter((e) => {
          const age = now - new Date(e.created_at).getTime();
          return age <= e.ttl_ms;
        });

      if (filter) {
        if (filter.priority !== undefined) {
          entries = entries.filter((e) => e.priority === filter.priority);
        }
        if (filter.source !== undefined) {
          entries = entries.filter((e) => e.source === filter.source);
        }
        if (filter.read !== undefined) {
          entries = entries.filter((e) => e.read === filter.read);
        }
      }

      // Sort by priority: urgent > warning > info, then by created_at (newest first within same priority)
      entries.sort((a, b) => {
        const pDiff = PRIORITY_ORDER[a.priority] - PRIORITY_ORDER[b.priority];
        if (pDiff !== 0) return pDiff;
        return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
      });

      // Return copies
      return entries.map((e) => ({ ...e }));
    },

    markRead(id: string): void {
      const entry = notifications.get(id);
      if (entry) {
        notifications.set(id, { ...entry, read: true });
      }
    },

    dismiss(id: string): void {
      notifications.delete(id);
    },

    clear(): void {
      notifications.clear();
    },

    emitSystemEvent(event: 'plugin_error' | 'connectivity_loss', detail: string): string {
      const titles: Record<string, string> = {
        plugin_error: 'Plugin Error',
        connectivity_loss: 'Connectivity Lost',
      };
      const priorities: Record<string, NotificationPriority> = {
        plugin_error: 'warning',
        connectivity_loss: 'urgent',
      };

      return doEmit({
        source: 'system',
        priority: priorities[event],
        title: titles[event],
        body: detail,
        dedupe_key: `system:${event}`,
      });
    },

    onNotification(callback: (entry: NotificationEntry) => void): () => void {
      listeners.push(callback);
      return () => {
        const idx = listeners.indexOf(callback);
        if (idx !== -1) listeners.splice(idx, 1);
      };
    },

    close(): void {
      closed = true;
      if (sweepTimer !== null) {
        clearInterval(sweepTimer);
        sweepTimer = null;
      }
      notifications.clear();
      listeners.length = 0;
    },
  };
}
