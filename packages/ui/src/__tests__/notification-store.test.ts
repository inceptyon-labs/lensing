import { describe, it, expect, beforeEach, vi, afterEach } from 'vitest';
import { createNotificationStore, type NotificationStore } from '../notification-store';
import type { Notification } from '@lensing/types';

function makeNotification(id: string, overrides?: Partial<Notification>): Notification {
  return {
    id,
    source: 'weather',
    priority: 'info',
    title: `Notification ${id}`,
    created_at: new Date().toISOString(),
    ...overrides,
  };
}

describe('NotificationStore', () => {
  let store: NotificationStore;

  beforeEach(() => {
    vi.useFakeTimers();
    store = createNotificationStore();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  describe('basic notification management', () => {
    it('should start with no notifications', () => {
      expect(store.getAll()).toEqual([]);
    });

    it('should add a notification', () => {
      store.addNotification(makeNotification('n1'));
      expect(store.getAll().length).toBe(1);
      expect(store.getAll()[0].id).toBe('n1');
    });

    it('should add notifications with read=false and dismissed=false', () => {
      store.addNotification(makeNotification('n1'));
      const entry = store.getAll()[0];
      expect(entry.read).toBe(false);
      expect(entry.dismissed).toBe(false);
    });

    it('should not add duplicate notification IDs', () => {
      store.addNotification(makeNotification('n1'));
      store.addNotification(makeNotification('n1'));
      expect(store.getAll().length).toBe(1);
    });

    it('should dismiss a notification', () => {
      store.addNotification(makeNotification('n1'));
      store.dismiss('n1');
      expect(store.getAll()[0].dismissed).toBe(true);
    });

    it('should silently ignore dismiss of nonexistent notification', () => {
      expect(() => store.dismiss('nonexistent')).not.toThrow();
    });

    it('should clear all notifications', () => {
      store.addNotification(makeNotification('n1'));
      store.addNotification(makeNotification('n2'));
      store.clear();
      expect(store.getAll()).toEqual([]);
    });
  });

  describe('priority-based routing', () => {
    it('should route urgent notifications to banners', () => {
      store.addNotification(makeNotification('u1', { priority: 'urgent' }));
      expect(store.getActiveBanners().map((n) => n.id)).toContain('u1');
      expect(store.getActiveToasts().map((n) => n.id)).not.toContain('u1');
    });

    it('should route info notifications to toasts', () => {
      store.addNotification(makeNotification('i1', { priority: 'info' }));
      expect(store.getActiveToasts().map((n) => n.id)).toContain('i1');
      expect(store.getActiveBanners().map((n) => n.id)).not.toContain('i1');
    });

    it('should route warning notifications to toasts', () => {
      store.addNotification(makeNotification('w1', { priority: 'warning' }));
      expect(store.getActiveToasts().map((n) => n.id)).toContain('w1');
      expect(store.getActiveBanners().map((n) => n.id)).not.toContain('w1');
    });

    it('should not include dismissed notifications in active banners', () => {
      store.addNotification(makeNotification('u1', { priority: 'urgent' }));
      store.dismiss('u1');
      expect(store.getActiveBanners()).toEqual([]);
    });

    it('should not include dismissed notifications in active toasts', () => {
      store.addNotification(makeNotification('i1', { priority: 'info' }));
      store.dismiss('i1');
      expect(store.getActiveToasts()).toEqual([]);
    });
  });

  describe('mark-as-read', () => {
    it('should mark a notification as read', () => {
      store.addNotification(makeNotification('n1'));
      store.markRead('n1');
      expect(store.getAll()[0].read).toBe(true);
    });

    it('should silently ignore markRead of nonexistent notification', () => {
      expect(() => store.markRead('nonexistent')).not.toThrow();
    });

    it('should return unread notifications', () => {
      store.addNotification(makeNotification('n1'));
      store.addNotification(makeNotification('n2'));
      store.markRead('n1');

      const unread = store.getUnread();
      expect(unread.length).toBe(1);
      expect(unread[0].id).toBe('n2');
    });

    it('should mark all notifications as read', () => {
      store.addNotification(makeNotification('n1'));
      store.addNotification(makeNotification('n2'));
      store.addNotification(makeNotification('n3'));
      store.markAllRead();
      expect(store.getUnread()).toEqual([]);
    });
  });

  describe('filtering', () => {
    beforeEach(() => {
      store.addNotification(makeNotification('i1', { priority: 'info', source: 'weather' }));
      store.addNotification(makeNotification('w1', { priority: 'warning', source: 'calendar' }));
      store.addNotification(makeNotification('u1', { priority: 'urgent', source: 'weather' }));
      store.markRead('i1');
    });

    it('should filter by priority', () => {
      const result = store.filter({ priority: 'urgent' });
      expect(result.length).toBe(1);
      expect(result[0].id).toBe('u1');
    });

    it('should filter by source', () => {
      const result = store.filter({ source: 'weather' });
      expect(result.length).toBe(2);
      expect(result.map((n) => n.id)).toContain('i1');
      expect(result.map((n) => n.id)).toContain('u1');
    });

    it('should filter by read status', () => {
      const unread = store.filter({ read: false });
      expect(unread.length).toBe(2);
      expect(unread.map((n) => n.id)).toContain('w1');
      expect(unread.map((n) => n.id)).toContain('u1');
    });

    it('should combine filter criteria', () => {
      const result = store.filter({ source: 'weather', read: false });
      expect(result.length).toBe(1);
      expect(result[0].id).toBe('u1');
    });

    it('should return all when no filter criteria given', () => {
      const result = store.filter({});
      expect(result.length).toBe(3);
    });
  });

  describe('TTL-based toast expiry', () => {
    it('should expire toasts after their TTL', () => {
      store.addNotification(makeNotification('t1', { priority: 'info', ttl_ms: 5000 }));
      expect(store.getActiveToasts().length).toBe(1);

      vi.advanceTimersByTime(6000);
      expect(store.getActiveToasts().length).toBe(0);
    });

    it('should use default TTL when none specified', () => {
      store = createNotificationStore({ defaultToastTtl_ms: 3000 });
      store.addNotification(makeNotification('t1', { priority: 'info' }));
      expect(store.getActiveToasts().length).toBe(1);

      vi.advanceTimersByTime(4000);
      expect(store.getActiveToasts().length).toBe(0);
    });

    it('should not auto-expire urgent banners', () => {
      store.addNotification(makeNotification('u1', { priority: 'urgent', ttl_ms: 5000 }));

      vi.advanceTimersByTime(10000);
      // Banners stay until manually dismissed, ignoring TTL
      expect(store.getActiveBanners().length).toBe(1);
    });

    it('should keep expired toasts in history', () => {
      store.addNotification(makeNotification('t1', { priority: 'info', ttl_ms: 5000 }));
      vi.advanceTimersByTime(6000);

      // Not in active toasts but still in getAll
      expect(store.getActiveToasts().length).toBe(0);
      expect(store.getAll().length).toBe(1);
    });
  });

  describe('quiet hours', () => {
    it('should not be in quiet time by default', () => {
      expect(store.isQuietTime()).toBe(false);
    });

    it('should suppress non-urgent notifications during quiet hours', () => {
      vi.setSystemTime(new Date(2026, 0, 15, 23, 30)); // 11:30 PM
      store.setQuietHours(22, 7); // 10 PM - 7 AM

      store.addNotification(makeNotification('i1', { priority: 'info' }));
      expect(store.getAll().length).toBe(0);
    });

    it('should allow urgent notifications during quiet hours', () => {
      vi.setSystemTime(new Date(2026, 0, 15, 23, 30));
      store.setQuietHours(22, 7);

      store.addNotification(makeNotification('u1', { priority: 'urgent' }));
      expect(store.getAll().length).toBe(1);
    });

    it('should handle overnight quiet hours (start > end)', () => {
      vi.setSystemTime(new Date(2026, 0, 16, 5, 0)); // 5 AM
      store.setQuietHours(22, 7); // 10 PM - 7 AM

      expect(store.isQuietTime()).toBe(true);
      store.addNotification(makeNotification('i1', { priority: 'info' }));
      expect(store.getAll().length).toBe(0);
    });

    it('should not suppress during daytime with overnight quiet hours', () => {
      vi.setSystemTime(new Date(2026, 0, 16, 12, 0)); // Noon
      store.setQuietHours(22, 7);

      expect(store.isQuietTime()).toBe(false);
      store.addNotification(makeNotification('i1', { priority: 'info' }));
      expect(store.getAll().length).toBe(1);
    });

    it('should handle same-day quiet hours (start < end)', () => {
      vi.setSystemTime(new Date(2026, 0, 16, 14, 0)); // 2 PM
      store.setQuietHours(13, 17); // 1 PM - 5 PM

      expect(store.isQuietTime()).toBe(true);
    });

    it('should clear quiet hours', () => {
      store.setQuietHours(22, 7);
      store.clearQuietHours();
      expect(store.isQuietTime()).toBe(false);
    });
  });

  describe('per-plugin notification toggle', () => {
    it('should allow all plugins by default', () => {
      expect(store.isPluginEnabled('weather')).toBe(true);
    });

    it('should block notifications from disabled plugins', () => {
      store.setPluginEnabled('weather', false);
      store.addNotification(makeNotification('n1', { source: 'weather' }));
      expect(store.getAll().length).toBe(0);
    });

    it('should allow notifications from enabled plugins', () => {
      store.setPluginEnabled('weather', false);
      store.setPluginEnabled('weather', true);
      store.addNotification(makeNotification('n1', { source: 'weather' }));
      expect(store.getAll().length).toBe(1);
    });

    it('should not affect other plugins when disabling one', () => {
      store.setPluginEnabled('weather', false);
      store.addNotification(makeNotification('n1', { source: 'calendar' }));
      expect(store.getAll().length).toBe(1);
    });
  });

  describe('onChange callback', () => {
    it('should fire onChange when notification is added', () => {
      const onChange = vi.fn();
      store = createNotificationStore({ onChange });
      store.addNotification(makeNotification('n1'));
      expect(onChange).toHaveBeenCalledWith('added', 'n1');
    });

    it('should fire onChange when notification is dismissed', () => {
      const onChange = vi.fn();
      store = createNotificationStore({ onChange });
      store.addNotification(makeNotification('n1'));
      onChange.mockClear();
      store.dismiss('n1');
      expect(onChange).toHaveBeenCalledWith('dismissed', 'n1');
    });

    it('should fire onChange when notification is marked read', () => {
      const onChange = vi.fn();
      store = createNotificationStore({ onChange });
      store.addNotification(makeNotification('n1'));
      onChange.mockClear();
      store.markRead('n1');
      expect(onChange).toHaveBeenCalledWith('read', 'n1');
    });

    it('should fire onChange on markAllRead', () => {
      const onChange = vi.fn();
      store = createNotificationStore({ onChange });
      store.addNotification(makeNotification('n1'));
      store.addNotification(makeNotification('n2'));
      onChange.mockClear();
      store.markAllRead();
      expect(onChange).toHaveBeenCalledWith('all_read', undefined);
    });

    it('should fire onChange on clear', () => {
      const onChange = vi.fn();
      store = createNotificationStore({ onChange });
      store.addNotification(makeNotification('n1'));
      onChange.mockClear();
      store.clear();
      expect(onChange).toHaveBeenCalledWith('cleared', undefined);
    });

    it('should not fire onChange when suppressed by quiet hours', () => {
      const onChange = vi.fn();
      store = createNotificationStore({ onChange });
      vi.setSystemTime(new Date(2026, 0, 15, 23, 30));
      store.setQuietHours(22, 7);

      store.addNotification(makeNotification('i1', { priority: 'info' }));
      expect(onChange).not.toHaveBeenCalled();
    });

    it('should not fire onChange when suppressed by plugin toggle', () => {
      const onChange = vi.fn();
      store = createNotificationStore({ onChange });
      store.setPluginEnabled('weather', false);

      store.addNotification(makeNotification('n1', { source: 'weather' }));
      expect(onChange).not.toHaveBeenCalled();
    });
  });

  describe('ordering', () => {
    it('should return notifications newest first', () => {
      vi.setSystemTime(new Date(2026, 0, 15, 10, 0));
      store.addNotification(makeNotification('old'));

      vi.setSystemTime(new Date(2026, 0, 15, 12, 0));
      store.addNotification(makeNotification('new'));

      const all = store.getAll();
      expect(all[0].id).toBe('new');
      expect(all[1].id).toBe('old');
    });
  });

  describe('TTL = 0 behavior', () => {
    it('should expire toasts with ttl_ms = 0 immediately', () => {
      store.addNotification(makeNotification('t1', { priority: 'info', ttl_ms: 0 }));
      expect(store.getActiveToasts().length).toBe(0);
    });

    it('should expire toasts with defaultToastTtl_ms = 0', () => {
      store = createNotificationStore({ defaultToastTtl_ms: 0 });
      store.addNotification(makeNotification('t1', { priority: 'info' }));
      expect(store.getActiveToasts().length).toBe(0);
    });
  });

  describe('retroactive quiet hours/plugin control', () => {
    it('should hide toasts when quiet hours are enabled', () => {
      store.addNotification(makeNotification('i1', { priority: 'info' }));
      expect(store.getActiveToasts().length).toBe(1);

      vi.setSystemTime(new Date(2026, 0, 15, 23, 30));
      store.setQuietHours(22, 7);
      expect(store.getActiveToasts().length).toBe(0);
    });

    it('should show toasts again when quiet hours are cleared', () => {
      store.addNotification(makeNotification('i1', { priority: 'info', ttl_ms: 999999 }));
      expect(store.getActiveToasts().length).toBe(1);

      vi.setSystemTime(new Date(2026, 0, 15, 23, 30));
      store.setQuietHours(22, 7);
      expect(store.getActiveToasts().length).toBe(0);

      store.clearQuietHours();
      expect(store.getActiveToasts().length).toBe(1);
    });

    it('should hide toasts when plugin is disabled', () => {
      store.addNotification(makeNotification('i1', { priority: 'info', source: 'weather' }));
      expect(store.getActiveToasts().length).toBe(1);

      store.setPluginEnabled('weather', false);
      expect(store.getActiveToasts().length).toBe(0);
    });

    it('should show toasts again when plugin is re-enabled', () => {
      store.addNotification(makeNotification('i1', { priority: 'info', source: 'weather' }));
      store.setPluginEnabled('weather', false);
      expect(store.getActiveToasts().length).toBe(0);

      store.setPluginEnabled('weather', true);
      expect(store.getActiveToasts().length).toBe(1);
    });
  });

  describe('immutability of returned entries', () => {
    it('should not allow mutation of getAll() results to affect store', () => {
      store.addNotification(makeNotification('n1'));
      const entry = store.getAll()[0];
      entry.read = true;
      expect(store.getAll()[0].read).toBe(false);
    });

    it('should not allow mutation of getUnread() results', () => {
      store.addNotification(makeNotification('n1'));
      const entry = store.getUnread()[0];
      entry.read = true;
      expect(store.getUnread()[0].read).toBe(false);
    });

    it('should not allow mutation of getActiveBanners() results', () => {
      store.addNotification(makeNotification('u1', { priority: 'urgent' }));
      const entry = store.getActiveBanners()[0];
      entry.dismissed = true;
      expect(store.getActiveBanners()[0].dismissed).toBe(false);
    });

    it('should not allow mutation of getActiveToasts() results', () => {
      store.addNotification(makeNotification('i1', { priority: 'info' }));
      const entry = store.getActiveToasts()[0];
      entry.read = true;
      expect(store.getActiveToasts()[0].read).toBe(false);
    });

    it('should not allow mutation of filter() results', () => {
      store.addNotification(makeNotification('i1', { priority: 'info' }));
      const entry = store.filter({ priority: 'info' })[0];
      entry.read = true;
      expect(store.filter({ priority: 'info' })[0].read).toBe(false);
    });
  });
});
