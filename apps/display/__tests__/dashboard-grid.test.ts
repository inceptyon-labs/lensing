import { describe, it, expect } from 'vitest';
import { readFileSync, existsSync } from 'fs';
import { join } from 'path';

describe('Grid Types', () => {
  it('should export GridWidget interface fields', async () => {
    const mod = await import('../src/lib/grid/types');
    // DEFAULT_GRID_POLICY uses the GridPolicy type, confirming it exports
    expect(mod.DEFAULT_GRID_POLICY).toBeDefined();
    expect(mod.DEFAULT_GRID_POLICY.columns).toBe(24);
    expect(mod.DEFAULT_GRID_POLICY.rowHeight).toBe(60);
    expect(mod.DEFAULT_GRID_POLICY.margin).toEqual([5, 5]);
    expect(mod.DEFAULT_GRID_POLICY.compact).toBe('vertical');
    expect(mod.DEFAULT_GRID_POLICY.resizeHandles).toEqual([
      'n',
      'ne',
      'e',
      'se',
      's',
      'sw',
      'w',
      'nw',
    ]);
  });
});

describe('Default Layouts', () => {
  const layoutsPath = join(__dirname, '../src/lib/grid/default-layouts.ts');

  it('should have default-layouts.ts file', () => {
    expect(existsSync(layoutsPath)).toBe(true);
  });

  it('should export DEFAULT_WIDGET_LAYOUTS map', async () => {
    const mod = await import('../src/lib/grid/default-layouts');
    expect(mod.DEFAULT_WIDGET_LAYOUTS).toBeDefined();
    expect(typeof mod.DEFAULT_WIDGET_LAYOUTS).toBe('object');
  });

  it('should have a default layout for weather plugin', async () => {
    const { DEFAULT_WIDGET_LAYOUTS } = await import('../src/lib/grid/default-layouts');
    const weather = DEFAULT_WIDGET_LAYOUTS['weather'];
    expect(weather).toBeDefined();
    expect(weather.x).toBeDefined();
    expect(weather.y).toBeDefined();
    expect(weather.w).toBeGreaterThan(0);
    expect(weather.h).toBeGreaterThan(0);
  });

  it('should have a default layout for news plugin', async () => {
    const { DEFAULT_WIDGET_LAYOUTS } = await import('../src/lib/grid/default-layouts');
    const news = DEFAULT_WIDGET_LAYOUTS['news'];
    expect(news).toBeDefined();
    expect(news.w).toBeGreaterThan(0);
    expect(news.h).toBeGreaterThan(0);
  });

  it('should have a default layout for sports plugin', async () => {
    const { DEFAULT_WIDGET_LAYOUTS } = await import('../src/lib/grid/default-layouts');
    expect(DEFAULT_WIDGET_LAYOUTS['sports']).toBeDefined();
  });

  it('should have a default layout for crypto plugin', async () => {
    const { DEFAULT_WIDGET_LAYOUTS } = await import('../src/lib/grid/default-layouts');
    expect(DEFAULT_WIDGET_LAYOUTS['crypto']).toBeDefined();
  });

  it('should have a default layout for calendar plugin', async () => {
    const { DEFAULT_WIDGET_LAYOUTS } = await import('../src/lib/grid/default-layouts');
    expect(DEFAULT_WIDGET_LAYOUTS['calendar']).toBeDefined();
  });

  it('should have a default layout for home-assistant plugin', async () => {
    const { DEFAULT_WIDGET_LAYOUTS } = await import('../src/lib/grid/default-layouts');
    expect(DEFAULT_WIDGET_LAYOUTS['home-assistant']).toBeDefined();
  });

  it('should have a default layout for photo-slideshow plugin', async () => {
    const { DEFAULT_WIDGET_LAYOUTS } = await import('../src/lib/grid/default-layouts');
    expect(DEFAULT_WIDGET_LAYOUTS['photo-slideshow']).toBeDefined();
  });

  it('should have a default layout for allergies plugin', async () => {
    const { DEFAULT_WIDGET_LAYOUTS } = await import('../src/lib/grid/default-layouts');
    expect(DEFAULT_WIDGET_LAYOUTS['allergies']).toBeDefined();
  });

  it('should export getWidgetLayout helper that returns known layouts', async () => {
    const { getWidgetLayout } = await import('../src/lib/grid/default-layouts');
    expect(typeof getWidgetLayout).toBe('function');
    const layout = getWidgetLayout('weather');
    expect(layout.w).toBeGreaterThan(0);
    expect(layout.h).toBeGreaterThan(0);
  });

  it('should auto-place unknown plugins with getWidgetLayout', async () => {
    const { getWidgetLayout } = await import('../src/lib/grid/default-layouts');
    const layout = getWidgetLayout('unknown-plugin-xyz');
    expect(layout.w).toBeGreaterThan(0);
    expect(layout.h).toBeGreaterThan(0);
    // Unknown plugins should get a valid position
    expect(layout.x).toBeGreaterThanOrEqual(0);
    expect(layout.y).toBeGreaterThanOrEqual(0);
  });

  it('should export pluginsToGridWidgets converter', async () => {
    const { pluginsToGridWidgets } = await import('../src/lib/grid/default-layouts');
    expect(typeof pluginsToGridWidgets).toBe('function');
  });

  it('should convert PluginAdminEntry array to GridWidget array', async () => {
    const { pluginsToGridWidgets } = await import('../src/lib/grid/default-layouts');
    const plugins = [
      {
        plugin_id: 'weather',
        manifest: { id: 'weather', name: 'Weather', version: '1.0.0' },
        status: 'active' as const,
        enabled: true,
        config: {},
      },
      {
        plugin_id: 'news',
        manifest: { id: 'news', name: 'News', version: '1.0.0' },
        status: 'active' as const,
        enabled: true,
        config: {},
      },
    ];

    const widgets = pluginsToGridWidgets(plugins);
    expect(widgets).toHaveLength(2);
    expect(widgets[0].id).toBe('weather');
    expect(widgets[1].id).toBe('news');
    expect(widgets[0].w).toBeGreaterThan(0);
    expect(widgets[1].w).toBeGreaterThan(0);
  });

  it('should only include enabled plugins in grid conversion', async () => {
    const { pluginsToGridWidgets } = await import('../src/lib/grid/default-layouts');
    const plugins = [
      {
        plugin_id: 'weather',
        manifest: { id: 'weather', name: 'Weather', version: '1.0.0' },
        status: 'active' as const,
        enabled: true,
        config: {},
      },
      {
        plugin_id: 'news',
        manifest: { id: 'news', name: 'News', version: '1.0.0' },
        status: 'disabled' as const,
        enabled: false,
        config: {},
      },
    ];

    const widgets = pluginsToGridWidgets(plugins);
    expect(widgets).toHaveLength(1);
    expect(widgets[0].id).toBe('weather');
  });

  it('should keep all default layouts within 24-column grid', async () => {
    const { DEFAULT_WIDGET_LAYOUTS } = await import('../src/lib/grid/default-layouts');
    for (const [id, layout] of Object.entries(DEFAULT_WIDGET_LAYOUTS)) {
      expect(layout.x + layout.w).toBeLessThanOrEqual(24);
      expect(layout.x).toBeGreaterThanOrEqual(0);
      expect(layout.y).toBeGreaterThanOrEqual(0);
    }
  });
});

