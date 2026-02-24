import { describe, it, expect } from 'vitest';
import { readFileSync, existsSync } from 'fs';
import { join } from 'path';

const componentPath = join(__dirname, '../src/lib/WeatherWidget.svelte');

describe('WeatherWidget Svelte Component', () => {
  it('should exist as a Svelte file', () => {
    expect(existsSync(componentPath)).toBe(true);
  });

  it('should accept current prop (WeatherCurrent)', () => {
    const source = readFileSync(componentPath, 'utf-8');
    expect(source).toContain('current');
  });

  it('should accept forecast prop (WeatherForecastDay[])', () => {
    const source = readFileSync(componentPath, 'utf-8');
    expect(source).toContain('forecast');
  });

  it('should accept compact mode prop', () => {
    const source = readFileSync(componentPath, 'utf-8');
    expect(source).toContain('compact');
  });

  it('should use design system surface token for background', () => {
    const source = readFileSync(componentPath, 'utf-8');
    expect(source).toContain('--event-horizon');
  });

  it('should use design system border token', () => {
    const source = readFileSync(componentPath, 'utf-8');
    expect(source).toContain('--edge');
  });

  it('should use design system radius token', () => {
    const source = readFileSync(componentPath, 'utf-8');
    expect(source).toContain('--radius-md');
  });

  it('should use starlight for primary text color', () => {
    const source = readFileSync(componentPath, 'utf-8');
    expect(source).toContain('--starlight');
  });

  it('should use dim-light for secondary text', () => {
    const source = readFileSync(componentPath, 'utf-8');
    expect(source).toContain('--dim-light');
  });

  it('should handle empty/null current state', () => {
    const source = readFileSync(componentPath, 'utf-8');
    expect(source).toContain('No weather');
  });

  it('should display temperature prominently with large text', () => {
    const source = readFileSync(componentPath, 'utf-8');
    // Should use --text-2xl or --text-3xl for hero temperature
    expect(source).toMatch(/--text-2xl|--text-3xl/);
  });

  it('should display conditions description', () => {
    const source = readFileSync(componentPath, 'utf-8');
    expect(source).toContain('conditions');
  });

  it('should display feels like temperature', () => {
    const source = readFileSync(componentPath, 'utf-8');
    expect(source).toContain('feelsLike');
  });

  it('should display humidity', () => {
    const source = readFileSync(componentPath, 'utf-8');
    expect(source).toContain('humidity');
  });

  it('should display forecast with high/low temps', () => {
    const source = readFileSync(componentPath, 'utf-8');
    expect(source).toContain('high');
    expect(source).toContain('low');
  });

  it('should use tabular-nums for number alignment', () => {
    const source = readFileSync(componentPath, 'utf-8');
    expect(source).toContain('tabular-nums');
  });

  it('should support compact mode layout', () => {
    const source = readFileSync(componentPath, 'utf-8');
    expect(source).toContain('compact');
    expect(source).toContain('weather-widget--compact');
  });

  it('should respect minimum text size (no --text-xs)', () => {
    const source = readFileSync(componentPath, 'utf-8');
    expect(source).not.toContain('--text-xs');
    expect(source).toMatch(/--text-sm|--text-base|--text-lg/);
  });
});
