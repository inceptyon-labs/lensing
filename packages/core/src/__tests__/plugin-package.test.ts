import { describe, it, expect } from 'vitest';
import AdmZip from 'adm-zip';
import { packagePlugin, type PackageInput } from '../plugin-package';

/** Minimal valid input for packaging */
function validInput(overrides: Partial<PackageInput> = {}): PackageInput {
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

/** Extract entries from a ZIP buffer */
function readZip(buf: Buffer): AdmZip {
  return new AdmZip(buf);
}

describe('packagePlugin', () => {
  it('creates a ZIP buffer with all required files', () => {
    const result = packagePlugin(validInput());
    const zip = readZip(result.buffer);
    const names = zip.getEntries().map((e) => e.entryName);

    expect(names).toContain('plugin.json');
    expect(names).toContain('template.html');
    expect(names).toContain('template.css');
    expect(names).toContain('connector.json');
  });

  it('ZIP is flat — no wrapper folder', () => {
    const result = packagePlugin(validInput());
    const zip = readZip(result.buffer);
    for (const entry of zip.getEntries()) {
      expect(entry.entryName).not.toContain('/');
    }
  });

  it('generates correct plugin.json manifest fields', () => {
    const result = packagePlugin(validInput());
    const zip = readZip(result.buffer);
    const manifest = JSON.parse(zip.getEntry('plugin.json')!.getData().toString('utf-8'));

    expect(manifest.id).toBe('test-plugin');
    expect(manifest.name).toBe('Test Plugin');
    expect(manifest.version).toBe('1.0.0');
    expect(manifest.description).toBe('A test plugin');
  });

  it('derives allowed_domains from connector URL', () => {
    const result = packagePlugin(validInput());
    const zip = readZip(result.buffer);
    const manifest = JSON.parse(zip.getEntry('plugin.json')!.getData().toString('utf-8'));

    expect(manifest.permissions.allowed_domains).toEqual(['api.example.com']);
  });

  it('derives max_refresh_ms from connector refreshInterval', () => {
    const result = packagePlugin(
      validInput({
        connector: { type: 'json_api', url: 'https://api.example.com', refreshInterval: 60 },
      })
    );
    const zip = readZip(result.buffer);
    const manifest = JSON.parse(zip.getEntry('plugin.json')!.getData().toString('utf-8'));

    expect(manifest.permissions.max_refresh_ms).toBe(60_000);
  });

  it('template.html contains the input HTML', () => {
    const html = '<div>Hello {{name}}</div>';
    const result = packagePlugin(validInput({ html }));
    const zip = readZip(result.buffer);
    const content = zip.getEntry('template.html')!.getData().toString('utf-8');

    expect(content).toBe(html);
  });

  it('template.css contains the input CSS', () => {
    const css = '.widget { background: black; }';
    const result = packagePlugin(validInput({ css }));
    const zip = readZip(result.buffer);
    const content = zip.getEntry('template.css')!.getData().toString('utf-8');

    expect(content).toBe(css);
  });

  it('connector.json matches input connector config', () => {
    const connector = {
      type: 'rss_feed' as const,
      url: 'https://feeds.example.com/rss',
      refreshInterval: 600,
    };
    const result = packagePlugin(validInput({ connector }));
    const zip = readZip(result.buffer);
    const stored = JSON.parse(zip.getEntry('connector.json')!.getData().toString('utf-8'));

    expect(stored.type).toBe('rss_feed');
    expect(stored.url).toBe('https://feeds.example.com/rss');
    expect(stored.refreshInterval).toBe(600);
  });

  it('includes thumbnail.png when provided', () => {
    const thumbnail = Buffer.from('fake-png-data');
    const result = packagePlugin(validInput({ thumbnail }));
    const zip = readZip(result.buffer);
    const entry = zip.getEntry('thumbnail.png');

    expect(entry).toBeDefined();
    expect(entry!.getData()).toEqual(thumbnail);
  });

  it('omits thumbnail.png when not provided', () => {
    const result = packagePlugin(validInput());
    const zip = readZip(result.buffer);

    expect(zip.getEntry('thumbnail.png')).toBeFalsy();
  });

  it('returns sizeBytes matching buffer length', () => {
    const result = packagePlugin(validInput());
    expect(result.sizeBytes).toBe(result.buffer.length);
  });

  it('returns the generated manifest', () => {
    const result = packagePlugin(validInput());
    expect(result.manifest.id).toBe('test-plugin');
    expect(result.manifest.name).toBe('Test Plugin');
    expect(result.manifest.version).toBe('1.0.0');
  });

  // --- Validation ---

  it('throws when id is missing', () => {
    expect(() => packagePlugin(validInput({ id: '' }))).toThrow(/id/i);
  });

  it('throws when name is missing', () => {
    expect(() => packagePlugin(validInput({ name: '' }))).toThrow(/name/i);
  });

  it('throws when version is missing', () => {
    expect(() => packagePlugin(validInput({ version: '' }))).toThrow(/version/i);
  });

  it('throws when ZIP exceeds 10MB', () => {
    // Create a huge HTML string that will exceed 10MB
    const hugeHtml = 'x'.repeat(11 * 1024 * 1024);
    expect(() => packagePlugin(validInput({ html: hugeHtml }))).toThrow(/10.*MB|size/i);
  });

  it('includes connector headers when provided', () => {
    const connector = {
      type: 'json_api' as const,
      url: 'https://api.example.com',
      method: 'GET',
      headers: { Authorization: 'Bearer secret123' },
      refreshInterval: 300,
    };
    const result = packagePlugin(validInput({ connector }));
    const zip = readZip(result.buffer);
    const stored = JSON.parse(zip.getEntry('connector.json')!.getData().toString('utf-8'));

    expect(stored.headers).toEqual({ Authorization: 'Bearer secret123' });
  });

  it('handles connector URL with port for allowed_domains', () => {
    const result = packagePlugin(
      validInput({
        connector: {
          type: 'json_api',
          url: 'https://api.example.com:8443/data',
          refreshInterval: 300,
        },
      })
    );
    const zip = readZip(result.buffer);
    const manifest = JSON.parse(zip.getEntry('plugin.json')!.getData().toString('utf-8'));

    expect(manifest.permissions.allowed_domains).toEqual(['api.example.com']);
  });

  it('omits max_refresh_ms when refreshInterval is not provided', () => {
    const result = packagePlugin(
      validInput({
        connector: { type: 'static', url: 'https://example.com/data.json' },
      })
    );
    const zip = readZip(result.buffer);
    const manifest = JSON.parse(zip.getEntry('plugin.json')!.getData().toString('utf-8'));

    expect(manifest.permissions.max_refresh_ms).toBeUndefined();
  });
});
