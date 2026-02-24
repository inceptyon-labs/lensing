import { describe, it, expect } from 'vitest';
import * as fs from 'fs';
import * as path from 'path';

describe('Main Page Component', () => {
  const pagesDir = path.join(__dirname, '..', 'src', 'routes');
  const pagePath = path.join(pagesDir, '+page.svelte');

  it('should have +page.svelte file', () => {
    expect(fs.existsSync(pagePath)).toBe(true);
  });

  it('should import Layout component', () => {
    const content = fs.readFileSync(pagePath, 'utf-8');
    expect(content).toContain('Layout');
    expect(content).toContain('import');
  });

  it('should import Placeholder component', () => {
    const content = fs.readFileSync(pagePath, 'utf-8');
    expect(content).toContain('Placeholder');
    expect(content).toContain('import');
  });

  it('should use Layout component in template', () => {
    const content = fs.readFileSync(pagePath, 'utf-8');
    expect(content).toContain('<Layout');
  });

  it('should have slot for top-bar zone', () => {
    const content = fs.readFileSync(pagePath, 'utf-8');
    expect(content).toContain('slot="top-bar"');
  });

  it('should have slot for left-col zone', () => {
    const content = fs.readFileSync(pagePath, 'utf-8');
    expect(content).toContain('slot="left-col"');
  });

  it('should have slot for center zone', () => {
    const content = fs.readFileSync(pagePath, 'utf-8');
    expect(content).toContain('slot="center"');
  });

  it('should have slot for right-col zone', () => {
    const content = fs.readFileSync(pagePath, 'utf-8');
    expect(content).toContain('slot="right-col"');
  });

  it('should have slot for bottom-bar zone', () => {
    const content = fs.readFileSync(pagePath, 'utf-8');
    expect(content).toContain('slot="bottom-bar"');
  });

  it('should use Placeholder widgets in at least one zone as fallback', () => {
    const content = fs.readFileSync(pagePath, 'utf-8');
    expect(content).toMatch(/<Placeholder[\s\S]*?\/>/);
  });

  it('should include svelte:head with meta viewport for kiosk', () => {
    const content = fs.readFileSync(pagePath, 'utf-8');
    expect(content).toContain('svelte:head');
    expect(content).toContain('viewport');
  });

  it('should import global styles in +layout.svelte', () => {
    const layoutPath = path.join(pagesDir, '+layout.svelte');
    if (fs.existsSync(layoutPath)) {
      const layoutContent = fs.readFileSync(layoutPath, 'utf-8');
      expect(layoutContent).toContain('global');
    }
  });

  it('should use svelte:fragment for slots (not div wrappers that bypass zone grid)', () => {
    const content = fs.readFileSync(pagePath, 'utf-8');
    expect(content).toContain('svelte:fragment');
    expect(content).not.toMatch(/<div slot=/);
  });

  // ── Dynamic Plugin Rendering ──────────────────────────────────────────────

  it('should import PluginRenderer component', () => {
    const content = fs.readFileSync(pagePath, 'utf-8');
    expect(content).toContain('PluginRenderer');
    expect(content).toContain('import');
  });

  it('should import onMount from svelte for data fetching', () => {
    const content = fs.readFileSync(pagePath, 'utf-8');
    expect(content).toContain('onMount');
    expect(content).toContain('svelte');
  });

  it('should fetch /plugins on mount to get zone assignments', () => {
    const content = fs.readFileSync(pagePath, 'utf-8');
    expect(content).toContain('/plugins');
    expect(content).toContain('fetch');
  });

  it('should use PluginRenderer for assigned plugins in zones', () => {
    const content = fs.readFileSync(pagePath, 'utf-8');
    expect(content).toContain('<PluginRenderer');
  });

  it('should connect to WebSocket for live layout updates', () => {
    const content = fs.readFileSync(pagePath, 'utf-8');
    expect(content).toContain('WebSocket');
  });

  it('should handle layout_change WebSocket messages to refresh plugins', () => {
    const content = fs.readFileSync(pagePath, 'utf-8');
    expect(content).toContain('layout_change');
  });

  it('should import handlePluginData from dataBusStore', () => {
    const content = fs.readFileSync(pagePath, 'utf-8');
    expect(content).toContain('handlePluginData');
    expect(content).toContain('dataBusStore');
  });

  it('should handle plugin_data WebSocket messages and dispatch to store', () => {
    const content = fs.readFileSync(pagePath, 'utf-8');
    expect(content).toContain('plugin_data');
    expect(content).toContain('handlePluginData');
  });
});
