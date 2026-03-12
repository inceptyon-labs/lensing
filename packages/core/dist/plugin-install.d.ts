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
export declare function installPluginFromZip(zipBuffer: Buffer, pluginsDir: string): InstallResult;
//# sourceMappingURL=plugin-install.d.ts.map