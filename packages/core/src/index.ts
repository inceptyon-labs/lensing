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

/** Placeholder: Host service exports (plugin loader, scheduler, cache, data bus) */
