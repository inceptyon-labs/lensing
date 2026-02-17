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

/** Placeholder: Host service exports (plugin loader, data bus) */
