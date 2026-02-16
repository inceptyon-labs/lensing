export type { PluginManifest, PluginInstance, PluginStatus } from '@lensing/types';
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

/** Placeholder: Host service exports (plugin loader, scheduler, cache, data bus) */
