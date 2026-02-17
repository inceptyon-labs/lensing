import type { ConfigField, PluginConfigSchema } from '@lensing/types';

/**
 * Validates a config value against a field schema.
 * Returns true if the value matches the field type and constraints.
 */
export function validateConfigValue(value: string | number | boolean, field: ConfigField): boolean {
  // Type validation
  if (field.type === 'string' && typeof value !== 'string') {
    return false;
  }
  if (field.type === 'number' && typeof value !== 'number') {
    return false;
  }
  if (field.type === 'boolean' && typeof value !== 'boolean') {
    return false;
  }

  // Select field validation
  if (field.type === 'select') {
    if (!field.options) return false;
    const validValues = field.options.map((opt) => opt.value);
    return validValues.includes(value);
  }

  // Number constraints
  if (field.type === 'number' && typeof value === 'number') {
    if (field.min !== undefined && value < field.min) {
      return false;
    }
    if (field.max !== undefined && value > field.max) {
      return false;
    }
  }

  return true;
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
