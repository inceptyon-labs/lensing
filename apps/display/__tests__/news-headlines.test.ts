import { describe, it, expect } from 'vitest';
import { readFileSync } from 'fs';
import { join } from 'path';

const componentPath = join(__dirname, '../src/lib/NewsHeadlines.svelte');
const source = readFileSync(componentPath, 'utf-8');

describe('NewsHeadlines Svelte Component', () => {
  it('should exist as a Svelte file', () => {
    expect(source).toBeTruthy();
    expect(source.length).toBeGreaterThan(0);
  });

  it('should have script block with onMount and onDestroy', () => {
    expect(source).toContain('onMount');
    expect(source).toContain('onDestroy');
  });

  it('should accept headlines prop', () => {
    expect(source).toContain('headlines');
  });

  it('should accept maxItems prop', () => {
    expect(source).toContain('maxItems');
  });

  it('should support compact mode', () => {
    expect(source).toContain('compact');
  });

  it('should use design system surface token for background', () => {
    expect(source).toContain('--event-horizon');
  });

  it('should use design system text tokens', () => {
    expect(source).toContain('--starlight');
    expect(source).toContain('--dim-light');
  });

  it('should use ember accent for categories', () => {
    expect(source).toContain('--ember');
  });

  it('should handle empty headlines state', () => {
    expect(source).toContain('No headlines');
  });

  it('should use minimum text size for kiosk legibility', () => {
    // Must not use anything smaller than --text-sm (14px)
    expect(source).toMatch(/--text-sm|--text-base|--text-lg|--text-xl|--text-2xl/);
    expect(source).not.toContain('--text-xs');
  });
});
