import type { Notification, NotificationEntry, NotificationFilter } from '@lensing/types';
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
export declare function createNotificationStore(options?: NotificationStoreOptions): NotificationStore;
//# sourceMappingURL=notification-store.d.ts.map