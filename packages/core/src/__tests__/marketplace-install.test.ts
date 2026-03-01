import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import * as fs from 'fs';
import * as path from 'path';
import * as os from 'os';
import AdmZip from 'adm-zip';
import { downloadAndInstallPlugin } from '../marketplace-install';
import type { ConnectorFetchFn } from '../connector-proxy';

function makeZip(files: Record<string, string>): Buffer {
  const zip = new AdmZip();
  for (const [name, content] of Object.entries(files)) {
    zip.addFile(name, Buffer.from(content, 'utf-8'));
  }
  return zip.toBuffer();
}

const VALID_MANIFEST = JSON.stringify({
  id: 'test-plugin',
  name: 'Test Plugin',
  version: '1.0.0',
});

describe('downloadAndInstallPlugin', () => {
  let tmpDir: string;
  let mockFetch: ReturnType<typeof vi.fn>;

  beforeEach(() => {
    tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), 'lensing-mkt-'));
    mockFetch = vi.fn();
  });

  afterEach(() => {
    fs.rmSync(tmpDir, { recursive: true, force: true });
  });

  function mockZipResponse(zipBuffer: Buffer) {
    mockFetch.mockResolvedValueOnce({
      ok: true,
      status: 200,
      statusText: 'OK',
      arrayBuffer: async () => zipBuffer.buffer.slice(
        zipBuffer.byteOffset,
        zipBuffer.byteOffset + zipBuffer.byteLength
      ),
    });
  }

  describe('successful install', () => {
    it('should download ZIP and install plugin', async () => {
      const zipBuffer = makeZip({ 'plugin.json': VALID_MANIFEST });
      mockZipResponse(zipBuffer);

      const result = await downloadAndInstallPlugin(
        'https://example.com/plugins/test-plugin-1.0.0.zip',
        tmpDir,
        { fetchFn: mockFetch }
      );

      expect(result.pluginId).toBe('test-plugin');
      expect(result.manifest.name).toBe('Test Plugin');
      expect(result.replaced).toBe(false);
      expect(fs.existsSync(path.join(tmpDir, 'test-plugin', 'plugin.json'))).toBe(true);
    });

    it('should call fetch with correct URL', async () => {
      const zipBuffer = makeZip({ 'plugin.json': VALID_MANIFEST });
      mockZipResponse(zipBuffer);

      await downloadAndInstallPlugin(
        'https://cdn.example.com/my-plugin.zip',
        tmpDir,
        { fetchFn: mockFetch }
      );

      expect(mockFetch).toHaveBeenCalledWith(
        'https://cdn.example.com/my-plugin.zip',
        expect.objectContaining({
          method: 'GET',
          signal: expect.any(AbortSignal),
        })
      );
    });
  });

  describe('size validation', () => {
    it('should reject downloads exceeding max size (default 10MB)', async () => {
      // Create a buffer larger than 10MB
      const largeBuffer = Buffer.alloc(11 * 1024 * 1024); // 11MB

      mockFetch.mockResolvedValueOnce({
        ok: true,
        status: 200,
        statusText: 'OK',
        arrayBuffer: async () => largeBuffer.buffer.slice(
          largeBuffer.byteOffset,
          largeBuffer.byteOffset + largeBuffer.byteLength
        ),
      });

      await expect(
        downloadAndInstallPlugin('https://example.com/large.zip', tmpDir, { fetchFn: mockFetch })
      ).rejects.toThrow(/size|10.*MB|too large/i);
    });

    it('should allow custom max size', async () => {
      // Create a 2MB buffer
      const mediumBuffer = Buffer.alloc(2 * 1024 * 1024);

      mockFetch.mockResolvedValueOnce({
        ok: true,
        status: 200,
        statusText: 'OK',
        arrayBuffer: async () => mediumBuffer.buffer.slice(
          mediumBuffer.byteOffset,
          mediumBuffer.byteOffset + mediumBuffer.byteLength
        ),
      });

      await expect(
        downloadAndInstallPlugin('https://example.com/medium.zip', tmpDir, {
          fetchFn: mockFetch,
          maxSizeBytes: 1 * 1024 * 1024, // 1MB limit
        })
      ).rejects.toThrow(/size|too large/i);
    });
  });

  describe('download error handling', () => {
    it('should handle HTTP error responses', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 404,
        statusText: 'Not Found',
      });

      await expect(
        downloadAndInstallPlugin('https://example.com/missing.zip', tmpDir, {
          fetchFn: mockFetch,
        })
      ).rejects.toThrow(/404|Not Found|download/i);
    });

    it('should handle network errors', async () => {
      mockFetch.mockRejectedValueOnce(new Error('Connection refused'));

      await expect(
        downloadAndInstallPlugin('https://example.com/plugin.zip', tmpDir, {
          fetchFn: mockFetch,
        })
      ).rejects.toThrow(/network|connection/i);
    });

    it('should handle timeout', async () => {
      mockFetch.mockImplementationOnce(
        () =>
          new Promise((_, reject) => {
            setTimeout(() => reject(new DOMException('AbortError', 'AbortError')), 100);
          })
      );

      await expect(
        downloadAndInstallPlugin('https://example.com/slow.zip', tmpDir, {
          fetchFn: mockFetch,
          timeoutMs: 50,
        })
      ).rejects.toThrow(/timeout|abort/i);
    });
  });

  describe('conflict detection', () => {
    it('should detect already installed plugin and throw', async () => {
      // Pre-install the plugin
      const pluginDir = path.join(tmpDir, 'test-plugin');
      fs.mkdirSync(pluginDir, { recursive: true });
      fs.writeFileSync(path.join(pluginDir, 'plugin.json'), VALID_MANIFEST);

      const zipBuffer = makeZip({ 'plugin.json': VALID_MANIFEST });
      mockZipResponse(zipBuffer);

      await expect(
        downloadAndInstallPlugin('https://example.com/plugin.zip', tmpDir, {
          fetchFn: mockFetch,
        })
      ).rejects.toThrow(/already.*install|exists|conflict/i);
    });

    it('should replace existing plugin when replace option is true', async () => {
      // Pre-install the plugin
      const pluginDir = path.join(tmpDir, 'test-plugin');
      fs.mkdirSync(pluginDir, { recursive: true });
      fs.writeFileSync(path.join(pluginDir, 'plugin.json'), VALID_MANIFEST);
      fs.writeFileSync(path.join(pluginDir, 'old-file.txt'), 'old content');

      const newManifest = JSON.stringify({
        id: 'test-plugin',
        name: 'Test Plugin Updated',
        version: '2.0.0',
      });
      const zipBuffer = makeZip({ 'plugin.json': newManifest });
      mockZipResponse(zipBuffer);

      const result = await downloadAndInstallPlugin('https://example.com/plugin.zip', tmpDir, {
        fetchFn: mockFetch,
        replace: true,
      });

      expect(result.pluginId).toBe('test-plugin');
      expect(result.manifest.version).toBe('2.0.0');
      expect(result.replaced).toBe(true);
      // Old file should be gone
      expect(fs.existsSync(path.join(pluginDir, 'old-file.txt'))).toBe(false);
    });
  });

  describe('SSRF protection', () => {
    it('should reject localhost download URLs', async () => {
      await expect(
        downloadAndInstallPlugin('http://localhost:8080/plugin.zip', tmpDir, {
          fetchFn: mockFetch,
        })
      ).rejects.toThrow(/blocked|localhost/i);
      expect(mockFetch).not.toHaveBeenCalled();
    });

    it('should reject private IP download URLs', async () => {
      await expect(
        downloadAndInstallPlugin('http://192.168.1.1/plugin.zip', tmpDir, {
          fetchFn: mockFetch,
        })
      ).rejects.toThrow(/blocked|private/i);
      expect(mockFetch).not.toHaveBeenCalled();
    });
  });
});
