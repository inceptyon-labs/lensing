/**
 * Tests for Mobile layout and touch support (lensing-vyx3):
 * - mobile-config.ts: touch constants, mobile detection, responsive helpers
 * - types.ts: touchDelay and moveTolerance fields in GridPolicy
 * - grid-layout.css: mobile breakpoint, touch targets, corner-only handles
 * - GridStackAdapter.svelte: touch options wired in
 */

import { describe, it, expect } from 'vitest';
import { readFileSync, existsSync } from 'fs';
import { join } from 'path';

// ─── mobile-config.ts ─────────────────────────────────────────────────────────

describe('mobile-config', () => {
  const configPath = join(__dirname, '../src/lib/grid/mobile-config.ts');

  it('should have mobile-config.ts file', () => {
    expect(existsSync(configPath)).toBe(true);
  });

  it('should export TOUCH_DELAY constant (200ms)', async () => {
    const mod = await import('../src/lib/grid/mobile-config');
    expect(mod.TOUCH_DELAY).toBe(200);
  });

  it('should export MOVE_TOLERANCE constant (5px)', async () => {
    const mod = await import('../src/lib/grid/mobile-config');
    expect(mod.MOVE_TOLERANCE).toBe(5);
  });

  it('should export MOBILE_BREAKPOINT constant (768px)', async () => {
    const mod = await import('../src/lib/grid/mobile-config');
    expect(mod.MOBILE_BREAKPOINT).toBe(768);
  });

  it('should export MOBILE_COLUMNS constant (4)', async () => {
    const mod = await import('../src/lib/grid/mobile-config');
    expect(mod.MOBILE_COLUMNS).toBe(4);
  });

  it('should export TOUCH_TARGET_MIN constant (44px)', async () => {
    const mod = await import('../src/lib/grid/mobile-config');
    expect(mod.TOUCH_TARGET_MIN).toBe(44);
  });

  it('should export MOBILE_ROW_HEIGHT constant', async () => {
    const mod = await import('../src/lib/grid/mobile-config');
    expect(typeof mod.MOBILE_ROW_HEIGHT).toBe('number');
    expect(mod.MOBILE_ROW_HEIGHT).toBeGreaterThanOrEqual(40);
  });

  it('should export MOBILE_RESIZE_HANDLES (corner-only)', async () => {
    const mod = await import('../src/lib/grid/mobile-config');
    expect(mod.MOBILE_RESIZE_HANDLES).toEqual(['se', 'sw']);
  });

  it('should export isMobileViewport function', async () => {
    const mod = await import('../src/lib/grid/mobile-config');
    expect(typeof mod.isMobileViewport).toBe('function');
  });

  it('should export getMobileGridPolicy function', async () => {
    const mod = await import('../src/lib/grid/mobile-config');
    expect(typeof mod.getMobileGridPolicy).toBe('function');
  });

  it('getMobileGridPolicy should return policy with 4 columns', async () => {
    const mod = await import('../src/lib/grid/mobile-config');
    const policy = mod.getMobileGridPolicy();
    expect(policy.columns).toBe(4);
  });

  it('getMobileGridPolicy should return policy with corner-only handles', async () => {
    const mod = await import('../src/lib/grid/mobile-config');
    const policy = mod.getMobileGridPolicy();
    expect(policy.resizeHandles).toEqual(['se', 'sw']);
  });

  it('getMobileGridPolicy should include touchDelay', async () => {
    const mod = await import('../src/lib/grid/mobile-config');
    const policy = mod.getMobileGridPolicy();
    expect(policy.touchDelay).toBe(200);
  });

  it('getMobileGridPolicy should include moveTolerance', async () => {
    const mod = await import('../src/lib/grid/mobile-config');
    const policy = mod.getMobileGridPolicy();
    expect(policy.moveTolerance).toBe(5);
  });
});

// ─── types.ts updates ─────────────────────────────────────────────────────────

describe('GridPolicy touch fields', () => {
  const typesPath = join(__dirname, '../src/lib/grid/types.ts');

  it('should have touchDelay field in GridPolicy', () => {
    const source = readFileSync(typesPath, 'utf-8');
    expect(source).toContain('touchDelay');
  });

  it('should have moveTolerance field in GridPolicy', () => {
    const source = readFileSync(typesPath, 'utf-8');
    expect(source).toContain('moveTolerance');
  });
});

// ─── grid-layout.css mobile breakpoint ────────────────────────────────────────

describe('grid-layout.css mobile styles', () => {
  const cssPath = join(__dirname, '../src/lib/styles/grid-layout.css');

  it('should have a mobile breakpoint media query', () => {
    const source = readFileSync(cssPath, 'utf-8');
    expect(source).toMatch(/@media.*max-width.*768px/);
  });

  it('should set 44px minimum touch target size on mobile', () => {
    const source = readFileSync(cssPath, 'utf-8');
    expect(source).toContain('44px');
  });

  it('should hide edge handles on mobile (corner-only)', () => {
    const source = readFileSync(cssPath, 'utf-8');
    // Edge handles (n, s, e, w) should be hidden on mobile
    expect(source).toMatch(/ui-resizable-[nsew][^a-z].*display:\s*none/s);
  });

  it('should enlarge corner handles on mobile for touch', () => {
    const source = readFileSync(cssPath, 'utf-8');
    // Corner handles should be larger on mobile (at least 44px)
    const mobileSection = source.slice(source.indexOf('@media'));
    expect(mobileSection).toMatch(/ui-resizable-se|ui-resizable-sw/);
  });

  it('should have mobile-specific grid margin/spacing', () => {
    const source = readFileSync(cssPath, 'utf-8');
    const mobileSection = source.slice(source.indexOf('@media'));
    // Should adjust spacing for mobile
    expect(mobileSection).toMatch(/margin|padding|gap/);
  });
});

// ─── GridStackAdapter.svelte touch wiring ─────────────────────────────────────

describe('GridStackAdapter touch support', () => {
  const adapterPath = join(__dirname, '../src/lib/grid/GridStackAdapter.svelte');

  it('should import mobile config', () => {
    const source = readFileSync(adapterPath, 'utf-8');
    expect(source).toContain('mobile-config');
  });

  it('should wire touchDelay into GridStack init options', () => {
    const source = readFileSync(adapterPath, 'utf-8');
    // GridStack option: draggable.touchDelay or touchDelay
    expect(source).toMatch(/touchDelay|touch_delay/i);
  });

  it('should wire moveTolerance into GridStack init options', () => {
    const source = readFileSync(adapterPath, 'utf-8');
    expect(source).toMatch(/moveTolerance|move_tolerance/i);
  });

  it('should handle responsive column count', () => {
    const source = readFileSync(adapterPath, 'utf-8');
    // Should reference mobile columns or responsive logic
    expect(source).toMatch(/MOBILE_COLUMNS|isMobileViewport|responsiveColumn/i);
  });
});
