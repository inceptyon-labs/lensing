import type { DatabaseInstance, ModuleSettingsSchema } from '@lensing/types';
/** Stored config for a module: enabled flag + typed field values */
export interface ModuleConfig {
    enabled: boolean;
    values: Record<string, string | number | boolean>;
}
/** Read a module's config from flat DB settings keys (e.g. "weather.apiKey") */
export declare function readModuleConfig(db: DatabaseInstance, schema: ModuleSettingsSchema): ModuleConfig;
/**
 * Call before saving flat settings (keys like "home-assistant.url"). If a URL changes and
 * no new secret is supplied, the stored secret is deleted so it can't be sent to the new host.
 */
export declare function clearSecretsForChangedUrls(db: DatabaseInstance, incoming: Record<string, unknown>): void;
/** Write a module's config as flat DB settings keys */
export declare function writeModuleConfig(db: DatabaseInstance, moduleId: string, config: ModuleConfig): void;
//# sourceMappingURL=module-settings.d.ts.map