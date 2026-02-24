import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { createPluginAdminHandlers } from '../plugin-admin-handlers';
import { createPluginLoader } from '../plugin-loader';
import { createDatabase } from '../database';
import type { PluginManifestWithConfig, ZoneName } from '@lensing/types';
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

  it('should return empty array when no plugins exist', async () => {
    const db = createDatabase({ path: ':memory:' });
    const loader = createPluginLoader({ pluginsDir });
    await loader.load();

    const handlers = createPluginAdminHandlers({ pluginLoader: loader, db });
    const plugins = await handlers.getPlugins!();

    expect(Array.isArray(plugins)).toBe(true);
    expect(plugins.length).toBe(0);

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
});
