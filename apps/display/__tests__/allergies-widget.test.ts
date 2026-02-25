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

  it('should accept allergens prop (AllergenLevel[])', () => {
    const source = readFileSync(widgetPath, 'utf-8');
    expect(source).toContain('export let allergens');
  });

  it('should display the overall allergy index as a hero number', () => {
    const source = readFileSync(widgetPath, 'utf-8');
    // Should render index value prominently
    expect(source).toContain('index');
    // Should use large text styling (hero metric)
    expect(source).toMatch(/text-2xl|allergies-widget__index/);
  });

  it('should have a visual gauge/bar for overall index', () => {
    const source = readFileSync(widgetPath, 'utf-8');
    // Should have a gauge element with dynamic width based on index
    expect(source).toMatch(/allergies-widget__gauge|allergies-widget__bar/);
  });

  it('should show empty state when no allergens provided', () => {
    const source = readFileSync(widgetPath, 'utf-8');
    // Should handle empty allergens array
    expect(source).toMatch(/allergens\.length\s*===?\s*0|allergens\.length|No allergy/i);
  });

  it('should list individual allergens with name and level', () => {
    const source = readFileSync(widgetPath, 'utf-8');
    // Should iterate over allergens
    expect(source).toMatch(/{#each allergens/);
    // Should display allergen name and level
    expect(source).toMatch(/\.name/);
    expect(source).toMatch(/\.level/);
  });

  it('should display allergen category', () => {
    const source = readFileSync(widgetPath, 'utf-8');
    expect(source).toMatch(/\.category/);
  });

  it('should use lensing design system tokens for styling', () => {
    const source = readFileSync(widgetPath, 'utf-8');
    // Should use design system CSS variables
    expect(source).toContain('--event-horizon');
    expect(source).toContain('--edge');
    expect(source).toContain('--starlight');
  });

  it('should color-code the gauge based on severity', () => {
    const source = readFileSync(widgetPath, 'utf-8');
    // Should reference alert colors for severity levels
    expect(source).toMatch(/alert-success|alert-warning|alert-urgent/);
  });

  it('should have a label showing the severity text', () => {
    const source = readFileSync(widgetPath, 'utf-8');
    // Should map index to severity label (Low, Moderate, High, etc.)
    expect(source).toMatch(/Low|Moderate|High|Very High|None/i);
  });
});
