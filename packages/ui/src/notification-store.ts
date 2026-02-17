import type {
  Notification,
  NotificationEntry,
  QuietHours,
  NotificationFilter,
} from '@lensing/types';

export interface NotificationStoreOptions {
  onChange?: (action: string, id?: string) => void;
  defaultToastTtl_ms?: number;
}

export interface NotificationStore {
  addNotification(notification: Notification): void;
  dismiss(id: string): void;
  markRead(id: string): void;
  markAllRead(): void;
  getAll(): NotificationEntry[];
  getUnread(): NotificationEntry[];
  getActiveBanners(): NotificationEntry[];
  getActiveToasts(): NotificationEntry[];
  filter(criteria: NotificationFilter): NotificationEntry[];
  setPluginEnabled(source: string, enabled: boolean): void;
  isPluginEnabled(source: string): boolean;
  setQuietHours(start: number, end: number): void;
  clearQuietHours(): void;
  isQuietTime(): boolean;
  clear(): void;
}

export function createNotificationStore(options: NotificationStoreOptions = {}): NotificationStore {
  const { onChange, defaultToastTtl_ms = 5000 } = options;
  const notifications = new Map<string, NotificationEntry>();
  const pluginToggles = new Map<string, boolean>();
  let quietHours: QuietHours | undefined;

  function notify(action: string, id?: string) {
    onChange?.(action, id);
  }

  function isQuietTime(): boolean {
    if (!quietHours) return false;
    const now = new Date();
    const hour = now.getHours();
    const { start, end } = quietHours;

    if (start < end) {
      return hour >= start && hour < end;
    } else {
      return hour >= start || hour < end;
    }
  }

  function isPluginEnabled(source: string): boolean {
    return pluginToggles.get(source) ?? true;
  }

  function shouldSuppress(notification: Notification): boolean {
    if (!isPluginEnabled(notification.source)) {
      return true;
    }

    if (isQuietTime() && notification.priority !== 'urgent') {
      return true;
    }

    return false;
  }

  function isExpired(entry: NotificationEntry): boolean {
    if (entry.priority === 'urgent') return false;
    if (entry.ttl_ms === undefined) return false;
    if (entry.ttl_ms === 0) return true; // Expire immediately

    const created = new Date(entry.created_at).getTime();
    const now = Date.now();
    return now - created > entry.ttl_ms;
  }

  return {
    addNotification(notification) {
      if (notifications.has(notification.id)) return;
      if (shouldSuppress(notification)) return;

      const entry: NotificationEntry = {
        ...notification,
        ttl_ms: notification.ttl_ms ?? defaultToastTtl_ms,
        read: false,
        dismissed: false,
      };

      notifications.set(notification.id, entry);
      notify('added', notification.id);
    },

    dismiss(id) {
      const entry = notifications.get(id);
      if (!entry) return;

      entry.dismissed = true;
      notify('dismissed', id);
    },

    markRead(id) {
      const entry = notifications.get(id);
      if (!entry) return;

      entry.read = true;
      notify('read', id);
    },

    markAllRead() {
      for (const entry of notifications.values()) {
        entry.read = true;
      }
      notify('all_read', undefined);
    },

    getAll() {
      const entries = Array.from(notifications.values());
      return entries
        .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
        .map((e) => ({ ...e }));
    },

    getUnread() {
      return Array.from(notifications.values())
        .filter((e) => !e.read)
        .map((e) => ({ ...e }));
    },

    getActiveBanners() {
      return Array.from(notifications.values())
        .filter((e) => e.priority === 'urgent' && !e.dismissed)
        .map((e) => ({ ...e }));
    },

    getActiveToasts() {
      return Array.from(notifications.values())
        .filter(
          (e) =>
            (e.priority === 'info' || e.priority === 'warning') &&
            !e.dismissed &&
            !isExpired(e) &&
            isPluginEnabled(e.source) &&
            !isQuietTime()
        )
        .map((e) => ({ ...e }));
    },

    filter(criteria) {
      let results = Array.from(notifications.values());

      if (criteria.priority !== undefined) {
        results = results.filter((e) => e.priority === criteria.priority);
      }

      if (criteria.source !== undefined) {
        results = results.filter((e) => e.source === criteria.source);
      }

      if (criteria.read !== undefined) {
        results = results.filter((e) => e.read === criteria.read);
      }

      return results.map((e) => ({ ...e }));
    },

    setPluginEnabled(source, enabled) {
      pluginToggles.set(source, enabled);
    },

    isPluginEnabled,

    setQuietHours(start, end) {
      quietHours = { start, end };
    },

    clearQuietHours() {
      quietHours = undefined;
    },

    isQuietTime,

    clear() {
      notifications.clear();
      notify('cleared', undefined);
    },
  };
}
