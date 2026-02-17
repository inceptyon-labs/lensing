export type { ZoneName, ZoneConfig } from '@lensing/types';
export { createAdminStore } from './admin-store';
export type { AdminStore, AdminStoreOptions } from './admin-store';
export { validateConfigValue, buildDefaultConfig } from './config-schema';
export { createCalendarStore } from './calendar-store';
export type { CalendarStore, CalendarStoreOptions } from './calendar-store';
export { createNotificationStore } from './notification-store';
export type { NotificationStore, NotificationStoreOptions } from './notification-store';

/** Placeholder: UI primitives will be exported here (cards, charts, text blocks, loading states) */
