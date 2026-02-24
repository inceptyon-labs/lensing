import { describe, it, expect } from 'vitest';
import { readFileSync } from 'fs';
import { join } from 'path';

const componentPath = join(__dirname, '../src/lib/CryptoWidget.svelte');
const source = readFileSync(componentPath, 'utf-8');

describe('CryptoWidget Svelte Component', () => {
  it('should exist as a Svelte file', () => {
    expect(source).toBeTruthy();
    expect(source.length).toBeGreaterThan(0);
  });

  it('should accept coins prop (CoinPrice[])', () => {
    expect(source).toContain('coins');
  });

  it('should accept compact mode prop', () => {
    expect(source).toContain('compact');
  });

  it('should use design system surface token for background', () => {
    expect(source).toContain('--event-horizon');
  });

  it('should use design system border token', () => {
    expect(source).toContain('--edge');
  });

  it('should use design system radius token', () => {
    expect(source).toContain('--radius-md');
  });

  it('should use starlight for primary text color', () => {
    expect(source).toContain('--starlight');
  });

  it('should use ember color for positive changes (green)', () => {
    expect(source).toContain('--alert-success');
  });

  it('should use alert-urgent for negative changes (red)', () => {
    expect(source).toContain('--alert-urgent');
  });

  it('should handle empty coins state', () => {
    expect(source).toContain('No crypto');
  });

  it('should display coin symbols in uppercase', () => {
    expect(source).toContain('symbol');
    expect(source).toContain('uppercase');
  });

  it('should use tabular-nums font variant for price alignment', () => {
    expect(source).toContain('tabular-nums');
  });

  it('should respect minimum text size (no --text-xs)', () => {
    expect(source).not.toContain('--text-xs');
    expect(source).toMatch(/--text-sm|--text-base|--text-lg/);
  });

  it('should support compact mode layout', () => {
    expect(source).toContain('compact');
  });
});
