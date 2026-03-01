import AdmZip from 'adm-zip';
import * as fs from 'fs';
import * as path from 'path';
import type { PluginManifest } from '@lensing/types';
import type { ConnectorFetchFn } from './connector-proxy';
import { getBlockReason } from './url-blocklist';
import { installPluginFromZip } from './plugin-install';

export interface MarketplaceInstallResult {
  pluginId: string;
  manifest: PluginManifest;
  replaced: boolean;
}

export interface MarketplaceInstallOptions {
  fetchFn?: ConnectorFetchFn;
  timeoutMs?: number;
  maxSizeBytes?: number;
  replace?: boolean;
}

const DEFAULT_TIMEOUT_MS = 30_000;
const DEFAULT_MAX_SIZE_BYTES = 10 * 1024 * 1024; // 10MB

export async function downloadAndInstallPlugin(
  downloadUrl: string,
  pluginsDir: string,
  options?: MarketplaceInstallOptions
): Promise<MarketplaceInstallResult> {
  const {
    fetchFn = fetch as unknown as ConnectorFetchFn,
    timeoutMs = DEFAULT_TIMEOUT_MS,
    maxSizeBytes = DEFAULT_MAX_SIZE_BYTES,
    replace = false,
  } = options ?? {};

  // SSRF protection — check before any network activity
  const blockReason = getBlockReason(downloadUrl);
  if (blockReason) {
    throw new Error(blockReason);
  }

  // Download with timeout
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeoutMs);

  let response: Awaited<ReturnType<ConnectorFetchFn>>;
  try {
    response = await fetchFn(downloadUrl, {
      method: 'GET',
      signal: controller.signal,
    });
  } catch (err) {
    if (err instanceof DOMException && err.name === 'AbortError') {
      throw new Error(`Download timeout after ${timeoutMs}ms`);
    }
    const message = err instanceof Error ? err.message : String(err);
    throw new Error(`Network error: ${message}`);
  } finally {
    clearTimeout(timeoutId);
  }

  if (!response.ok) {
    throw new Error(`Download failed: HTTP ${response.status} ${response.statusText}`);
  }

  if (!response.arrayBuffer) {
    throw new Error('Fetch response does not support arrayBuffer');
  }

  const arrayBuffer = await response.arrayBuffer();

  // Validate download size
  if (arrayBuffer.byteLength > maxSizeBytes) {
    const maxMB = Math.round(maxSizeBytes / 1024 / 1024);
    throw new Error(
      `Download too large: ${arrayBuffer.byteLength} bytes exceeds ${maxMB}MB limit`
    );
  }

  const zipBuffer = Buffer.from(arrayBuffer);

  // Parse ZIP manifest to get plugin ID for conflict detection
  let pluginId: string | undefined;
  try {
    const zip = new AdmZip(zipBuffer);
    const manifestEntry =
      zip.getEntry('plugin.json') ??
      zip.getEntries().find((e) => {
        const parts = e.entryName.split('/');
        return parts.length === 2 && parts[1] === 'plugin.json';
      });
    if (manifestEntry) {
      const parsed = JSON.parse(manifestEntry.getData().toString('utf-8')) as { id?: string };
      pluginId = parsed.id;
    }
  } catch {
    // installPluginFromZip will throw a clearer error
  }

  // Conflict detection
  let replaced = false;
  if (pluginId) {
    const targetDir = path.join(pluginsDir, pluginId);
    if (fs.existsSync(targetDir)) {
      if (!replace) {
        throw new Error(
          `Plugin '${pluginId}' already installed — use replace option to overwrite`
        );
      }
      fs.rmSync(targetDir, { recursive: true, force: true });
      replaced = true;
    }
  }

  const result = installPluginFromZip(zipBuffer, pluginsDir);

  return {
    pluginId: result.pluginId,
    manifest: result.manifest,
    replaced,
  };
}
