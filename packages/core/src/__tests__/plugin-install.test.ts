import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import * as fs from 'fs';
import * as path from 'path';
import * as os from 'os';
import AdmZip from 'adm-zip';
import { installPluginFromZip } from '../plugin-install';

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

describe('installPluginFromZip', () => {
  let tmpDir: string;

  beforeEach(() => {
    tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), 'lensing-test-'));
  });

  afterEach(() => {
    fs.rmSync(tmpDir, { recursive: true, force: true });
  });

  it('should extract a valid plugin zip to plugins dir', () => {
    const zip = makeZip({ 'plugin.json': VALID_MANIFEST });
    const result = installPluginFromZip(zip, tmpDir);
    expect(result.pluginId).toBe('test-plugin');
    expect(result.manifest.name).toBe('Test Plugin');
    expect(fs.existsSync(path.join(tmpDir, 'test-plugin', 'plugin.json'))).toBe(true);
  });

  it('should reject zip without plugin.json', () => {
    const zip = makeZip({ 'README.md': '# Hello' });
    expect(() => installPluginFromZip(zip, tmpDir)).toThrow(/plugin\.json/);
  });

  it('should reject zip with invalid manifest (missing id)', () => {
    const zip = makeZip({
      'plugin.json': JSON.stringify({ name: 'Bad', version: '1.0.0' }),
    });
    expect(() => installPluginFromZip(zip, tmpDir)).toThrow(/id/i);
  });

  it('should reject zip with invalid JSON in plugin.json', () => {
    const zip = makeZip({ 'plugin.json': '{not json!' });
    expect(() => installPluginFromZip(zip, tmpDir)).toThrow(/JSON/i);
  });

  it('should reject if plugin id already exists in plugins dir', () => {
    fs.mkdirSync(path.join(tmpDir, 'test-plugin'));
    const zip = makeZip({ 'plugin.json': VALID_MANIFEST });
    expect(() => installPluginFromZip(zip, tmpDir)).toThrow(/already exists/i);
  });

  it('should handle nested directory structure in zip', () => {
    const zip = makeZip({
      'plugin.json': VALID_MANIFEST,
      'src/index.ts': 'export default {}',
      'assets/icon.png': 'fake-png',
    });
    const result = installPluginFromZip(zip, tmpDir);
    expect(fs.existsSync(path.join(tmpDir, result.pluginId, 'src', 'index.ts'))).toBe(true);
    expect(fs.existsSync(path.join(tmpDir, result.pluginId, 'assets', 'icon.png'))).toBe(true);
  });

  it('should handle zip with files inside a root folder', () => {
    // Some zips wrap everything in a top-level folder
    const zip = makeZip({
      'my-plugin/plugin.json': VALID_MANIFEST,
      'my-plugin/server.ts': 'export default {}',
    });
    const result = installPluginFromZip(zip, tmpDir);
    expect(result.pluginId).toBe('test-plugin');
    expect(fs.existsSync(path.join(tmpDir, 'test-plugin', 'plugin.json'))).toBe(true);
    expect(fs.existsSync(path.join(tmpDir, 'test-plugin', 'server.ts'))).toBe(true);
  });

  it('should reject empty zip', () => {
    const zip = new AdmZip();
    expect(() => installPluginFromZip(zip.toBuffer(), tmpDir)).toThrow(/plugin\.json/);
  });

  it('should reject non-zip data', () => {
    expect(() => installPluginFromZip(Buffer.from('not a zip'), tmpDir)).toThrow();
  });
});
