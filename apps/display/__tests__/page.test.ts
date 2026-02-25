import { describe, it, expect } from 'vitest';
import * as fs from 'fs';
import * as path from 'path';

describe('Main Page Component', () => {
  const pagesDir = path.join(__dirname, '..', 'src', 'routes');
  const pagePath = path.join(pagesDir, '+page.svelte');

  it('should have +page.svelte file', () => {
    expect(fs.existsSync(pagePath)).toBe(true);
  });

  it('should import DashboardGrid component', () => {
    const content = fs.readFileSync(pagePath, 'utf-8');
    expect(content).toContain('DashboardGrid');
    expect(content).toContain('import');
  });

  it('should render DashboardGrid in template', () => {
    const content = fs.readFileSync(pagePath, 'utf-8');
    expect(content).toContain('<DashboardGrid');
  });

  it('should pass plugins prop to DashboardGrid', () => {
    const content = fs.readFileSync(pagePath, 'utf-8');
    expect(content).toContain('plugins');
    expect(content).toContain('<DashboardGrid');
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

  it('should have an admin link', () => {
    const content = fs.readFileSync(pagePath, 'utf-8');
    expect(content).toContain('/admin');
    expect(content).toContain('admin-link');
  });

  // ── Dynamic Plugin Rendering ──────────────────────────────────────────────

  it('should import onMount from svelte for data fetching', () => {
    const content = fs.readFileSync(pagePath, 'utf-8');
    expect(content).toContain('onMount');
    expect(content).toContain('svelte');
  });

  it('should fetch /plugins on mount to load plugin data', () => {
    const content = fs.readFileSync(pagePath, 'utf-8');
    expect(content).toContain('/plugins');
    expect(content).toContain('fetch');
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

  // ── Architecture: no longer uses zone-based layout ────────────────────────

  it('should NOT import Layout component directly (uses DashboardGrid instead)', () => {
    const content = fs.readFileSync(pagePath, 'utf-8');
    expect(content).not.toMatch(/import\s+Layout\s+from/);
  });

  it('should NOT use zone-based slot rendering', () => {
    const content = fs.readFileSync(pagePath, 'utf-8');
    expect(content).not.toContain('slot="top-bar"');
    expect(content).not.toContain('slot="left-col"');
    expect(content).not.toContain('slot="center"');
    expect(content).not.toContain('slot="right-col"');
    expect(content).not.toContain('slot="bottom-bar"');
  });
});