describe('DashboardGrid Component', () => {
  const gridPath = join(__dirname, '../src/lib/grid/DashboardGrid.svelte');

  it('should have DashboardGrid.svelte file', () => {
    expect(existsSync(gridPath)).toBe(true);
  });

  it('should use Svelte 5 runes syntax ($props, $state)', () => {
    const source = readFileSync(gridPath, 'utf-8');
    expect(source).toContain('$props');
    expect(source).toContain('$state');
  });

  it('should NOT use legacy Svelte syntax (export let, $:)', () => {
    const source = readFileSync(gridPath, 'utf-8');
    expect(source).not.toMatch(/export\s+let\s/);
    // $: reactive declarations should not appear (but $state, $derived, $effect, $props are OK)
    expect(source).not.toMatch(/^\s*\$:\s/m);
  });

  it('should import GridStackAdapter', () => {
    const source = readFileSync(gridPath, 'utf-8');
    expect(source).toContain('GridStackAdapter');
  });

  it('should import PluginRenderer', () => {
    const source = readFileSync(gridPath, 'utf-8');
    expect(source).toContain('PluginRenderer');
  });

  it('should import ErrorBoundary', () => {
    const source = readFileSync(gridPath, 'utf-8');
    expect(source).toContain('ErrorBoundary');
  });

  it('should accept plugins prop', () => {
    const source = readFileSync(gridPath, 'utf-8');
    expect(source).toContain('plugins');
  });

  it('should have editMode state', () => {
    const source = readFileSync(gridPath, 'utf-8');
    expect(source).toContain('editMode');
  });

  it('should have dashboard-edit-mode class for edit mode styling', () => {
    const source = readFileSync(gridPath, 'utf-8');
    expect(source).toContain('dashboard-edit-mode');
  });

  it('should have an edit toggle button', () => {
    const source = readFileSync(gridPath, 'utf-8');
    expect(source).toMatch(/button/i);
    expect(source).toContain('editMode');
  });

  it('should render PluginRenderer inside grid items', () => {
    const source = readFileSync(gridPath, 'utf-8');
    expect(source).toContain('<PluginRenderer');
  });

  it('should use DEFAULT_GRID_POLICY or equivalent grid options', () => {
    const source = readFileSync(gridPath, 'utf-8');
    expect(source).toMatch(/DEFAULT_GRID_POLICY|gridPolicy|columns.*24/);
  });

  it('should handle onchange callback from adapter', () => {
    const source = readFileSync(gridPath, 'utf-8');
    expect(source).toContain('onchange');
  });

  it('should use pluginsToGridWidgets or equivalent for conversion', () => {
    const source = readFileSync(gridPath, 'utf-8');
    expect(source).toMatch(/pluginsToGridWidgets|toGridWidgets|gridWidgets/);
  });

  it('should import grid-layout.css or rely on global import', () => {
    const source = readFileSync(gridPath, 'utf-8');
    // Either imports the CSS directly or references grid classes
    expect(source).toMatch(/grid-layout\.css|gs-item|grid-stack/);
  });
});

