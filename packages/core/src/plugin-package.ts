import AdmZip from 'adm-zip';
import type { PluginManifest } from '@lensing/types';

const MAX_ZIP_BYTES = 10 * 1024 * 1024; // 10MB

export interface ConnectorInput {
  type: string;
  url: string;
  method?: string;
  headers?: Record<string, string>;
  refreshInterval?: number;
}

export interface PackageInput {
  id: string;
  name: string;
  version: string;
  description?: string;
  category?: string;
  connector: ConnectorInput;
  html: string;
  css: string;
  thumbnail?: Buffer;
}

export interface PackageResult {
  buffer: Buffer;
  manifest: PluginManifest;
  sizeBytes: number;
}

function extractHostname(url: string): string {
  try {
    return new URL(url).hostname;
  } catch {
    return url;
  }
}

export function packagePlugin(input: PackageInput): PackageResult {
  if (!input.id) throw new Error('id is required');
  if (!input.name) throw new Error('name is required');
  if (!input.version) throw new Error('version is required');

  const permissions: PluginManifest['permissions'] = {
    allowed_domains: [extractHostname(input.connector.url)],
  };

  if (input.connector.refreshInterval !== undefined) {
    permissions.max_refresh_ms = input.connector.refreshInterval * 1000;
  }

  const manifest: PluginManifest = {
    id: input.id,
    name: input.name,
    version: input.version,
    ...(input.description !== undefined && { description: input.description }),
    permissions,
  };

  const manifestBuf = Buffer.from(JSON.stringify(manifest, null, 2), 'utf-8');
  const htmlBuf = Buffer.from(input.html, 'utf-8');
  const cssBuf = Buffer.from(input.css, 'utf-8');
  const connectorBuf = Buffer.from(JSON.stringify(input.connector, null, 2), 'utf-8');
  const thumbnailBuf = input.thumbnail;

  const totalBytes =
    manifestBuf.length +
    htmlBuf.length +
    cssBuf.length +
    connectorBuf.length +
    (thumbnailBuf ? thumbnailBuf.length : 0);

  if (totalBytes > MAX_ZIP_BYTES) {
    throw new Error(`Content size ${totalBytes} bytes exceeds 10MB limit`);
  }

  const zip = new AdmZip();
  zip.addFile('plugin.json', manifestBuf);
  zip.addFile('template.html', htmlBuf);
  zip.addFile('template.css', cssBuf);
  zip.addFile('connector.json', connectorBuf);

  if (thumbnailBuf) {
    zip.addFile('thumbnail.png', thumbnailBuf);
  }

  const buffer = zip.toBuffer();

  return { buffer, manifest, sizeBytes: buffer.length };
}
