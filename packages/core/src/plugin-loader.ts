import type { PluginManifest, LoadedPlugin, DiscoveredPlugin, PluginLoader } from '@lensing/types';
import * as fs from 'fs';
import * as path from 'path';
import { pathToFileURL } from 'url';

export interface PluginLoaderOptions {
  pluginsDir: string;
}

interface ValidationResult {
  valid: boolean;
  errors: string[];
  manifest?: PluginManifest;
}

function validateManifestData(input: Record<string, unknown>): ValidationResult {
  const errors: string[] = [];

  const requiredFields = ['id', 'name', 'version'] as const;
  for (const field of requiredFields) {
    if (!(field in input)) {
      errors.push(`Missing required field: ${field}`);
    } else if (typeof input[field] !== 'string') {
      errors.push(`Field "${field}" must be a string`);
    } else if ((input[field] as string).length === 0) {
      errors.push(`Field "${field}" must not be empty`);
    }
  }

  const optionalStringFields = ['ui_entry', 'server_entry'] as const;
  for (const field of optionalStringFields) {
    if (field in input && typeof input[field] !== 'string') {
      errors.push(`Field "${field}" must be a string`);
    }
  }

  if ('dependencies' in input) {
    if (!Array.isArray(input.dependencies)) {
      errors.push('Field "dependencies" must be an array of strings');
    } else if (!input.dependencies.every((dep) => typeof dep === 'string')) {
      errors.push('Field "dependencies" must be an array of strings');
    }
  }

  if ('widget_sizes' in input) {
    if (!Array.isArray(input.widget_sizes)) {
      errors.push('Field "widget_sizes" must be an array');
    } else if (!input.widget_sizes.every((size) => typeof size === 'string')) {
      errors.push('Field "widget_sizes" must be an array of strings');
    }
  }

  if ('permissions' in input) {
    if (typeof input.permissions !== 'object' || input.permissions === null) {
      errors.push('Field "permissions" must be an object');
    } else {
      const perms = input.permissions as Record<string, unknown>;

      if ('allowed_domains' in perms) {
        if (!Array.isArray(perms.allowed_domains)) {
          errors.push('permissions.allowed_domains must be an array of strings');
        } else if (!perms.allowed_domains.every((d) => typeof d === 'string')) {
          errors.push('permissions.allowed_domains must be an array of strings');
        }
      }

      if ('max_refresh_ms' in perms) {
        if (
          typeof perms.max_refresh_ms !== 'number' ||
          !Number.isFinite(perms.max_refresh_ms) ||
          perms.max_refresh_ms < 0
        ) {
          errors.push('permissions.max_refresh_ms must be a positive number');
        }
      }

      if ('max_request_burst' in perms) {
        if (
          typeof perms.max_request_burst !== 'number' ||
          !Number.isFinite(perms.max_request_burst) ||
          perms.max_request_burst < 0
        ) {
          errors.push('permissions.max_request_burst must be a positive number');
        }
      }

      if ('secrets' in perms) {
        if (!Array.isArray(perms.secrets)) {
          errors.push('permissions.secrets must be an array of strings');
        } else if (!perms.secrets.every((s) => typeof s === 'string')) {
          errors.push('permissions.secrets must be an array of strings');
        }
      }
    }
  }

  if (errors.length > 0) {
    return { valid: false, errors };
  }

  return { valid: true, errors: [], manifest: input as unknown as PluginManifest };
}

interface ScannedEntry {
  id: string;
  manifest: PluginManifest;
  pluginDir: string;
}

function scanDirectory(pluginsDir: string, errors: Map<string, string>): ScannedEntry[] {
  const valid: ScannedEntry[] = [];

  if (!fs.existsSync(pluginsDir)) return valid;

  const entries = fs.readdirSync(pluginsDir, { withFileTypes: true });

  for (const entry of entries) {
    if (!entry.isDirectory()) continue;

    const manifestPath = path.join(pluginsDir, entry.name, 'plugin.json');
    if (!fs.existsSync(manifestPath)) continue;

    try {
      const content = fs.readFileSync(manifestPath, 'utf-8');
      const parsed = JSON.parse(content) as Record<string, unknown>;
      const idKey = typeof parsed.id === 'string' ? parsed.id : entry.name;
      const result = validateManifestData(parsed);

      if (result.valid && result.manifest) {
        valid.push({
          id: result.manifest.id,
          manifest: result.manifest,
          pluginDir: path.join(pluginsDir, entry.name),
        });
      } else {
        errors.set(idKey, result.errors.join(', '));
      }
    } catch (err) {
      errors.set(entry.name, `Failed to parse plugin.json: ${String(err)}`);
    }
  }

  return valid;
}

export function createPluginLoader(options: PluginLoaderOptions): PluginLoader {
  const { pluginsDir } = options;
  const registry = new Map<string, LoadedPlugin>();
  const errors = new Map<string, string>();
  let loaded = false;

  async function load(): Promise<LoadedPlugin[]> {
    registry.clear();
    errors.clear();
    loaded = true;

    const scanned = scanDirectory(pluginsDir, errors);

    for (const { id, manifest, pluginDir } of scanned) {
      const loadedPlugin: LoadedPlugin = {
        manifest,
        status: 'loading',
      };

      try {
        if (manifest.ui_entry) {
          const uiPath = path.resolve(pluginDir, manifest.ui_entry);
          loadedPlugin.ui_module = (await import(pathToFileURL(uiPath).href)) as Record<
            string,
            unknown
          >;
        }

        if (manifest.server_entry) {
          const serverPath = path.resolve(pluginDir, manifest.server_entry);
          loadedPlugin.server_module = (await import(pathToFileURL(serverPath).href)) as Record<
            string,
            unknown
          >;
        }

        loadedPlugin.status = 'loaded';
        registry.set(id, loadedPlugin);
      } catch (err) {
        loadedPlugin.status = 'error';
        loadedPlugin.error = `Failed to load module: ${String(err)}`;
        errors.set(id, loadedPlugin.error);
      }
    }

    return Array.from(registry.values());
  }

  async function ensureLoaded(): Promise<void> {
    if (!loaded) {
      await load();
    }
  }

  return {
    async discover(): Promise<DiscoveredPlugin[]> {
      const localErrors = new Map<string, string>();
      const scanned = scanDirectory(pluginsDir, localErrors);

      return scanned.map(({ id, manifest, pluginDir }) => ({
        id,
        manifest,
        manifestPath: path.join(pluginDir, 'plugin.json'),
      }));
    },

    load,

    async reload(): Promise<LoadedPlugin[]> {
      loaded = false;
      return load();
    },

    getPlugin(id: string): LoadedPlugin | undefined {
      return registry.get(id);
    },

    getAllPlugins(): LoadedPlugin[] {
      return Array.from(registry.values());
    },

    async unload(id: string): Promise<void> {
      registry.delete(id);
      errors.delete(id);
    },

    async getErrors(): Promise<Map<string, string>> {
      await ensureLoaded();
      return errors;
    },
  };
}
