import type { ConfigField, PluginConfigSchema } from '@lensing/types';
/**
 * Validates a config value against a field schema.
 * Returns true if the value matches the field type and constraints.
 */
export declare function validateConfigValue(value: string | number | boolean, field: ConfigField): boolean;
/**
 * Builds a default config object from a plugin's config schema.
 * Only includes fields that have default values specified.
 */
export declare function buildDefaultConfig(schema: PluginConfigSchema): Record<string, string | number | boolean>;
//# sourceMappingURL=config-schema.d.ts.map