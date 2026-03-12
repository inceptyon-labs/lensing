import type { DatabaseInstance, ModuleSettingsSchema } from '@lensing/types';
/** Stored config for a module: enabled flag + typed field values */
export interface ModuleConfig {
    enabled: boolean;
    values: Record<string, string | number | boolean>;
}
/** Read a module's config from flat DB settings keys (e.g. "weather.apiKey") */
export declare function readModuleConfig(db: DatabaseInstance, schema: ModuleSettingsSchema): ModuleConfig;
/** Write a module's config as flat DB settings keys */
export declare function writeModuleConfig(db: DatabaseInstance, moduleId: string, config: ModuleConfig): void;
//# sourceMappingURL=module-settings.d.ts.map