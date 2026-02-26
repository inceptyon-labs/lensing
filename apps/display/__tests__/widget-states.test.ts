import { describe, it, expect } from 'vitest';
import { readFileSync } from 'fs';
import { join } from 'path';

// ── Acceptance Criteria ────────────────────────────────────────────────────
// - Widgets show 'Not Configured' state when integration is missing
// - Config panel shows only widget-category fields
// - Integration status banner with 'Go to Settings' link
// - Widgets that need no integration work immediately with defaults

describe('Widget States: Not Configured overlay (lensing-0htp)', () => {
  const pluginRendererPath = join(__dirname, '../src/lib/PluginRenderer.svelte');

  it('should show "Not Configured" state when integration_status is missing', () => {
    // PluginRenderer or DashboardGrid should render a "Not Configured" overlay
    // when plugin.integration_status === 'missing'
    const source = readFileSync(pluginRendererPath, 'utf-8');
    expect(source).toContain('integration_status');
    expect(source).toMatch(/[Nn]ot [Cc]onfigured|not-configured|notConfigured/);
  });

  it('should check integration_status === missing to show unconfigured state', () => {
    const source = readFileSync(pluginRendererPath, 'utf-8');
    expect(source).toMatch(/integration_status.*missing|missing.*integration_status/);
  });

  it('should show "Go to Settings" link in not-configured state', () => {
    const source = readFileSync(pluginRendererPath, 'utf-8');
    expect(source).toMatch(/[Gg]o to [Ss]ettings|go-to-settings|\/admin/);
  });

  it('should render widgets with not_needed integration_status normally (no overlay)', () => {
    // Widgets that don't need integration should display normally (no overlay check)
    const source = readFileSync(pluginRendererPath, 'utf-8');
    // Should only show overlay for 'missing', not 'not_needed'
    expect(source).toMatch(/missing/);
    // NOT showing overlay for all statuses
    expect(source).not.toMatch(/not_needed.*[Nn]ot [Cc]onfigured/);
  });
});

describe('Widget Config Panel: Only widget fields (lensing-0htp)', () => {
  const panelPath = join(__dirname, '../src/lib/grid/WidgetConfigPanel.svelte');

  it('should import getWidgetFields from @lensing/types', () => {
    const source = readFileSync(panelPath, 'utf-8');
    expect(source).toContain('getWidgetFields');
  });

  it('should filter fields to only widget-category fields', () => {
    // Config panel should only show fields with category === 'widget'
    // Should use getWidgetFields() helper or filter by category
    const source = readFileSync(panelPath, 'utf-8');
    expect(source).toMatch(/getWidgetFields|category.*widget|widget.*category/);
  });

  it('should show integration status banner', () => {
    const source = readFileSync(panelPath, 'utf-8');
    expect(source).toContain('integration_status');
  });

  it('should show "Go to Settings" link in integration status banner', () => {
    const source = readFileSync(panelPath, 'utf-8');
    expect(source).toMatch(/[Gg]o to [Ss]ettings|\/admin/);
  });

  it('should show different banner state for missing vs ready vs not_needed', () => {
    const source = readFileSync(panelPath, 'utf-8');
    expect(source).toContain('missing');
    expect(source).toContain('ready');
  });

  it('should show integration status section with visual distinction', () => {
    const source = readFileSync(panelPath, 'utf-8');
    // Should have an integration section or banner that is visually distinct
    expect(source).toMatch(/integration-banner|integration-status|class.*integration/i);
  });
});

describe('PluginRenderer integration status display (lensing-0htp)', () => {
  const pluginRendererPath = join(__dirname, '../src/lib/PluginRenderer.svelte');

  it('should accept integration_status from plugin prop', () => {
    const source = readFileSync(pluginRendererPath, 'utf-8');
    expect(source).toContain('integration_status');
  });

  it('should display not-configured overlay above widget content when missing', () => {
    const source = readFileSync(pluginRendererPath, 'utf-8');
    // Should overlay the widget, not replace it entirely
    expect(source).toMatch(/overlay|not-configured/);
  });
});
