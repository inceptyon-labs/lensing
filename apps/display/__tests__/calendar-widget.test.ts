import { describe, it, expect } from 'vitest';
import { readFileSync, existsSync } from 'fs';
import { join } from 'path';

const componentPath = join(__dirname, '../src/lib/CalendarWidget.svelte');

describe('CalendarWidget Svelte Component', () => {
  it('should exist as a Svelte file', () => {
    expect(existsSync(componentPath)).toBe(true);
  });

  it('should accept events prop (CalendarEvent[])', () => {
    const source = readFileSync(componentPath, 'utf-8');
    expect(source).toContain('events');
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

  it('should use ember accent for day headings', () => {
    const source = readFileSync(componentPath, 'utf-8');
    expect(source).toContain('--ember');
  });

  it('should handle empty events state', () => {
    const source = readFileSync(componentPath, 'utf-8');
    expect(source).toContain('No calendar');
  });

  it('should display event title', () => {
    const source = readFileSync(componentPath, 'utf-8');
    expect(source).toContain('title');
  });

  it('should display event start time', () => {
    const source = readFileSync(componentPath, 'utf-8');
    expect(source).toContain('start');
  });

  it('should display event location when available', () => {
    const source = readFileSync(componentPath, 'utf-8');
    expect(source).toContain('location');
  });

  it('should handle all-day events', () => {
    const source = readFileSync(componentPath, 'utf-8');
    expect(source).toContain('allDay');
  });

  it('should use tabular-nums for time alignment', () => {
    const source = readFileSync(componentPath, 'utf-8');
    expect(source).toContain('tabular-nums');
  });

  it('should support compact mode layout', () => {
    const source = readFileSync(componentPath, 'utf-8');
    expect(source).toContain('compact');
    expect(source).toContain('calendar-widget--compact');
  });

  it('should respect minimum text size (no --text-xs)', () => {
    const source = readFileSync(componentPath, 'utf-8');
    expect(source).not.toContain('--text-xs');
    expect(source).toMatch(/--text-sm|--text-base|--text-lg/);
  });

  it('should group events by day in full mode', () => {
    const source = readFileSync(componentPath, 'utf-8');
    // Should have day grouping logic
    expect(source).toMatch(/Today|Tomorrow|toLocaleDateString/);
  });
});
