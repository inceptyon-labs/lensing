import type { DatabaseInstance, ModuleSettingsSchema } from '@lensing/types';

/** Stored config for a module: enabled flag + typed field values */
export interface ModuleConfig {
  enabled: boolean;
  values: Record<string, string | number | boolean>;
}

/** Read a module's config from flat DB settings keys (e.g. "weather.apiKey") */
export function readModuleConfig(db: DatabaseInstance, schema: ModuleSettingsSchema): ModuleConfig {
  const prefix = schema.id;
  const enabledRaw = db.getSetting(`${prefix}.enabled`);
  const enabled = enabledRaw === 'true';

  const values: Record<string, string | number | boolean> = {};
  for (const field of schema.fields) {
    const raw = db.getSetting(`${prefix}.${field.key}`);
    if (raw !== undefined) {
      values[field.key] = coerceValue(raw, field.type);
    } else if (field.default !== undefined) {
      values[field.key] = field.default;
    }
  }

  return { enabled, values };
}

/** Write a module's config as flat DB settings keys */
export function writeModuleConfig(
  db: DatabaseInstance,
  moduleId: string,
  config: ModuleConfig
): void {
  db.setSetting(`${moduleId}.enabled`, String(config.enabled));
  for (const [key, value] of Object.entries(config.values)) {
    db.setSetting(`${moduleId}.${key}`, String(value));
  }
}

/** Coerce a string DB value to the correct type for a field */
function coerceValue(raw: string, type: string): string | number | boolean {
  if (type === 'number') {
    const n = parseFloat(raw);
    return Number.isFinite(n) ? n : 0;
  }
  if (type === 'boolean') {
    return raw === 'true';
  }
  return raw;
}
