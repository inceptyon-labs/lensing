import type { PluginManifest } from '@lensing/types';

export interface ValidationResult {
  valid: boolean;
  errors: string[];
  manifest?: PluginManifest;
}

export function validateManifest(input: unknown): ValidationResult {
  const errors: string[] = [];

  // Check if input is a non-null object
  if (input === null || typeof input !== 'object') {
    return { valid: false, errors: ['Manifest must be a non-null object'] };
  }

  const obj = input as Record<string, unknown>;

  // Validate required string fields
  const requiredFields = ['id', 'name', 'version'] as const;
  for (const field of requiredFields) {
    if (!(field in obj)) {
      errors.push(`Missing required field: ${field}`);
    } else if (typeof obj[field] !== 'string') {
      errors.push(`Field "${field}" must be a string`);
    } else if ((obj[field] as string).length === 0) {
      errors.push(`Field "${field}" must not be empty`);
    }
  }

  // Validate optional string fields
  const optionalStringFields = ['ui_entry', 'server_entry'] as const;
  for (const field of optionalStringFields) {
    if (field in obj && typeof obj[field] !== 'string') {
      errors.push(`Field "${field}" must be a string`);
    }
  }

  // Validate optional array fields
  if ('dependencies' in obj) {
    if (!Array.isArray(obj.dependencies)) {
      errors.push('Field "dependencies" must be an array of strings');
    }
  }

  if ('widget_sizes' in obj) {
    if (!Array.isArray(obj.widget_sizes)) {
      errors.push('Field "widget_sizes" must be an array');
    }
  }

  // Validate permissions object
  if ('permissions' in obj) {
    if (typeof obj.permissions !== 'object' || obj.permissions === null) {
      errors.push('Field "permissions" must be an object');
    } else {
      const perms = obj.permissions as Record<string, unknown>;

      if ('allowed_domains' in perms && !Array.isArray(perms.allowed_domains)) {
        errors.push('permissions.allowed_domains must be an array of strings');
      }

      if ('max_refresh_ms' in perms) {
        if (typeof perms.max_refresh_ms !== 'number' || perms.max_refresh_ms < 0) {
          errors.push('permissions.max_refresh_ms must be a positive number');
        }
      }
    }
  }

  if (errors.length > 0) {
    return { valid: false, errors };
  }

  return { valid: true, errors: [], manifest: obj as unknown as PluginManifest };
}
