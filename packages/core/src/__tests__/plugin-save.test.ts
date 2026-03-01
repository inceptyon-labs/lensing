import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import * as fs from 'fs';
import * as path from 'path';
import * as os from 'os';
import { savePluginFromBuilder } from '../plugin-save';
import type { BuilderSaveInput } from '../plugin-save';

describe('savePluginFromBuilder', () => {
  let tmpDir: string;

  beforeEach(() => {
    tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), 'lensing-save-'));
  });

  afterEach(() => {
    fs.rmSync(tmpDir, { recursive: true, force: true });
  });

  function validInput(overrides: Partial<BuilderSaveInput> = {}): BuilderSaveInput {
    return {
      id: 'test-plugin',
      name: 'Test Plugin',
      version: '1.0.0',
      description: 'A test plugin',
      category: 'Weather',
      connector: {
        type: 'json_api',
        url: 'https://api.example.com/weather',
        method: 'GET',
        refreshInterval: 300,
      },
      html: '<div class="widget">{{temperature}}</div>',
      css: '.widget { color: white; }',
      ...overrides,
    };
  }

  it('creates plugin directory with plugin.json, template.html, template.css', async () => {
    const result = await savePluginFromBuilder(validInput(), tmpDir);

    expect(result.pluginId).toBe('test-plugin');
    expect(result.manifest.name).toBe('Test Plugin');

    const pluginDir = path.join(tmpDir, 'test-plugin');
    expect(fs.existsSync(pluginDir)).toBe(true);
    expect(fs.existsSync(path.join(pluginDir, 'plugin.json'))).toBe(true);
    expect(fs.existsSync(path.join(pluginDir, 'template.html'))).toBe(true);
    expect(fs.existsSync(path.join(pluginDir, 'template.css'))).toBe(true);
    expect(fs.existsSync(path.join(pluginDir, 'connector.json'))).toBe(true);
  });

  it('returns manifest with correct structure', async () => {
    const result = await savePluginFromBuilder(validInput(), tmpDir);

    expect(result.manifest.id).toBe('test-plugin');
    expect(result.manifest.name).toBe('Test Plugin');
    expect(result.manifest.version).toBe('1.0.0');
    expect(result.manifest.description).toBe('A test plugin');
    expect(result.manifest.permissions!.allowed_domains).toEqual(['api.example.com']);
    expect(result.manifest.permissions!.max_refresh_ms).toBe(300_000);
  });

  it('includes thumbnail when provided', async () => {
    const thumbnail = Buffer.from('fake-png-data');
    const result = await savePluginFromBuilder(validInput({ thumbnail }), tmpDir);

    const pluginDir = path.join(tmpDir, 'test-plugin');
    expect(fs.existsSync(path.join(pluginDir, 'thumbnail.png'))).toBe(true);
    const thumbnailData = fs.readFileSync(path.join(pluginDir, 'thumbnail.png'));
    expect(thumbnailData).toEqual(thumbnail);
  });

  it('omits thumbnail when not provided', async () => {
    const result = await savePluginFromBuilder(validInput(), tmpDir);

    const pluginDir = path.join(tmpDir, 'test-plugin');
    expect(fs.existsSync(path.join(pluginDir, 'thumbnail.png'))).toBe(false);
  });

  it('throws when id is missing', async () => {
    await expect(savePluginFromBuilder(validInput({ id: '' }), tmpDir)).rejects.toThrow(/id/i);
  });

  it('throws when name is missing', async () => {
    await expect(savePluginFromBuilder(validInput({ name: '' }), tmpDir)).rejects.toThrow(/name/i);
  });

  it('throws when version is missing', async () => {
    await expect(savePluginFromBuilder(validInput({ version: '' }), tmpDir)).rejects.toThrow(
      /version/i
    );
  });

  it('throws when plugin directory already exists without overwrite flag', async () => {
    // Create the plugin directory first
    const pluginDir = path.join(tmpDir, 'test-plugin');
    fs.mkdirSync(pluginDir, { recursive: true });
    fs.writeFileSync(path.join(pluginDir, 'existing-file.txt'), 'existing');

    await expect(savePluginFromBuilder(validInput(), tmpDir)).rejects.toThrow(
      /already.*exist|conflict/i
    );
  });

  it('overwrites existing plugin when overwrite flag is true', async () => {
    // Create the plugin directory first
    const pluginDir = path.join(tmpDir, 'test-plugin');
    fs.mkdirSync(pluginDir, { recursive: true });
    fs.writeFileSync(path.join(pluginDir, 'old-file.txt'), 'old');

    const result = await savePluginFromBuilder(validInput(), tmpDir, { overwrite: true });

    expect(result.pluginId).toBe('test-plugin');
    expect(fs.existsSync(path.join(pluginDir, 'old-file.txt'))).toBe(false);
    expect(fs.existsSync(path.join(pluginDir, 'plugin.json'))).toBe(true);
  });

  it('writes correct HTML content to template.html', async () => {
    const html = '<div>Hello {{name}}</div>';
    const result = await savePluginFromBuilder(validInput({ html }), tmpDir);

    const pluginDir = path.join(tmpDir, 'test-plugin');
    const content = fs.readFileSync(path.join(pluginDir, 'template.html'), 'utf-8');
    expect(content).toBe(html);
  });

  it('writes correct CSS content to template.css', async () => {
    const css = '.widget { background: black; }';
    const result = await savePluginFromBuilder(validInput({ css }), tmpDir);

    const pluginDir = path.join(tmpDir, 'test-plugin');
    const content = fs.readFileSync(path.join(pluginDir, 'template.css'), 'utf-8');
    expect(content).toBe(css);
  });

  it('writes correct connector config to connector.json', async () => {
    const connector = {
      type: 'rss_feed' as const,
      url: 'https://feeds.example.com/rss',
      refreshInterval: 600,
    };
    const result = await savePluginFromBuilder(validInput({ connector }), tmpDir);

    const pluginDir = path.join(tmpDir, 'test-plugin');
    const content = JSON.parse(fs.readFileSync(path.join(pluginDir, 'connector.json'), 'utf-8'));
    expect(content.type).toBe('rss_feed');
    expect(content.url).toBe('https://feeds.example.com/rss');
    expect(content.refreshInterval).toBe(600);
  });
});
