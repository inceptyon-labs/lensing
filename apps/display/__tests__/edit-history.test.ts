/**
 * Tests for edit-history.ts — undo/redo history stack for grid editing.
 * Also tests EditBar.svelte file existence and DashboardGrid integration.
 */

import { describe, it, expect } from 'vitest';
import { readFileSync, existsSync } from 'fs';
import { join } from 'path';

// ─── edit-history.ts (pure logic) ─────────────────────────────────────────────

describe('edit-history', () => {
  const historyPath = join(__dirname, '../src/lib/grid/edit-history.ts');

  it('should have edit-history.ts file', () => {
    expect(existsSync(historyPath)).toBe(true);
  });

  it('should export createEditHistory function', async () => {
    const mod = await import('../src/lib/grid/edit-history');
    expect(typeof mod.createEditHistory).toBe('function');
  });

  it('should start with no history (canUndo = false)', async () => {
    const { createEditHistory } = await import('../src/lib/grid/edit-history');
    const history = createEditHistory([{ id: 'a', x: 0, y: 0, w: 4, h: 3 }]);
    expect(history.canUndo()).toBe(false);
  });

  it('should start with canRedo = false', async () => {
    const { createEditHistory } = await import('../src/lib/grid/edit-history');
    const history = createEditHistory([{ id: 'a', x: 0, y: 0, w: 4, h: 3 }]);
    expect(history.canRedo()).toBe(false);
  });

  it('should start as not dirty', async () => {
    const { createEditHistory } = await import('../src/lib/grid/edit-history');
    const history = createEditHistory([{ id: 'a', x: 0, y: 0, w: 4, h: 3 }]);
    expect(history.isDirty()).toBe(false);
  });

  it('pushState should enable undo', async () => {
    const { createEditHistory } = await import('../src/lib/grid/edit-history');
    const history = createEditHistory([{ id: 'a', x: 0, y: 0, w: 4, h: 3 }]);
    history.pushState([{ id: 'a', x: 1, y: 0, w: 4, h: 3 }]);
    expect(history.canUndo()).toBe(true);
  });

  it('pushState should mark as dirty', async () => {
    const { createEditHistory } = await import('../src/lib/grid/edit-history');
    const history = createEditHistory([{ id: 'a', x: 0, y: 0, w: 4, h: 3 }]);
    history.pushState([{ id: 'a', x: 1, y: 0, w: 4, h: 3 }]);
    expect(history.isDirty()).toBe(true);
  });

  it('undo should restore previous state', async () => {
    const { createEditHistory } = await import('../src/lib/grid/edit-history');
    const initial = [{ id: 'a', x: 0, y: 0, w: 4, h: 3 }];
    const history = createEditHistory(initial);
    history.pushState([{ id: 'a', x: 5, y: 0, w: 4, h: 3 }]);
    const restored = history.undo();
    expect(restored).toEqual(initial);
  });

  it('undo should enable redo', async () => {
    const { createEditHistory } = await import('../src/lib/grid/edit-history');
    const history = createEditHistory([{ id: 'a', x: 0, y: 0, w: 4, h: 3 }]);
    history.pushState([{ id: 'a', x: 5, y: 0, w: 4, h: 3 }]);
    history.undo();
    expect(history.canRedo()).toBe(true);
  });

  it('redo should restore undone state', async () => {
    const { createEditHistory } = await import('../src/lib/grid/edit-history');
    const moved = [{ id: 'a', x: 5, y: 0, w: 4, h: 3 }];
    const history = createEditHistory([{ id: 'a', x: 0, y: 0, w: 4, h: 3 }]);
    history.pushState(moved);
    history.undo();
    const restored = history.redo();
    expect(restored).toEqual(moved);
  });

  it('pushState after undo should clear redo stack', async () => {
    const { createEditHistory } = await import('../src/lib/grid/edit-history');
    const history = createEditHistory([{ id: 'a', x: 0, y: 0, w: 4, h: 3 }]);
    history.pushState([{ id: 'a', x: 1, y: 0, w: 4, h: 3 }]);
    history.pushState([{ id: 'a', x: 2, y: 0, w: 4, h: 3 }]);
    history.undo();
    history.pushState([{ id: 'a', x: 3, y: 0, w: 4, h: 3 }]);
    expect(history.canRedo()).toBe(false);
  });

  it('undo when nothing to undo returns current state', async () => {
    const { createEditHistory } = await import('../src/lib/grid/edit-history');
    const initial = [{ id: 'a', x: 0, y: 0, w: 4, h: 3 }];
    const history = createEditHistory(initial);
    const result = history.undo();
    expect(result).toEqual(initial);
  });

  it('redo when nothing to redo returns current state', async () => {
    const { createEditHistory } = await import('../src/lib/grid/edit-history');
    const initial = [{ id: 'a', x: 0, y: 0, w: 4, h: 3 }];
    const history = createEditHistory(initial);
    const result = history.redo();
    expect(result).toEqual(initial);
  });

  it('reset should clear all history and mark as clean', async () => {
    const { createEditHistory } = await import('../src/lib/grid/edit-history');
    const history = createEditHistory([{ id: 'a', x: 0, y: 0, w: 4, h: 3 }]);
    history.pushState([{ id: 'a', x: 1, y: 0, w: 4, h: 3 }]);
    history.pushState([{ id: 'a', x: 2, y: 0, w: 4, h: 3 }]);
    const newBase = [{ id: 'a', x: 0, y: 0, w: 6, h: 4 }];
    history.reset(newBase);
    expect(history.canUndo()).toBe(false);
    expect(history.canRedo()).toBe(false);
    expect(history.isDirty()).toBe(false);
  });

  it('getCurrent returns the current state', async () => {
    const { createEditHistory } = await import('../src/lib/grid/edit-history');
    const initial = [{ id: 'a', x: 0, y: 0, w: 4, h: 3 }];
    const history = createEditHistory(initial);
    expect(history.getCurrent()).toEqual(initial);
    const next = [{ id: 'a', x: 5, y: 0, w: 4, h: 3 }];
    history.pushState(next);
    expect(history.getCurrent()).toEqual(next);
  });

  it('should cap history at max depth (50)', async () => {
    const { createEditHistory } = await import('../src/lib/grid/edit-history');
    const history = createEditHistory([{ id: 'a', x: 0, y: 0, w: 1, h: 1 }]);
    // Push 60 states
    for (let i = 1; i <= 60; i++) {
      history.pushState([{ id: 'a', x: i, y: 0, w: 1, h: 1 }]);
    }
    // Undo 50 times (max depth) — should stop at earliest retained state
    let undoCount = 0;
    while (history.canUndo()) {
      history.undo();
      undoCount++;
    }
    expect(undoCount).toBeLessThanOrEqual(50);
  });

  it('undo back to initial state should mark not dirty', async () => {
    const { createEditHistory } = await import('../src/lib/grid/edit-history');
    const initial = [{ id: 'a', x: 0, y: 0, w: 4, h: 3 }];
    const history = createEditHistory(initial);
    history.pushState([{ id: 'a', x: 1, y: 0, w: 4, h: 3 }]);
    expect(history.isDirty()).toBe(true);
    history.undo();
    expect(history.isDirty()).toBe(false);
  });
});

