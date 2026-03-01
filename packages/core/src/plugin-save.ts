import * as fs from 'fs';
import * as path from 'path';
import type { PluginManifest } from '@lensing/types';
import { packagePlugin, type PackageInput } from './plugin-package';
import { installPluginFromZip } from './plugin-install';

export interface BuilderSaveInput extends PackageInput {}

export interface SaveOptions {
  overwrite?: boolean;
}

export interface SaveResult {
  pluginId: string;
  manifest: PluginManifest;
}

export async function savePluginFromBuilder(
  input: BuilderSaveInput,
  pluginsDir: string,
  options?: SaveOptions
): Promise<SaveResult> {
  const { overwrite = false } = options ?? {};

  // Package the plugin (validates and creates ZIP)
  const { buffer, manifest } = packagePlugin(input);

  const targetDir = path.join(pluginsDir, manifest.id);

  // Conflict detection
  if (fs.existsSync(targetDir)) {
    if (!overwrite) {
      throw new Error(`Plugin '${manifest.id}' already exists at ${targetDir}`);
    }
    fs.rmSync(targetDir, { recursive: true, force: true });
  }

  // Extract ZIP to plugins directory
  const result = installPluginFromZip(buffer, pluginsDir);

  return { pluginId: result.pluginId, manifest: result.manifest };
}