describe('Updated +page.svelte', () => {
  const pagePath = join(__dirname, '../src/routes/+page.svelte');

  it('should import DashboardGrid instead of Layout', () => {
    const content = readFileSync(pagePath, 'utf-8');
    expect(content).toContain('DashboardGrid');
  });

  it('should render DashboardGrid component', () => {
    const content = readFileSync(pagePath, 'utf-8');
    expect(content).toContain('<DashboardGrid');
  });

  it('should NOT use zone-based slot rendering', () => {
    const content = readFileSync(pagePath, 'utf-8');
    // Should no longer have zone slot assignments
    expect(content).not.toContain('slot="top-bar"');
    expect(content).not.toContain('slot="left-col"');
    expect(content).not.toContain('slot="center"');
    expect(content).not.toContain('slot="right-col"');
    expect(content).not.toContain('slot="bottom-bar"');
  });

  it('should NOT import Layout component', () => {
    const content = readFileSync(pagePath, 'utf-8');
    expect(content).not.toMatch(/import\s+Layout\s+from/);
  });

  it('should still fetch /plugins on mount', () => {
    const content = readFileSync(pagePath, 'utf-8');
    expect(content).toContain('/plugins');
    expect(content).toContain('fetch');
  });

  it('should still connect to WebSocket for live updates', () => {
    const content = readFileSync(pagePath, 'utf-8');
    expect(content).toContain('WebSocket');
  });

  it('should still handle layout_change messages', () => {
    const content = readFileSync(pagePath, 'utf-8');
    expect(content).toContain('layout_change');
  });

  it('should still handle plugin_data messages via dataBusStore', () => {
    const content = readFileSync(pagePath, 'utf-8');
    expect(content).toContain('plugin_data');
    expect(content).toContain('handlePluginData');
  });

  it('should pass plugins array to DashboardGrid', () => {
    const content = readFileSync(pagePath, 'utf-8');
    expect(content).toContain('plugins');
  });

  it('should still have svelte:head with viewport meta', () => {
    const content = readFileSync(pagePath, 'utf-8');
    expect(content).toContain('svelte:head');
    expect(content).toContain('viewport');
  });

  it('should still have admin link', () => {
    const content = readFileSync(pagePath, 'utf-8');
    expect(content).toContain('/admin');
    expect(content).toContain('admin-link');
  });

  it('should import onMount from svelte', () => {
    const content = readFileSync(pagePath, 'utf-8');
    expect(content).toContain('onMount');
  });

  it('should import handlePluginData from dataBusStore', () => {
    const content = readFileSync(pagePath, 'utf-8');
    expect(content).toContain('handlePluginData');
    expect(content).toContain('dataBusStore');
  });
});

describe('GridStackAdapter Component', () => {
  const adapterPath = join(__dirname, '../src/lib/grid/GridStackAdapter.svelte');

  it('should have GridStackAdapter.svelte file', () => {
    expect(existsSync(adapterPath)).toBe(true);
  });

  it('should use Svelte 5 runes syntax', () => {
    const source = readFileSync(adapterPath, 'utf-8');
    expect(source).toContain('$props');
  });

  it('should accept items, editMode, and options props', () => {
    const source = readFileSync(adapterPath, 'utf-8');
    expect(source).toContain('items');
    expect(source).toContain('editMode');
    expect(source).toContain('options');
  });

  it('should accept onchange callback', () => {
    const source = readFileSync(adapterPath, 'utf-8');
    expect(source).toContain('onchange');
  });

  it('should render grid-stack container', () => {
    const source = readFileSync(adapterPath, 'utf-8');
    expect(source).toContain('grid-stack');
  });

  it('should render gs-item elements for each widget', () => {
    const source = readFileSync(adapterPath, 'utf-8');
    // Should reference gs- attributes or grid-stack item rendering
    expect(source).toMatch(/gs-|grid-stack-item/);
  });
});

describe('Grid Layout CSS', () => {
  const cssPath = join(__dirname, '../src/lib/styles/grid-layout.css');

  it('should have grid-layout.css file', () => {
    expect(existsSync(cssPath)).toBe(true);
  });

  it('should style grid-stack containers', () => {
    const content = readFileSync(cssPath, 'utf-8');
    expect(content).toContain('.grid-stack');
  });

  it('should style grid-stack items', () => {
    const content = readFileSync(cssPath, 'utf-8');
    expect(content).toMatch(/\.gs-item|\.grid-stack-item/);
  });

  it('should include edit mode styles', () => {
    const content = readFileSync(cssPath, 'utf-8');
    expect(content).toContain('dashboard-edit-mode');
  });

  it('should use lensing design tokens', () => {
    const content = readFileSync(cssPath, 'utf-8');
    expect(content).toContain('var(--');
  });

  it('should include resize handle styles', () => {
    const content = readFileSync(cssPath, 'utf-8');
    expect(content).toMatch(/resize|handle/i);
  });
});