// ─── EditBar.svelte ───────────────────────────────────────────────────────────

describe('EditBar', () => {
  const barPath = join(__dirname, '../src/lib/grid/EditBar.svelte');

  it('should have EditBar.svelte file', () => {
    expect(existsSync(barPath)).toBe(true);
  });

  it('should use Svelte 5 runes syntax ($props)', () => {
    const source = readFileSync(barPath, 'utf-8');
    expect(source).toContain('$props()');
  });

  it('should have onsave callback prop', () => {
    const source = readFileSync(barPath, 'utf-8');
    expect(source).toContain('onsave');
  });

  it('should have oncancel callback prop', () => {
    const source = readFileSync(barPath, 'utf-8');
    expect(source).toContain('oncancel');
  });

  it('should have onundo callback prop', () => {
    const source = readFileSync(barPath, 'utf-8');
    expect(source).toContain('onundo');
  });

  it('should have onredo callback prop', () => {
    const source = readFileSync(barPath, 'utf-8');
    expect(source).toContain('onredo');
  });

  it('should have canUndo prop', () => {
    const source = readFileSync(barPath, 'utf-8');
    expect(source).toContain('canUndo');
  });

  it('should have canRedo prop', () => {
    const source = readFileSync(barPath, 'utf-8');
    expect(source).toContain('canRedo');
  });

  it('should have dirty prop for change indicator', () => {
    const source = readFileSync(barPath, 'utf-8');
    expect(source).toContain('dirty');
  });

  it('should render Save and Cancel buttons', () => {
    const source = readFileSync(barPath, 'utf-8');
    expect(source.toLowerCase()).toMatch(/save/);
    expect(source.toLowerCase()).toMatch(/cancel/);
  });

  it('should render Undo and Redo buttons', () => {
    const source = readFileSync(barPath, 'utf-8');
    expect(source.toLowerCase()).toMatch(/undo/);
    expect(source.toLowerCase()).toMatch(/redo/);
  });

  it('should use design system tokens', () => {
    const source = readFileSync(barPath, 'utf-8');
    expect(source).toMatch(/var\(--/);
  });
});

// ─── DashboardGrid integration ────────────────────────────────────────────────

describe('DashboardGrid undo/redo integration', () => {
  const gridPath = join(__dirname, '../src/lib/grid/DashboardGrid.svelte');

  it('should import EditBar', () => {
    const source = readFileSync(gridPath, 'utf-8');
    expect(source).toContain('EditBar');
  });

  it('should import edit-history', () => {
    const source = readFileSync(gridPath, 'utf-8');
    expect(source).toContain('edit-history');
  });

  it('should have keyboard shortcut handler for undo/redo', () => {
    const source = readFileSync(gridPath, 'utf-8');
    // Should listen for Ctrl+Z / Ctrl+Shift+Z
    expect(source).toMatch(/keydown|keyboard/i);
  });

  it('should handle Escape key to cancel', () => {
    const source = readFileSync(gridPath, 'utf-8');
    expect(source).toMatch(/Escape/);
  });
});
