import type { NotificationPriority, NotificationFilter, NotificationEntry } from '@lensing/types';
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
/**
 * Creates an in-memory notification queue with priority levels, TTL expiry,
 * deduplication, and a plugin emission API.
 */
export declare function createNotificationQueue(options?: NotificationQueueOptions): NotificationQueueInstance;
//# sourceMappingURL=notification-queue.d.ts.map