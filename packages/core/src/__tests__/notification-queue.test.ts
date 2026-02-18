import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { createNotificationQueue } from '../notification-queue';
import type { NotificationQueueOptions, NotificationQueueInstance } from '../notification-queue';

function defaultOptions(overrides: Partial<NotificationQueueOptions> = {}): NotificationQueueOptions {
  return {
    defaultTtl_ms: 60_000,
    ...overrides,
  };
}

describe('Notification Queue', () => {
  let queue: NotificationQueueInstance;

  afterEach(() => {
    queue?.close();
  });

  describe('factory and configuration', () => {
    it('should create a notification queue instance', () => {
      queue = createNotificationQueue(defaultOptions());
      expect(queue).toBeDefined();
      expect(queue.emit).toBeTypeOf('function');
      expect(queue.list).toBeTypeOf('function');
      expect(queue.markRead).toBeTypeOf('function');
      expect(queue.dismiss).toBeTypeOf('function');
      expect(queue.clear).toBeTypeOf('function');
      expect(queue.close).toBeTypeOf('function');
    });

    it('should use custom defaultTtl_ms', () => {
      queue = createNotificationQueue(defaultOptions({ defaultTtl_ms: 5000 }));
      const id = queue.emit({ source: 'test', priority: 'info', title: 'TTL test' });
      const items = queue.list();
      expect(items).toHaveLength(1);
      expect(items[0].id).toBe(id);
    });
  });

  describe('emit', () => {
    beforeEach(() => {
      queue = createNotificationQueue(defaultOptions());
    });

    it('should emit a notification and return its id', () => {
      const id = queue.emit({ source: 'weather', priority: 'info', title: 'Rain expected' });
      expect(id).toBeTypeOf('string');
      expect(id.length).toBeGreaterThan(0);
    });

    it('should store notification with all schema fields', () => {
      queue.emit({
        source: 'calendar',
        priority: 'warning',
        title: 'Meeting in 5 min',
        body: 'Team standup',
      });
      const items = queue.list();
      expect(items).toHaveLength(1);
      const n = items[0];
      expect(n.id).toBeTypeOf('string');
      expect(n.source).toBe('calendar');
      expect(n.priority).toBe('warning');
      expect(n.title).toBe('Meeting in 5 min');
      expect(n.body).toBe('Team standup');
      expect(n.created_at).toBeTypeOf('string');
      expect(n.read).toBe(false);
      expect(n.dismissed).toBe(false);
    });

    it('should assign unique ids to each notification', () => {
      const id1 = queue.emit({ source: 'a', priority: 'info', title: 'one' });
      const id2 = queue.emit({ source: 'b', priority: 'info', title: 'two' });
      expect(id1).not.toBe(id2);
    });

    it('should support optional body and dedupe_key', () => {
      queue.emit({
        source: 'sys',
        priority: 'urgent',
        title: 'Alert',
        body: 'System overheating',
        dedupe_key: 'sys:overheat',
      });
      const items = queue.list();
      expect(items[0].body).toBe('System overheating');
    });
  });

  describe('list and filtering', () => {
    beforeEach(() => {
      queue = createNotificationQueue(defaultOptions());
      queue.emit({ source: 'weather', priority: 'info', title: 'Sunny' });
      queue.emit({ source: 'calendar', priority: 'warning', title: 'Meeting' });
      queue.emit({ source: 'system', priority: 'urgent', title: 'Error' });
    });

    it('should list all notifications', () => {
      expect(queue.list()).toHaveLength(3);
    });

    it('should filter by priority', () => {
      const urgent = queue.list({ priority: 'urgent' });
      expect(urgent).toHaveLength(1);
      expect(urgent[0].title).toBe('Error');
    });

    it('should filter by source', () => {
      const weather = queue.list({ source: 'weather' });
      expect(weather).toHaveLength(1);
      expect(weather[0].title).toBe('Sunny');
    });

    it('should filter by read status', () => {
      const unread = queue.list({ read: false });
      expect(unread).toHaveLength(3);

      const items = queue.list();
      queue.markRead(items[0].id);

      const stillUnread = queue.list({ read: false });
      expect(stillUnread).toHaveLength(2);

      const readItems = queue.list({ read: true });
      expect(readItems).toHaveLength(1);
    });

    it('should order by priority: urgent > warning > info', () => {
      const items = queue.list();
      expect(items[0].priority).toBe('urgent');
      expect(items[1].priority).toBe('warning');
      expect(items[2].priority).toBe('info');
    });

    it('should return copies (not mutable references)', () => {
      const items1 = queue.list();
      const items2 = queue.list();
      expect(items1).not.toBe(items2);
      expect(items1[0]).not.toBe(items2[0]);
    });
  });

  describe('markRead and dismiss', () => {
    beforeEach(() => {
      queue = createNotificationQueue(defaultOptions());
    });

    it('should mark a notification as read', () => {
      const id = queue.emit({ source: 'test', priority: 'info', title: 'Read me' });
      queue.markRead(id);
      const items = queue.list();
      expect(items[0].read).toBe(true);
    });

    it('should dismiss a notification (remove it)', () => {
      const id = queue.emit({ source: 'test', priority: 'info', title: 'Dismiss me' });
      queue.dismiss(id);
      expect(queue.list()).toHaveLength(0);
    });

    it('should silently ignore markRead on non-existent id', () => {
      expect(() => queue.markRead('nonexistent')).not.toThrow();
    });

    it('should silently ignore dismiss on non-existent id', () => {
      expect(() => queue.dismiss('nonexistent')).not.toThrow();
    });
  });

  describe('clear', () => {
    it('should remove all notifications', () => {
      queue = createNotificationQueue(defaultOptions());
      queue.emit({ source: 'a', priority: 'info', title: 'one' });
      queue.emit({ source: 'b', priority: 'warning', title: 'two' });
      expect(queue.list()).toHaveLength(2);
      queue.clear();
      expect(queue.list()).toHaveLength(0);
    });
  });

  describe('close', () => {
    it('should prevent further emits after close', () => {
      queue = createNotificationQueue(defaultOptions());
      queue.emit({ source: 'test', priority: 'info', title: 'before close' });
      queue.close();
      queue.emit({ source: 'test', priority: 'info', title: 'after close' });
      // After close, emit is a no-op
      expect(queue.list()).toHaveLength(0);
    });
  });
});
