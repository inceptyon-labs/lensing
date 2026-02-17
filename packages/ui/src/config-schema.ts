import type { ConfigField, PluginConfigSchema } from '@lensing/types';

/**
 * Validates a config value against a field schema.
 * Returns true if the value matches the field type and constraints.
 */
export function validateConfigValue(value: string | number | boolean, field: ConfigField): boolean {
  switch (field.type) {
    case 'string':
      return typeof value === 'string';

    case 'boolean':
      return typeof value === 'boolean';

    case 'number': {
      if (typeof value !== 'number') return false;
      if (field.min !== undefined && value < field.min) return false;
      if (field.max !== undefined && value > field.max) return false;
      return true;
    }

    case 'select': {
      if (!field.options) return false;
      return field.options.some((opt) => opt.value === value);
    }

    default:
      return false;
  }
}

/**
 * Builds a default config object from a plugin's config schema.
 * Only includes fields that have default values specified.
 */
export function buildDefaultConfig(
  schema: PluginConfigSchema
): Record<string, string | number | boolean> {
  const config: Record<string, string | number | boolean> = {};

  for (const field of schema.fields) {
    if (field.default !== undefined) {
      config[field.key] = field.default;
    }
  }

  return config;
}
