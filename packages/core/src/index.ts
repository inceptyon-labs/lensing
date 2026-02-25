export type {
  PluginManifest,
  PluginInstance,
  PluginStatus,
  WsMessage,
  WsMessageType,
  ConnectionStatus,
} from '@lensing/types';
export {
  createPermissionEnforcer,
  validateNetworkDomain,
  validateRefreshRate,
  validateSecretAccess,
} from './plugin-permissions';
export type {
  PermissionViolation,
  EnforcerOptions,
  RefreshValidation,
  PluginEnforcer,
} from './plugin-permissions';
export { createWsServer } from './ws-server';
export type { WsServerOptions, WsServerInstance } from './ws-server';
export { createReconnectManager, calculateBackoff } from './ws-reconnect';
export type { ReconnectOptions, ReconnectManager, BackoffOptions } from './ws-reconnect';
export { createCacheStore } from './cache';
export type { CacheStore, CacheEntry, StalePolicy, StaleStatus } from './cache';
export { createRestServer } from './rest-server';
export type {
  RestServerOptions,
  RestServerInstance,
  RestServerHandlers,
  LogEntry,
} from './rest-server';
export { createPluginScheduler } from './plugin-scheduler';
export type {
  SchedulerOptions,
  SchedulerEntry,
  SchedulerStatus,
  PluginSchedulerInstance,
} from './plugin-scheduler';

export { createWeatherServer } from './weather-server';
export type {
  WeatherServerOptions,
  WeatherServerInstance,
  WeatherData,
  WeatherCurrent,
  WeatherForecastDay,
  WeatherLocation,
  FetchFn,
} from './weather-server';

export { createCalendarServer } from './caldav-client';
export type {
  CalendarServerOptions,
  CalendarServerInstance,
  CalDAVFetchFn,
  CalDAVRequestOptions,
  CalDAVResponse,
} from './caldav-client';

export { createNotificationQueue } from './notification-queue';
export type {
  NotificationQueueOptions,
  NotificationQueueInstance,
  EmitOptions,
} from './notification-queue';

export { createPluginLoader } from './plugin-loader';
export type { PluginLoaderOptions } from './plugin-loader';

export { createDataBus } from './data-bus';

export { createSceneManager, DEFAULT_SCENES } from './scene-manager';
export type { SceneManagerOptions } from './scene-manager';

export { createDatabase } from './database';
export type { DatabaseOptions } from '@lensing/types';

export { createAgentService } from './agent-service';

export { createAgentGateway } from './agent-gateway';

export { createAllergiesServer } from './allergies-server';
export type {
  AllergiesServerOptions,
  AllergiesServerInstance,
  AllergyData,
  AllergenLevel,
  AllergyLocation,
} from '@lensing/types';

export { createCryptoServer } from './crypto-server';
export type {
  CryptoServerOptions,
  CryptoServerInstance,
  CryptoData,
  CoinPrice,
  CryptoAlertConfig,
} from '@lensing/types';

// ── Photo Slideshow ────────────────────────────────────────────────────────
export {
  discoverPhotos,
  calculateKenBurnsTransform,
  getNextPhotoIndex,
} from './plugins/photo-slideshow/index';
export type { PhotoSlideshow, KenBurnsConfig } from '@lensing/types';
export {
  DEFAULT_KEN_BURNS_CONFIG,
  DEFAULT_CYCLE_INTERVAL_MS,
  SUPPORTED_IMAGE_EXTENSIONS,
} from '@lensing/types';

// ── News ───────────────────────────────────────────────────────────────────
export { createNewsServer } from './news-server';
export type { NewsServerOptions, NewsServerInstance, NewsData, NewsArticle } from '@lensing/types';
export { DEFAULT_NEWS_MAX_ITEMS, DEFAULT_NEWS_MAX_STALE_MS } from '@lensing/types';

// ── Sports Scores ───────────────────────────────────────────────────────────
export { createSportsServer } from './sports-server';
export type {
  SportsServerOptions,
  SportsServerInstance,
  SportsData,
  SportsGame,
  GameStatus,
  LeagueConfig,
} from '@lensing/types';
export { DEFAULT_SPORTS_MAX_STALE_MS, DEFAULT_SPORTS_LEAGUES } from '@lensing/types';

// ── Config Transfer ─────────────────────────────────────────────────────────
export { createConfigTransfer } from './config-transfer';
export type {
  ConfigExportV1,
  ConfigExport,
  ImportResult,
  ConfigMigration,
  ConfigTransferOptions,
  ConfigTransferInstance,
} from '@lensing/types';
export { CURRENT_CONFIG_VERSION } from '@lensing/types';

// ── Home Assistant ──────────────────────────────────────────────────────────
export { createHomeAssistantServer } from './home-assistant-server';
export type {
  HomeAssistantServerOptions,
  HomeAssistantServerInstance,
  HomeAssistantData,
  HassEntity,
} from '@lensing/types';
export { DEFAULT_HA_MAX_STALE_MS, DEFAULT_HA_DOMAINS } from '@lensing/types';
export type { WsLike, WsFactory } from '@lensing/types';

// ── Scene Scheduling ─────────────────────────────────────────────────────────
export { createSceneScheduler } from './scene-scheduler';
export type { SceneSchedulerOptions, SceneSchedulerInstance } from './scene-scheduler';
export type { CronTime, SceneScheduleEntry, SceneSchedule } from '@lensing/types';
export { cronTime, isCronTimeReached, getNextScheduleEntry } from '@lensing/types';

// ── PIR Sensor / Presence Detection ────────────────────────────────────────
export { createPIRServer } from './pir-server';
export type {
  PIRServerOptions,
  PIRServerInstance,
  PresenceData,
  GpioWatcher,
  GpioWatcherFactory,
} from '@lensing/types';
export { DEFAULT_PIR_IDLE_TIMEOUT_MS, DEFAULT_PIR_GPIO_PIN } from '@lensing/types';

// ── Module Settings ─────────────────────────────────────────────────────────
export { readModuleConfig, writeModuleConfig } from './module-settings';
export type { ModuleConfig } from './module-settings';

// ── Module Boot ─────────────────────────────────────────────────────────────
export { bootEnabledModules } from './module-boot';
export type { BootedModule, BootDeps } from './module-boot';

// ── Host Service (unified boot sequence) ────────────────────────────────────
export { createHostService } from './host-service';
export type { HostServiceInstance } from './host-service';
export type { HostServiceOptions, HostServiceLogger } from '@lensing/types';

export { createPluginAdminHandlers } from './plugin-admin-handlers';
export type { PluginAdminHandlersOptions } from './plugin-admin-handlers';
