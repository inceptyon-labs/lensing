import { describe, it, expect } from 'vitest';
import { readFileSync, existsSync } from 'fs';
import { join } from 'path';

describe('AllergiesWidget Component', () => {
  const widgetPath = join(__dirname, '../src/lib/AllergiesWidget.svelte');

  it('should have AllergiesWidget.svelte file', () => {
    expect(existsSync(widgetPath)).toBe(true);
  });

  it('should accept index prop (number)', () => {
    const source = readFileSync(widgetPath, 'utf-8');
    expect(source).toContain('export let index');
  });

  it('should accept level prop (string)', () => {
    const source = readFileSync(widgetPath, 'utf-8');
    expect(source).toContain('export let level');
  });

  it('should accept color prop (string)', () => {
    const source = readFileSync(widgetPath, 'utf-8');
    expect(source).toContain('export let color');
  });

  it('should accept triggers prop (PollenTrigger[])', () => {
    const source = readFileSync(widgetPath, 'utf-8');
    expect(source).toContain('export let triggers');
  });

  it('should accept periods prop (PollenPeriod[])', () => {
    const source = readFileSync(widgetPath, 'utf-8');
    expect(source).toContain('export let periods');
  });

  it('should display the pollen index as a hero number', () => {
    const source = readFileSync(widgetPath, 'utf-8');
    expect(source).toContain('index');
    expect(source).toMatch(/text-2xl|allergies-widget__index/);
  });

  it('should show scale as /12', () => {
    const source = readFileSync(widgetPath, 'utf-8');
    expect(source).toContain('/12');
  });

  it('should have a visual gauge/bar for overall index', () => {
    const source = readFileSync(widgetPath, 'utf-8');
    expect(source).toMatch(/allergies-widget__gauge|allergies-widget__bar/);
  });

  it('should show empty state when no periods provided', () => {
    const source = readFileSync(widgetPath, 'utf-8');
    expect(source).toMatch(/periods\.length|No pollen/i);
  });

  it('should display trigger allergens with plant type', () => {
    const source = readFileSync(widgetPath, 'utf-8');
    expect(source).toMatch(/{#each triggers/);
    expect(source).toMatch(/\.name/);
    expect(source).toMatch(/\.plantType/);
  });

  it('should display forecast periods', () => {
    const source = readFileSync(widgetPath, 'utf-8');
    expect(source).toMatch(/{#each periods/);
  });

  it('should use lensing design system tokens for styling', () => {
    const source = readFileSync(widgetPath, 'utf-8');
    expect(source).toContain('--event-horizon');
    expect(source).toContain('--edge');
    expect(source).toContain('--starlight');
  });

  it('should color-code based on severity', () => {
    const source = readFileSync(widgetPath, 'utf-8');
    // Should use the color prop for dynamic coloring
    expect(source).toContain('{color}');
  });

  it('should display severity level label', () => {
    const source = readFileSync(widgetPath, 'utf-8');
    expect(source).toContain('{level}');
  });
});
