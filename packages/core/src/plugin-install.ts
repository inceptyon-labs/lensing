import AdmZip from 'adm-zip';
import * as fs from 'fs';
import * as path from 'path';
import type { PluginManifest } from '@lensing/types';

export interface InstallResult {
  pluginId: string;
  manifest: PluginManifest;
}

/**
 * Install a plugin from a zip buffer into the plugins directory.
 *
 * Validates the zip contains a valid plugin.json, then extracts
 * all files to `pluginsDir/<pluginId>/`.
 */
export function installPluginFromZip(zipBuffer: Buffer, pluginsDir: string): InstallResult {
  let zip: AdmZip;
  try {
    zip = new AdmZip(zipBuffer);
  } catch {
    throw new Error('Invalid zip file');
  }

  const entries = zip.getEntries();
  if (entries.length === 0) {
    throw new Error('Zip is empty — no plugin.json found');
  }

  // Find plugin.json — could be at root or inside a single wrapper folder
  let manifestEntry = entries.find((e) => e.entryName === 'plugin.json');
  let prefix = '';

  if (!manifestEntry) {
    // Check for wrapper folder pattern: <folder>/plugin.json
    manifestEntry = entries.find((e) => {
      const parts = e.entryName.split('/');
      return parts.length === 2 && parts[1] === 'plugin.json';
    });
    if (manifestEntry) {
      prefix = manifestEntry.entryName.split('/')[0] + '/';
    }
  }

  if (!manifestEntry) {
    throw new Error('Zip does not contain plugin.json');
  }

  // Parse and validate manifest
  let manifest: PluginManifest;
  const raw = manifestEntry.getData().toString('utf-8');
  try {
    manifest = JSON.parse(raw) as PluginManifest;
  } catch {
    throw new Error('plugin.json contains invalid JSON');
  }

  if (!manifest.id || typeof manifest.id !== 'string') {
    throw new Error('plugin.json missing required field: id');
  }
  if (!manifest.name || typeof manifest.name !== 'string') {
    throw new Error('plugin.json missing required field: name');
  }
  if (!manifest.version || typeof manifest.version !== 'string') {
    throw new Error('plugin.json missing required field: version');
  }

  const pluginId = manifest.id;
  const targetDir = path.join(pluginsDir, pluginId);

  // Check for duplicate
  if (fs.existsSync(targetDir)) {
    throw new Error(`Plugin '${pluginId}' already exists at ${targetDir}`);
  }

  // Extract files
  fs.mkdirSync(targetDir, { recursive: true });

  for (const entry of entries) {
    if (entry.isDirectory) continue;

    // Strip the wrapper prefix if present
    let relativePath = entry.entryName;
    if (prefix && relativePath.startsWith(prefix)) {
      relativePath = relativePath.slice(prefix.length);
    }

    const destPath = path.join(targetDir, relativePath);
    const destDir = path.dirname(destPath);

    fs.mkdirSync(destDir, { recursive: true });
    fs.writeFileSync(destPath, entry.getData());
  }

  return { pluginId, manifest };
}
