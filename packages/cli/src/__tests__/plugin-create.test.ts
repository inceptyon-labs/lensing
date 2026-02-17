import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import fs from 'fs';
import path from 'path';
import os from 'os';
import { createPluginScaffold, validatePluginName, generatePluginId } from '../commands/plugin-create';
import * as cliExports from '../index';

describe('Plugin Create Scaffolding', () => {
  let testDir: string;

  beforeEach(() => {
    testDir = fs.mkdtempSync(path.join(os.tmpdir(), 'lensing-plugin-test-'));
  });

  afterEach(() => {
    if (fs.existsSync(testDir)) {
      fs.rmSync(testDir, { recursive: true });
    }
  });

  describe('validatePluginName', () => {
    it('should accept valid plugin names', () => {
      expect(validatePluginName('my-plugin')).toBe(true);
      expect(validatePluginName('plugin123')).toBe(true);
      expect(validatePluginName('MyPlugin')).toBe(true);
      expect(validatePluginName('myplugin')).toBe(true);
    });

    it('should reject names with spaces', () => {
      expect(validatePluginName('my plugin')).toBe(false);
      expect(validatePluginName('my plugin name')).toBe(false);
    });

    it('should reject names with special characters except hyphen', () => {
      expect(validatePluginName('my@plugin')).toBe(false);
      expect(validatePluginName('my.plugin')).toBe(false);
      expect(validatePluginName('my_plugin')).toBe(false);
      expect(validatePluginName('my plugin!')).toBe(false);
    });

    it('should reject names shorter than 3 characters', () => {
      expect(validatePluginName('ab')).toBe(false);
      expect(validatePluginName('a')).toBe(false);
      expect(validatePluginName('')).toBe(false);
    });

    it('should reject names longer than 50 characters', () => {
      expect(validatePluginName('a'.repeat(51))).toBe(false);
    });
  });

  describe('generatePluginId', () => {
    it('should generate id from name', () => {
      expect(generatePluginId('my-plugin')).toBe('my-plugin');
      expect(generatePluginId('MyPlugin')).toBe('myplugin');
      expect(generatePluginId('My Plugin')).toBe('my-plugin');
    });

    it('should handle multiple spaces', () => {
      expect(generatePluginId('My  Plugin')).toBe('my-plugin');
    });

    it('should prefix with @lensing/', () => {
      const id = generatePluginId('my-plugin');
      expect(id).toBe('my-plugin');
    });
  });

  describe('createPluginScaffold', () => {
    it('should create plugin directory structure', () => {
      const pluginName = 'test-plugin';
      const pluginPath = path.join(testDir, pluginName);

      createPluginScaffold(pluginName, testDir);

      expect(fs.existsSync(pluginPath)).toBe(true);
      expect(fs.statSync(pluginPath).isDirectory()).toBe(true);
    });

    it('should create plugin.json with correct metadata', () => {
      const pluginName = 'test-plugin';
      const pluginPath = path.join(testDir, pluginName);

      createPluginScaffold(pluginName, testDir);

      const manifestPath = path.join(pluginPath, 'plugin.json');
      expect(fs.existsSync(manifestPath)).toBe(true);

      const manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf-8'));
      expect(manifest.id).toBe('test-plugin');
      expect(manifest.name).toBe('test-plugin');
      expect(manifest.version).toBe('0.1.0');
      expect(manifest.type).toBe('plugin');
      expect(Array.isArray(manifest.allowed_domains)).toBe(true);
      expect(Array.isArray(manifest.dependencies)).toBe(true);
    });

    it('should create Svelte component with correct name', () => {
      const pluginName = 'test-plugin';
      const pluginPath = path.join(testDir, pluginName);

      createPluginScaffold(pluginName, testDir);

      const componentPath = path.join(pluginPath, 'TestPlugin.svelte');
      expect(fs.existsSync(componentPath)).toBe(true);

      const content = fs.readFileSync(componentPath, 'utf-8');
      expect(content).toContain('export');
      expect(content).toContain('<script>');
    });

    it('should create server module with correct exports', () => {
      const pluginName = 'test-plugin';
      const pluginPath = path.join(testDir, pluginName);

      createPluginScaffold(pluginName, testDir);

      const serverPath = path.join(pluginPath, 'server.ts');
      expect(fs.existsSync(serverPath)).toBe(true);

      const content = fs.readFileSync(serverPath, 'utf-8');
      expect(content).toContain('export');
      expect(content).toContain('interface');
    });

    it('should create test file with proper imports', () => {
      const pluginName = 'test-plugin';
      const pluginPath = path.join(testDir, pluginName);

      createPluginScaffold(pluginName, testDir);

      const testPath = path.join(pluginPath, 'TestPlugin.test.ts');
      expect(fs.existsSync(testPath)).toBe(true);

      const content = fs.readFileSync(testPath, 'utf-8');
      expect(content).toContain('describe');
      expect(content).toContain('it');
      expect(content).toContain('TestPlugin');
    });

    it('should create .gitignore', () => {
      const pluginName = 'test-plugin';
      const pluginPath = path.join(testDir, pluginName);

      createPluginScaffold(pluginName, testDir);

      const gitignorePath = path.join(pluginPath, '.gitignore');
      expect(fs.existsSync(gitignorePath)).toBe(true);
    });

    it('should throw error if plugin already exists', () => {
      const pluginName = 'test-plugin';
      const pluginPath = path.join(testDir, pluginName);

      createPluginScaffold(pluginName, testDir);
      expect(() => createPluginScaffold(pluginName, testDir)).toThrow();
    });

    it('should handle PascalCase plugin names correctly', () => {
      const pluginName = 'TestPlugin';
      const pluginPath = path.join(testDir, 'testplugin');

      createPluginScaffold(pluginName, testDir);

      expect(fs.existsSync(pluginPath)).toBe(true);

      const componentPath = path.join(pluginPath, 'TestPlugin.svelte');
      expect(fs.existsSync(componentPath)).toBe(true);
    });

    it('should include proper template content in all files', () => {
      const pluginName = 'test-plugin';
      const pluginPath = path.join(testDir, pluginName);

      createPluginScaffold(pluginName, testDir);

      const manifest = JSON.parse(fs.readFileSync(path.join(pluginPath, 'plugin.json'), 'utf-8'));
      expect(manifest.id).toContain('test-plugin');

      const component = fs.readFileSync(path.join(pluginPath, 'TestPlugin.svelte'), 'utf-8');
      expect(component.length).toBeGreaterThan(0);

      const server = fs.readFileSync(path.join(pluginPath, 'server.ts'), 'utf-8');
      expect(server.length).toBeGreaterThan(0);

      const test = fs.readFileSync(path.join(pluginPath, 'TestPlugin.test.ts'), 'utf-8');
      expect(test.length).toBeGreaterThan(0);
    });
  });

  describe('CLI exports', () => {
    it('should export createPluginScaffold from index', () => {
      expect(cliExports.createPluginScaffold).toBe(createPluginScaffold);
    });

    it('should export validatePluginName from index', () => {
      expect(cliExports.validatePluginName).toBe(validatePluginName);
    });

    it('should export generatePluginId from index', () => {
      expect(cliExports.generatePluginId).toBe(generatePluginId);
    });
  });
});
