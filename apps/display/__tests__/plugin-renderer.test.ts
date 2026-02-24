import { describe, it, expect } from 'vitest';
import { readFileSync, existsSync } from 'fs';
import { join } from 'path';

describe('PluginRenderer Component', () => {
  const rendererPath = join(__dirname, '../src/lib/PluginRenderer.svelte');

  it('should have PluginRenderer.svelte file', () => {
    expect(existsSync(rendererPath)).toBe(true);
  });

  it('should accept a plugin prop typed as PluginAdminEntry', () => {
    const source = readFileSync(rendererPath, 'utf-8');
    expect(source).toContain('PluginAdminEntry');
    expect(source).toContain('plugin');
  });

  it('should import built-in widget components', () => {
    const source = readFileSync(rendererPath, 'utf-8');
    expect(source).toContain('PhotoSlideshow');
    expect(source).toContain('NewsHeadlines');
    expect(source).toContain('SportsScores');
    expect(source).toContain('HomeAssistantDevices');
  });

  it('should import Placeholder for fallback rendering', () => {
    const source = readFileSync(rendererPath, 'utf-8');
    expect(source).toContain('Placeholder');
  });

  it('should render based on plugin_id matching', () => {
    const source = readFileSync(rendererPath, 'utf-8');
    // Should reference plugin.plugin_id or plugin_id to determine which component to render
    expect(source).toContain('plugin_id');
  });

  it('should handle unknown plugin_id by rendering Placeholder', () => {
    const source = readFileSync(rendererPath, 'utf-8');
    // Should have fallback/else clause rendering Placeholder
    expect(source).toContain('Placeholder');
    // Should use if/else or switch to select component
    expect(source).toMatch(/{:else}|{:else if|default:/);
  });
});

describe('Built-in Plugin Map', () => {
  const configPath = join(__dirname, '../src/lib/config.ts');

  it('should export BUILTIN_PLUGIN_MAP from config.ts', () => {
    const source = readFileSync(configPath, 'utf-8');
    expect(source).toContain('BUILTIN_PLUGIN_MAP');
    expect(source).toContain('export');
  });

  it('should map photo-slideshow plugin id', () => {
    const source = readFileSync(configPath, 'utf-8');
    expect(source).toContain('photo-slideshow');
  });

  it('should map news module id', () => {
    const source = readFileSync(configPath, 'utf-8');
    expect(source).toContain("news:");
  });

  it('should map sports module id', () => {
    const source = readFileSync(configPath, 'utf-8');
    expect(source).toContain("sports:");
  });

  it('should map home-assistant module id', () => {
    const source = readFileSync(configPath, 'utf-8');
    expect(source).toContain("'home-assistant'");
  });
});
