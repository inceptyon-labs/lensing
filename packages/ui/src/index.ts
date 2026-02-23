export type { ZoneName, ZoneConfig } from '@lensing/types';
export { createAdminStore } from './admin-store';
export type { AdminStore, AdminStoreOptions } from './admin-store';
export { validateConfigValue, buildDefaultConfig } from './config-schema';
export { createCalendarStore } from './calendar-store';
export type { CalendarStore, CalendarStoreOptions } from './calendar-store';
export { createNotificationStore } from './notification-store';
export type { NotificationStore, NotificationStoreOptions } from './notification-store';
export { createWeatherStore } from './weather-store';
export type {
  WeatherStore,
  WeatherStoreOptions,
  WeatherData,
  WeatherCurrent,
  WeatherForecastDay,
  WeatherStoreState,
} from './weather-store';
export { createAskStore } from './ask-store';
export type { AskStore, AskStoreOptions } from './ask-store';
export { createHealthStore } from './health-store';
export type { HealthStore, HealthStoreOptions } from './health-store';

export { createAllergiesStore } from './allergies-store';
export type { AllergiesStore, AllergiesStoreOptions, AllergiesStoreState } from './allergies-store';

export { createCryptoStore } from './crypto-store';
export type { CryptoStore, CryptoStoreOptions, CryptoStoreState } from './crypto-store';

export { createNewsStore } from './news-store';
export type { NewsStore, NewsStoreOptions, NewsStoreState } from './news-store';

export { createSportsStore } from './sports-store';
export type { SportsStore, SportsStoreOptions, SportsStoreState } from './sports-store';

export { createHomeAssistantStore } from './home-assistant-store';
export type {
  HomeAssistantStore,
  HomeAssistantStoreOptions,
  HomeAssistantStoreState,
} from './home-assistant-store';

export { createPresenceStore } from './presence-store';
export type {
  PresenceStore,
  PresenceStoreOptions,
  PresenceStoreState,
} from './presence-store';

/** Placeholder: UI primitives will be exported here (cards, charts, text blocks, loading states) */
