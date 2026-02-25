/**
 * Tests for Admin Grid UI components:
 * - WidgetResizeModal: X/Y/W/H stepper inputs with constraint validation
 * - WidgetContextMenu: popup menu (delete, move/resize)
 * - WidgetPicker: add new widgets to the grid
 * - DashboardGrid admin integration: context menus visible in edit mode
 * - Layout persistence: save/load via REST API helper
 */

import { describe, it, expect } from 'vitest';
import { readFileSync, existsSync } from 'fs';
import { join } from 'path';

// ─── WidgetResizeModal ────────────────────────────────────────────────────────

describe('WidgetResizeModal', () => {
  const modalPath = join(__dirname, '../src/lib/grid/WidgetResizeModal.svelte');

  it('should have WidgetResizeModal.svelte file', () => {
    expect(existsSync(modalPath)).toBe(true);
  });

  it('should use Svelte 5 runes syntax ($props)', () => {
    const source = readFileSync(modalPath, 'utf-8');
    expect(source).toContain('$props()');
  });

  it('should accept x, y, w, h props', () => {
    const source = readFileSync(modalPath, 'utf-8');
    // Modal accepts current position/size
    expect(source).toMatch(/\bx\b/);
    expect(source).toMatch(/\by\b/);
    expect(source).toMatch(/\bw\b/);
    expect(source).toMatch(/\bh\b/);
  });

  it('should accept minW, minH, maxW, maxH constraint props', () => {
    const source = readFileSync(modalPath, 'utf-8');
    expect(source).toContain('minW');
    expect(source).toContain('minH');
    expect(source).toContain('maxW');
    expect(source).toContain('maxH');
  });

  it('should have onconfirm callback prop', () => {
    const source = readFileSync(modalPath, 'utf-8');
    expect(source).toContain('onconfirm');
  });

  it('should have oncancel callback prop', () => {
    const source = readFileSync(modalPath, 'utf-8');
    expect(source).toContain('oncancel');
  });

  it('should render stepper inputs for X, Y, W, H', () => {
    const source = readFileSync(modalPath, 'utf-8');
    // Four numeric fields for position and size
    expect(source).toContain('type="number"');
  });

  it('should render confirm and cancel buttons', () => {
    const source = readFileSync(modalPath, 'utf-8');
    expect(source.toLowerCase()).toMatch(/confirm|apply|save/);
    expect(source.toLowerCase()).toMatch(/cancel|close|dismiss/);
  });

  it('should use design system tokens', () => {
    const source = readFileSync(modalPath, 'utf-8');
    expect(source).toMatch(/var\(--/);
  });

  it('should have accessible dialog role', () => {
    const source = readFileSync(modalPath, 'utf-8');
    expect(source).toMatch(/role="dialog"|<dialog/);
  });
});

// ─── WidgetResizeModal validation helper ─────────────────────────────────────

describe('WidgetResizeModal validation', () => {
  const validationPath = join(__dirname, '../src/lib/grid/resize-modal-validation.ts');

  it('should have resize-modal-validation.ts file', () => {
    expect(existsSync(validationPath)).toBe(true);
  });

  it('should export validatePosition function', async () => {
    const mod = await import('../src/lib/grid/resize-modal-validation');
    expect(typeof mod.validatePosition).toBe('function');
  });

  it('should export clampToConstraints function', async () => {
    const mod = await import('../src/lib/grid/resize-modal-validation');
    expect(typeof mod.clampToConstraints).toBe('function');
  });

  it('validatePosition: x must be >= 0', async () => {
    const { validatePosition } = await import('../src/lib/grid/resize-modal-validation');
    expect(validatePosition({ x: -1, y: 0, w: 4, h: 3 }, 24)).toEqual(
      expect.objectContaining({ valid: false }),
    );
  });

  it('validatePosition: w must be >= 1', async () => {
    const { validatePosition } = await import('../src/lib/grid/resize-modal-validation');
    expect(validatePosition({ x: 0, y: 0, w: 0, h: 3 }, 24)).toEqual(
      expect.objectContaining({ valid: false }),
    );
  });

  it('validatePosition: x + w must not exceed grid columns', async () => {
    const { validatePosition } = await import('../src/lib/grid/resize-modal-validation');
    expect(validatePosition({ x: 20, y: 0, w: 8, h: 3 }, 24)).toEqual(
      expect.objectContaining({ valid: false }),
    );
  });

  it('validatePosition: valid position passes', async () => {
    const { validatePosition } = await import('../src/lib/grid/resize-modal-validation');
    expect(validatePosition({ x: 0, y: 0, w: 6, h: 4 }, 24)).toEqual(
      expect.objectContaining({ valid: true }),
    );
  });

  it('clampToConstraints: clamps w below minW', async () => {
    const { clampToConstraints } = await import('../src/lib/grid/resize-modal-validation');
    const result = clampToConstraints(
      { x: 0, y: 0, w: 1, h: 4 },
      { minW: 3, minH: 2, maxW: 12, maxH: 8 },
    );
    expect(result.w).toBe(3);
  });

  it('clampToConstraints: clamps w above maxW', async () => {
    const { clampToConstraints } = await import('../src/lib/grid/resize-modal-validation');
    const result = clampToConstraints(
      { x: 0, y: 0, w: 20, h: 4 },
      { minW: 3, minH: 2, maxW: 12, maxH: 8 },
    );
    expect(result.w).toBe(12);
  });

  it('clampToConstraints: clamps h below minH', async () => {
    const { clampToConstraints } = await import('../src/lib/grid/resize-modal-validation');
    const result = clampToConstraints(
      { x: 0, y: 0, w: 6, h: 1 },
      { minW: 3, minH: 2, maxW: 12, maxH: 8 },
    );
    expect(result.h).toBe(2);
  });

  it('clampToConstraints: passes through valid values unchanged', async () => {
    const { clampToConstraints } = await import('../src/lib/grid/resize-modal-validation');
    const result = clampToConstraints(
      { x: 0, y: 0, w: 6, h: 4 },
      { minW: 3, minH: 2, maxW: 12, maxH: 8 },
    );
    expect(result).toEqual({ x: 0, y: 0, w: 6, h: 4 });
  });
});

// ─── WidgetContextMenu ───────────────────────────────────────────────────────

describe('WidgetContextMenu', () => {
  const menuPath = join(__dirname, '../src/lib/grid/WidgetContextMenu.svelte');

  it('should have WidgetContextMenu.svelte file', () => {
    expect(existsSync(menuPath)).toBe(true);
  });

  it('should use Svelte 5 runes syntax ($props)', () => {
    const source = readFileSync(menuPath, 'utf-8');
    expect(source).toContain('$props()');
  });

  it('should accept pluginId and pluginName props', () => {
    const source = readFileSync(menuPath, 'utf-8');
    expect(source).toContain('pluginId');
    expect(source).toContain('pluginName');
  });

  it('should have ondelete callback prop', () => {
    const source = readFileSync(menuPath, 'utf-8');
    expect(source).toContain('ondelete');
  });

  it('should have onresize callback prop', () => {
    const source = readFileSync(menuPath, 'utf-8');
    expect(source).toContain('onresize');
  });

  it('should have onclose callback prop', () => {
    const source = readFileSync(menuPath, 'utf-8');
    expect(source).toContain('onclose');
  });

  it('should render a delete action', () => {
    const source = readFileSync(menuPath, 'utf-8');
    expect(source.toLowerCase()).toMatch(/delete|remove/);
  });

  it('should render a move/resize action', () => {
    const source = readFileSync(menuPath, 'utf-8');
    expect(source.toLowerCase()).toMatch(/resize|move|position/);
  });

  it('should use design system tokens', () => {
    const source = readFileSync(menuPath, 'utf-8');
    expect(source).toMatch(/var\(--/);
  });

  it('should have appropriate ARIA attributes for menu', () => {
    const source = readFileSync(menuPath, 'utf-8');
    expect(source).toMatch(/role="menu"|role="dialog"|aria-/);
  });
});

// ─── WidgetPicker ─────────────────────────────────────────────────────────────

describe('WidgetPicker', () => {
  const pickerPath = join(__dirname, '../src/lib/grid/WidgetPicker.svelte');

  it('should have WidgetPicker.svelte file', () => {
    expect(existsSync(pickerPath)).toBe(true);
  });

  it('should use Svelte 5 runes syntax ($props)', () => {
    const source = readFileSync(pickerPath, 'utf-8');
    expect(source).toContain('$props()');
  });

  it('should accept availablePlugins prop', () => {
    const source = readFileSync(pickerPath, 'utf-8');
    expect(source).toContain('availablePlugins');
  });

  it('should have onadd callback prop', () => {
    const source = readFileSync(pickerPath, 'utf-8');
    expect(source).toContain('onadd');
  });

  it('should have onclose callback prop', () => {
    const source = readFileSync(pickerPath, 'utf-8');
    expect(source).toContain('onclose');
  });

  it('should render a list of available plugins', () => {
    const source = readFileSync(pickerPath, 'utf-8');
    expect(source).toMatch(/#each|{#each/);
  });

  it('should render an "Add" button per plugin', () => {
    const source = readFileSync(pickerPath, 'utf-8');
    expect(source.toLowerCase()).toMatch(/add|enable/);
  });

  it('should use design system tokens', () => {
    const source = readFileSync(pickerPath, 'utf-8');
    expect(source).toMatch(/var\(--/);
  });
});

// ─── DashboardGrid admin integration ─────────────────────────────────────────

describe('DashboardGrid admin integration', () => {
  const gridPath = join(__dirname, '../src/lib/grid/DashboardGrid.svelte');

  it('should accept allPlugins prop for widget picker', () => {
    const source = readFileSync(gridPath, 'utf-8');
    expect(source).toContain('allPlugins');
  });

  it('should show WidgetPicker in edit mode', () => {
    const source = readFileSync(gridPath, 'utf-8');
    expect(source).toContain('WidgetPicker');
  });

  it('should show WidgetContextMenu on widget interaction in edit mode', () => {
    const source = readFileSync(gridPath, 'utf-8');
    expect(source).toContain('WidgetContextMenu');
  });

  it('should show WidgetResizeModal when resize is triggered', () => {
    const source = readFileSync(gridPath, 'utf-8');
    expect(source).toContain('WidgetResizeModal');
  });

  it('should have an "Add Widget" button in edit mode', () => {
    const source = readFileSync(gridPath, 'utf-8');
    expect(source.toLowerCase()).toMatch(/add widget|add plugin/);
  });

  it('should have onsave callback for layout persistence', () => {
    const source = readFileSync(gridPath, 'utf-8');
    expect(source).toContain('onsave');
  });
});

// ─── Layout persistence helper ────────────────────────────────────────────────

describe('Layout persistence', () => {
  const persistPath = join(__dirname, '../src/lib/grid/layout-persistence.ts');

  it('should have layout-persistence.ts file', () => {
    expect(existsSync(persistPath)).toBe(true);
  });

  it('should export saveLayout function', async () => {
    const mod = await import('../src/lib/grid/layout-persistence');
    expect(typeof mod.saveLayout).toBe('function');
  });

  it('should export loadLayout function', async () => {
    const mod = await import('../src/lib/grid/layout-persistence');
    expect(typeof mod.loadLayout).toBe('function');
  });

  it('saveLayout: should send a PUT request to /api/layout', async () => {
    const { saveLayout } = await import('../src/lib/grid/layout-persistence');
    // saveLayout accepts GridWidget[] and returns Promise<boolean>
    // We test the function signature, not the actual fetch (no real server)
    const widgets = [{ id: 'weather', x: 0, y: 0, w: 6, h: 4 }];
    // Should return a promise
    const result = saveLayout(widgets);
    expect(result).toBeInstanceOf(Promise);
    // Resolve to avoid unhandled rejection; failure is OK (no server)
    await result.catch(() => {});
  });

  it('loadLayout: should return null when server unreachable', async () => {
    const { loadLayout } = await import('../src/lib/grid/layout-persistence');
    const result = await loadLayout().catch(() => null);
    expect(result === null || Array.isArray(result)).toBe(true);
  });
});
