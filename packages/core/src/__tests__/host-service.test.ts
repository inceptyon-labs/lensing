import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { createHostService } from '../host-service';
import type { HostServiceInstance } from '../host-service';
import path from 'node:path';
import os from 'node:os';
import fs from 'node:fs';

describe('HostService (host-service.ts)', () => {
  let hostService: HostServiceInstance | null = null;
  let tempDir: string;

  beforeEach(() => {
    // Create a temporary directory for test databases
    tempDir = fs.mkdtempSync(path.join(os.tmpdir(), 'lensing-test-'));
  });

  afterEach(async () => {
    // Clean up
    if (hostService) {
      await hostService.close();
      hostService = null;
    }
    // Remove temporary directory
    if (fs.existsSync(tempDir)) {
      fs.rmSync(tempDir, { recursive: true, force: true });
    }
  });

  it('should boot successfully and resolve ready promise', async () => {
    hostService = createHostService({
      port: 0,
      dbPath: path.join(tempDir, 'test.db'),
      pluginsDir: path.join(tempDir, 'plugins'),
    });

    // ready should be a Promise that resolves
    const timeoutPromise = new Promise((_, reject) =>
      setTimeout(() => reject(new Error('Boot timeout')), 5000)
    );

    await Promise.race([hostService.ready, timeoutPromise]);
    expect(hostService.port).toBeGreaterThan(0);
  });

  it('should expose database instance after ready', async () => {
    hostService = createHostService({
      port: 0,
      dbPath: path.join(tempDir, 'test.db'),
      pluginsDir: path.join(tempDir, 'plugins'),
    });

    await hostService.ready;
    expect(hostService.db).toBeDefined();
    expect(typeof hostService.db.getSetting).toBe('function');
  });

  it('should expose REST server instance after ready', async () => {
    hostService = createHostService({
      port: 0,
      dbPath: path.join(tempDir, 'test.db'),
      pluginsDir: path.join(tempDir, 'plugins'),
    });

    await hostService.ready;
    expect(hostService.rest).toBeDefined();
    expect(typeof hostService.rest.close).toBe('function');
    expect(hostService.rest.port).toBe(hostService.port);
  });

  it('should expose WebSocket server instance after ready', async () => {
    hostService = createHostService({
      port: 0,
      dbPath: path.join(tempDir, 'test.db'),
      pluginsDir: path.join(tempDir, 'plugins'),
    });

    await hostService.ready;
    expect(hostService.ws).toBeDefined();
    expect(typeof hostService.ws.close).toBe('function');
  });

  it('should expose plugin loader instance after ready', async () => {
    hostService = createHostService({
      port: 0,
      dbPath: path.join(tempDir, 'test.db'),
      pluginsDir: path.join(tempDir, 'plugins'),
    });

    await hostService.ready;
    expect(hostService.plugins).toBeDefined();
    expect(typeof hostService.plugins.discover).toBe('function');
    expect(typeof hostService.plugins.load).toBe('function');
  });

  it('should allow REST /health endpoint to be called after boot', async () => {
    hostService = createHostService({
      port: 0,
      dbPath: path.join(tempDir, 'test.db'),
      pluginsDir: path.join(tempDir, 'plugins'),
    });

    await hostService.ready;
    const port = hostService.port;

    const response = await fetch(`http://127.0.0.1:${port}/health`);
    expect(response.status).toBe(200);

    const body = (await response.json()) as { status: string };
    expect(body.status).toBe('ok');
  });

  it('should close all services gracefully', async () => {
    hostService = createHostService({
      port: 0,
      dbPath: path.join(tempDir, 'test.db'),
      pluginsDir: path.join(tempDir, 'plugins'),
    });

    await hostService.ready;
    const port = hostService.port;

    // Verify server is responsive
    const response = await fetch(`http://127.0.0.1:${port}/health`);
    expect(response.status).toBe(200);

    // Close the service
    await hostService.close();

    // Try to connect again — should fail
    try {
      await fetch(`http://127.0.0.1:${port}/health`, { signal: AbortSignal.timeout(500) });
      expect.fail('Should not reach closed server');
    } catch (err) {
      // Expected: connection refused or timeout
      expect(err).toBeDefined();
    }

    hostService = null;
  });

  it('should handle missing plugins directory gracefully', async () => {
    const nonExistentPluginsDir = path.join(tempDir, 'nonexistent', 'plugins');
    hostService = createHostService({
      port: 0,
      dbPath: path.join(tempDir, 'test.db'),
      pluginsDir: nonExistentPluginsDir,
    });

    // Should boot without error even if plugins dir doesn't exist
    const timeoutPromise = new Promise((_, reject) =>
      setTimeout(() => reject(new Error('Boot timeout')), 5000)
    );

    await Promise.race([hostService.ready, timeoutPromise]);
    expect(hostService.port).toBeGreaterThan(0);
  });

  it('should use default options when not provided', async () => {
    hostService = createHostService();

    const timeoutPromise = new Promise((_, reject) =>
      setTimeout(() => reject(new Error('Boot timeout')), 5000)
    );

    await Promise.race([hostService.ready, timeoutPromise]);
    expect(hostService.port).toBeGreaterThan(0);
  });

  it('should wire plugin handlers to REST server', async () => {
    hostService = createHostService({
      port: 0,
      dbPath: path.join(tempDir, 'test.db'),
      pluginsDir: path.join(tempDir, 'plugins'),
    });

    await hostService.ready;
    const port = hostService.port;

    // Plugin endpoints should respond (may be empty)
    const response = await fetch(`http://127.0.0.1:${port}/plugins`);
    expect(response.status).toBe(200);

    const plugins = (await response.json()) as Array<{ plugin_id: string }>;
    expect(Array.isArray(plugins)).toBe(true);
  });

  it('should persist plugin enabled state to database', async () => {
    const dbPath = path.join(tempDir, 'test-persist.db');
    hostService = createHostService({
      port: 0,
      dbPath,
      pluginsDir: path.join(tempDir, 'plugins'),
    });

    await hostService.ready;

    // Manually set a plugin state in the database
    hostService.db.setPluginState('test-plugin', { enabled: false, config: {} });

    // Verify it was persisted
    const state = hostService.db.getPluginState<{ enabled: boolean }>('test-plugin');
    expect(state?.enabled).toBe(false);
  });

  it('should redact password-typed fields in GET /settings', async () => {
    hostService = createHostService({
      port: 0,
      dbPath: path.join(tempDir, 'test.db'),
      pluginsDir: path.join(tempDir, 'plugins'),
    });

    await hostService.ready;

    // Store a password-typed field (weather.apiKey is type 'password')
    hostService.db.setSetting('weather.apiKey', 'super-secret-key');
    // Store a non-password field
    hostService.db.setSetting('weather.lat', '40.7');

    const port = hostService.port;
    const res = await fetch(`http://127.0.0.1:${port}/settings`);
    expect(res.status).toBe(200);

    const settings = (await res.json()) as Record<string, unknown>;
    // Password field should be redacted
    expect(settings['weather.apiKey']).toBe('••••••••');
    // Non-password field should be returned as-is
    expect(settings['weather.lat']).toBe('40.7');
  });

  it('should not overwrite secrets when putSettings receives redacted placeholder', async () => {
    hostService = createHostService({
      port: 0,
      dbPath: path.join(tempDir, 'test.db'),
      pluginsDir: path.join(tempDir, 'plugins'),
    });

    await hostService.ready;

    // Store a real secret
    hostService.db.setSetting('weather.apiKey', 'real-secret');

    const port = hostService.port;

    // PUT with redacted placeholder — should be skipped
    const res = await fetch(`http://127.0.0.1:${port}/settings`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ 'weather.apiKey': '••••••••', 'weather.lat': '42.0' }),
    });
    expect(res.status).toBe(200);

    // Secret should be unchanged
    expect(hostService.db.getSetting('weather.apiKey')).toBe('real-secret');
    // Non-redacted field should be updated
    expect(hostService.db.getSetting('weather.lat')).toBe('42.0');
  });

  it('should boot with 0 modules when no module settings exist', async () => {
    hostService = createHostService({
      port: 0,
      dbPath: path.join(tempDir, 'test.db'),
      pluginsDir: path.join(tempDir, 'plugins'),
    });

    await hostService.ready;
    expect(hostService.modules).toHaveLength(0);
  });
});
