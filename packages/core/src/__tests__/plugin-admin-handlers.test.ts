import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { createPluginAdminHandlers } from '../plugin-admin-handlers';
import { createPluginLoader } from '../plugin-loader';
import { createDatabase } from '../database';
import type { PluginManifestWithConfig, ZoneName } from '@lensing/types';
import { MODULE_SCHEMAS } from '@lensing/types';
import path from 'node:path';
import os from 'node:os';
import fs from 'node:fs';

describe('PluginAdminHandlers (plugin-admin-handlers.ts)', () => {
  let tempDir: string;
  let pluginsDir: string;

  beforeEach(() => {
    tempDir = fs.mkdtempSync(path.join(os.tmpdir(), 'lensing-test-'));
    pluginsDir = path.join(tempDir, 'plugins');
    fs.mkdirSync(pluginsDir, { recursive: true });
  });

  afterEach(() => {
    if (fs.existsSync(tempDir)) {
      fs.rmSync(tempDir, { recursive: true, force: true });
    }
  });

  it('should return handler functions for all plugin operations', async () => {
    const db = createDatabase({ path: ':memory:' });
    const loader = createPluginLoader({ pluginsDir });
    await loader.load();

    const handlers = createPluginAdminHandlers({ pluginLoader: loader, db });

    expect(handlers.getPlugins).toBeDefined();
    expect(typeof handlers.getPlugins).toBe('function');
    expect(handlers.getPlugin).toBeDefined();
    expect(typeof handlers.getPlugin).toBe('function');
    expect(handlers.setPluginEnabled).toBeDefined();
    expect(typeof handlers.setPluginEnabled).toBe('function');
    expect(handlers.updatePluginConfig).toBeDefined();
    expect(typeof handlers.updatePluginConfig).toBe('function');
    expect(handlers.assignPluginZone).toBeDefined();
    expect(typeof handlers.assignPluginZone).toBe('function');
    expect(handlers.reloadPlugins).toBeDefined();
    expect(typeof handlers.reloadPlugins).toBe('function');

    db.close();
  });

  it('should return only built-in module entries when no third-party plugins exist', async () => {
    const db = createDatabase({ path: ':memory:' });
    const loader = createPluginLoader({ pluginsDir });
    await loader.load();

    const handlers = createPluginAdminHandlers({ pluginLoader: loader, db });
    const plugins = await handlers.getPlugins!();

    expect(Array.isArray(plugins)).toBe(true);
    // No third-party plugins
    expect(plugins.filter((p) => !p.builtin).length).toBe(0);
    // Built-in modules present
    expect(plugins.filter((p) => p.builtin).length).toBe(9);

    db.close();
  });

  it('should return plugin with defaults when no DB state exists', async () => {
    const db = createDatabase({ path: ':memory:' });
    const loader = createPluginLoader({ pluginsDir });

    // Create a minimal plugin
    fs.mkdirSync(path.join(pluginsDir, 'test-plugin'), { recursive: true });
    fs.writeFileSync(
      path.join(pluginsDir, 'test-plugin', 'plugin.json'),
      JSON.stringify({
        id: 'test-plugin',
        name: 'Test Plugin',
        version: '1.0.0',
      })
    );

    await loader.load();

    const handlers = createPluginAdminHandlers({ pluginLoader: loader, db });
    const plugin = await handlers.getPlugin!('test-plugin');

    expect(plugin).toBeDefined();
    expect(plugin!.plugin_id).toBe('test-plugin');
    expect(plugin!.manifest.name).toBe('Test Plugin');
    expect(plugin!.enabled).toBe(true); // default
    expect(plugin!.config).toEqual({}); // default
    expect(plugin!.zone).toBeUndefined(); // default

    db.close();
  });

  it('should return undefined for nonexistent plugin', async () => {
    const db = createDatabase({ path: ':memory:' });
    const loader = createPluginLoader({ pluginsDir });
    await loader.load();

    const handlers = createPluginAdminHandlers({ pluginLoader: loader, db });
    const plugin = await handlers.getPlugin!('nonexistent');

    expect(plugin).toBeUndefined();

    db.close();
  });

  it('should persist enabled state to DB', async () => {
    const db = createDatabase({ path: ':memory:' });
    const loader = createPluginLoader({ pluginsDir });

    fs.mkdirSync(path.join(pluginsDir, 'test-plugin'), { recursive: true });
    fs.writeFileSync(
      path.join(pluginsDir, 'test-plugin', 'plugin.json'),
      JSON.stringify({
        id: 'test-plugin',
        name: 'Test Plugin',
        version: '1.0.0',
      })
    );

    await loader.load();

    const handlers = createPluginAdminHandlers({ pluginLoader: loader, db });

    await handlers.setPluginEnabled!('test-plugin', false);

    const plugin = await handlers.getPlugin!('test-plugin');
    expect(plugin!.enabled).toBe(false);

    db.close();
  });

  it('should persist config to DB', async () => {
    const db = createDatabase({ path: ':memory:' });
    const loader = createPluginLoader({ pluginsDir });

    fs.mkdirSync(path.join(pluginsDir, 'test-plugin'), { recursive: true });
    fs.writeFileSync(
      path.join(pluginsDir, 'test-plugin', 'plugin.json'),
      JSON.stringify({
        id: 'test-plugin',
        name: 'Test Plugin',
        version: '1.0.0',
      })
    );

    await loader.load();

    const handlers = createPluginAdminHandlers({ pluginLoader: loader, db });

    await handlers.updatePluginConfig!('test-plugin', { apiKey: 'secret123', threshold: 5 });

    const plugin = await handlers.getPlugin!('test-plugin');
    expect(plugin!.config).toEqual({ apiKey: 'secret123', threshold: 5 });

    db.close();
  });

  it('should persist zone assignment to DB', async () => {
    const db = createDatabase({ path: ':memory:' });
    const loader = createPluginLoader({ pluginsDir });

    fs.mkdirSync(path.join(pluginsDir, 'test-plugin'), { recursive: true });
    fs.writeFileSync(
      path.join(pluginsDir, 'test-plugin', 'plugin.json'),
      JSON.stringify({
        id: 'test-plugin',
        name: 'Test Plugin',
        version: '1.0.0',
      })
    );

    await loader.load();

    const handlers = createPluginAdminHandlers({ pluginLoader: loader, db });

    await handlers.assignPluginZone!('test-plugin', 'top-bar' as ZoneName);

    const plugin = await handlers.getPlugin!('test-plugin');
    expect(plugin!.zone).toBe('top-bar');

    db.close();
  });

  it('should clear zone assignment when given undefined', async () => {
    const db = createDatabase({ path: ':memory:' });
    const loader = createPluginLoader({ pluginsDir });

    fs.mkdirSync(path.join(pluginsDir, 'test-plugin'), { recursive: true });
    fs.writeFileSync(
      path.join(pluginsDir, 'test-plugin', 'plugin.json'),
      JSON.stringify({
        id: 'test-plugin',
        name: 'Test Plugin',
        version: '1.0.0',
      })
    );

    await loader.load();

    const handlers = createPluginAdminHandlers({ pluginLoader: loader, db });

    await handlers.assignPluginZone!('test-plugin', 'top-bar' as ZoneName);
    expect((await handlers.getPlugin!('test-plugin'))!.zone).toBe('top-bar');

    await handlers.assignPluginZone!('test-plugin', undefined);
    expect((await handlers.getPlugin!('test-plugin'))!.zone).toBeUndefined();

    db.close();
  });

  it('should call onChange callback on mutations', async () => {
    const db = createDatabase({ path: ':memory:' });
    const loader = createPluginLoader({ pluginsDir });

    fs.mkdirSync(path.join(pluginsDir, 'test-plugin'), { recursive: true });
    fs.writeFileSync(
      path.join(pluginsDir, 'test-plugin', 'plugin.json'),
      JSON.stringify({
        id: 'test-plugin',
        name: 'Test Plugin',
        version: '1.0.0',
      })
    );

    await loader.load();

    const changes: Array<{ pluginId: string; action: string }> = [];
    const handlers = createPluginAdminHandlers({
      pluginLoader: loader,
      db,
      onChange: (pluginId, action) => {
        changes.push({ pluginId, action });
      },
    });

    await handlers.setPluginEnabled!('test-plugin', false);
    expect(changes).toContainEqual({ pluginId: 'test-plugin', action: 'enabled' });

    db.close();
  });

  it('should reload plugins via plugin loader', async () => {
    const db = createDatabase({ path: ':memory:' });
    const loader = createPluginLoader({ pluginsDir });

    fs.mkdirSync(path.join(pluginsDir, 'test-plugin'), { recursive: true });
    fs.writeFileSync(
      path.join(pluginsDir, 'test-plugin', 'plugin.json'),
      JSON.stringify({
        id: 'test-plugin',
        name: 'Test Plugin',
        version: '1.0.0',
      })
    );

    await loader.load();
    expect(loader.getAllPlugins().length).toBe(1);

    const handlers = createPluginAdminHandlers({ pluginLoader: loader, db });

    // Add another plugin
    fs.mkdirSync(path.join(pluginsDir, 'test-plugin-2'), { recursive: true });
    fs.writeFileSync(
      path.join(pluginsDir, 'test-plugin-2', 'plugin.json'),
      JSON.stringify({
        id: 'test-plugin-2',
        name: 'Test Plugin 2',
        version: '1.0.0',
      })
    );

    await handlers.reloadPlugins!();

    expect(loader.getAllPlugins().length).toBe(2);

    db.close();
  });

  it('should merge multiple mutations into single persisted state', async () => {
    const db = createDatabase({ path: ':memory:' });
    const loader = createPluginLoader({ pluginsDir });

    fs.mkdirSync(path.join(pluginsDir, 'test-plugin'), { recursive: true });
    fs.writeFileSync(
      path.join(pluginsDir, 'test-plugin', 'plugin.json'),
      JSON.stringify({
        id: 'test-plugin',
        name: 'Test Plugin',
        version: '1.0.0',
      })
    );

    await loader.load();

    const handlers = createPluginAdminHandlers({ pluginLoader: loader, db });

    await handlers.setPluginEnabled!('test-plugin', false);
    await handlers.updatePluginConfig!('test-plugin', { key: 'value' });
    await handlers.assignPluginZone!('test-plugin', 'left-col' as ZoneName);

    const plugin = await handlers.getPlugin!('test-plugin');
    expect(plugin!.enabled).toBe(false);
    expect(plugin!.config).toEqual({ key: 'value' });
    expect(plugin!.zone).toBe('left-col');

    db.close();
  });

  // ── Built-in Module Synthesis ─────────────────────────────────────────────

  it('should include built-in module entries with builtin flag in getPlugins', async () => {
    const db = createDatabase({ path: ':memory:' });
    const loader = createPluginLoader({ pluginsDir });
    await loader.load();

    const handlers = createPluginAdminHandlers({ pluginLoader: loader, db });
    const plugins = await handlers.getPlugins!();

    const builtinPlugins = plugins.filter((p) => p.builtin);
    expect(builtinPlugins.length).toBe(MODULE_SCHEMAS.length);

    for (const schema of MODULE_SCHEMAS) {
      const entry = builtinPlugins.find((p) => p.plugin_id === schema.id);
      expect(entry).toBeDefined();
      expect(entry!.builtin).toBe(true);
      expect(entry!.manifest.name).toBe(schema.name);
      expect(entry!.manifest.version).toBe('built-in');
      expect(entry!.manifest.config_schema).toBeDefined();
    }

    db.close();
  });

  it('should return module entry via getPlugin for a built-in module', async () => {
    const db = createDatabase({ path: ':memory:' });
    const loader = createPluginLoader({ pluginsDir });
    await loader.load();

    const handlers = createPluginAdminHandlers({ pluginLoader: loader, db });
    const entry = await handlers.getPlugin!('weather');

    expect(entry).toBeDefined();
    expect(entry!.plugin_id).toBe('weather');
    expect(entry!.builtin).toBe(true);
    expect(entry!.manifest.name).toBe('Weather');
    expect(entry!.manifest.config_schema?.fields.length).toBeGreaterThan(0);

    db.close();
  });

  it('should ignore setPluginEnabled for built-in modules (grid-driven lifecycle)', async () => {
    const db = createDatabase({ path: ':memory:' });
    const loader = createPluginLoader({ pluginsDir });
    await loader.load();

    const handlers = createPluginAdminHandlers({ pluginLoader: loader, db });

    // setPluginEnabled is a no-op for built-in modules
    await handlers.setPluginEnabled!('weather', true);
    expect(db.getSetting('weather.enabled')).toBeUndefined();

    await handlers.setPluginEnabled!('weather', false);
    expect(db.getSetting('weather.enabled')).toBeUndefined();

    db.close();
  });

  it('should write module config to flat DB settings', async () => {
    const db = createDatabase({ path: ':memory:' });
    const loader = createPluginLoader({ pluginsDir });
    await loader.load();

    const handlers = createPluginAdminHandlers({ pluginLoader: loader, db });

    await handlers.updatePluginConfig!('weather', { apiKey: 'test-key', lat: 40.7, lon: -74 });

    expect(db.getSetting('weather.apiKey')).toBe('test-key');
    expect(db.getSetting('weather.lat')).toBe('40.7');
    expect(db.getSetting('weather.lon')).toBe('-74');

    db.close();
  });

  it('should skip redacted password placeholders in module config update', async () => {
    const db = createDatabase({ path: ':memory:' });
    const loader = createPluginLoader({ pluginsDir });
    await loader.load();

    // Set a real secret
    db.setSetting('weather.apiKey', 'real-secret');

    const handlers = createPluginAdminHandlers({ pluginLoader: loader, db });

    // Update with redacted placeholder — should be skipped
    await handlers.updatePluginConfig!('weather', { apiKey: '••••••••', lat: 42 });

    expect(db.getSetting('weather.apiKey')).toBe('real-secret');
    expect(db.getSetting('weather.lat')).toBe('42');

    db.close();
  });

  it('should persist zone for built-in modules via assignPluginZone', async () => {
    const db = createDatabase({ path: ':memory:' });
    const loader = createPluginLoader({ pluginsDir });
    await loader.load();

    const handlers = createPluginAdminHandlers({ pluginLoader: loader, db });

    await handlers.assignPluginZone!('weather', 'right-col' as ZoneName);

    const entry = await handlers.getPlugin!('weather');
    expect(entry!.zone).toBe('right-col');

    db.close();
  });

  it('should redact password fields in module config returned by getPlugins', async () => {
    const db = createDatabase({ path: ':memory:' });
    const loader = createPluginLoader({ pluginsDir });
    await loader.load();

    // Set a password field
    db.setSetting('weather.apiKey', 'super-secret');
    db.setSetting('weather.lat', '40.7');

    const handlers = createPluginAdminHandlers({ pluginLoader: loader, db });
    const plugins = await handlers.getPlugins!();

    const weather = plugins.find((p) => p.plugin_id === 'weather');
    expect(weather).toBeDefined();
    expect(weather!.config['apiKey']).toBe('••••••••');
    expect(weather!.config['lat']).toBe(40.7);

    db.close();
  });

  it('should always show built-in modules as active (grid-driven lifecycle)', async () => {
    const db = createDatabase({ path: ':memory:' });
    const loader = createPluginLoader({ pluginsDir });
    await loader.load();

    const handlers = createPluginAdminHandlers({ pluginLoader: loader, db });

    // Built-in modules are always active — no enabled field
    const entry = await handlers.getPlugin!('crypto');
    expect(entry!.status).toBe('active');
    expect(entry).not.toHaveProperty('enabled');

    db.close();
  });

  // ── integration_status ────────────────────────────────────────────────────

  it('should return integration_status: not_needed for modules with no integration fields', async () => {
    const db = createDatabase({ path: ':memory:' });
    const loader = createPluginLoader({ pluginsDir });
    await loader.load();

    const handlers = createPluginAdminHandlers({ pluginLoader: loader, db });

    // crypto, news, sports, pir have no integration fields
    for (const moduleId of ['crypto', 'news', 'sports', 'pir'] as const) {
      const entry = await handlers.getPlugin!(moduleId);
      expect(entry).toBeDefined();
      expect(entry!.integration_status).toBe('not_needed');
    }

    db.close();
  });

  it('should return integration_status: missing when required integration fields are not set', async () => {
    const db = createDatabase({ path: ':memory:' });
    const loader = createPluginLoader({ pluginsDir });
    await loader.load();

    const handlers = createPluginAdminHandlers({ pluginLoader: loader, db });

    // home-assistant has required integration fields (url, token) — fresh DB has none
    const entry = await handlers.getPlugin!('home-assistant');
    expect(entry).toBeDefined();
    expect(entry!.integration_status).toBe('missing');

    db.close();
  });

  it('should return integration_status: ready when all required integration fields are set', async () => {
    const db = createDatabase({ path: ':memory:' });
    const loader = createPluginLoader({ pluginsDir });
    await loader.load();

    const handlers = createPluginAdminHandlers({ pluginLoader: loader, db });

    // Set the required integration field for weather (provider has a default, only apiKey is required when using openweathermap)
    // For open-meteo (default provider), no apiKey required — so just having provider set = ready
    // Actually: provider has a default, apiKey is NOT required by default. The only required integration
    // fields matter for "missing" vs "ready". Let's use home-assistant which has required url + token.
    await handlers.updatePluginConfig!('home-assistant', {
      url: 'http://ha.local:8123',
      token: 'mytoken',
    });

    const entry = await handlers.getPlugin!('home-assistant');
    expect(entry).toBeDefined();
    expect(entry!.integration_status).toBe('ready');

    db.close();
  });

  it('should include integration_status in getPlugins response', async () => {
    const db = createDatabase({ path: ':memory:' });
    const loader = createPluginLoader({ pluginsDir });
    await loader.load();

    const handlers = createPluginAdminHandlers({ pluginLoader: loader, db });
    const plugins = await handlers.getPlugins!();

    const builtins = plugins.filter((p) => p.builtin);
    for (const entry of builtins) {
      expect(entry.integration_status).toBeDefined();
      expect(['ready', 'missing', 'not_needed']).toContain(entry.integration_status);
    }

    db.close();
  });

  it('should return integration_status: missing if only some required integration fields are set', async () => {
    const db = createDatabase({ path: ':memory:' });
    const loader = createPluginLoader({ pluginsDir });
    await loader.load();

    const handlers = createPluginAdminHandlers({ pluginLoader: loader, db });

    // Set only url, not token (both required for home-assistant)
    await handlers.updatePluginConfig!('home-assistant', { url: 'http://ha.local:8123' });

    const entry = await handlers.getPlugin!('home-assistant');
    expect(entry).toBeDefined();
    expect(entry!.integration_status).toBe('missing');

    db.close();
  });
});
