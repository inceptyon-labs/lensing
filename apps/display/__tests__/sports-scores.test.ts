import { describe, it, expect } from 'vitest';
import { readFileSync } from 'fs';
import { join } from 'path';

const componentPath = join(__dirname, '../src/lib/SportsScores.svelte');
const source = readFileSync(componentPath, 'utf-8');

describe('SportsScores Svelte Component', () => {
  it('should exist as a Svelte file', () => {
    expect(source).toBeTruthy();
    expect(source.length).toBeGreaterThan(0);
  });

  it('should accept games prop', () => {
    expect(source).toContain('games');
  });

  it('should accept compact prop', () => {
    expect(source).toContain('compact');
  });

  it('should use design system surface token for background', () => {
    expect(source).toContain('--event-horizon');
  });

  it('should use design system text tokens', () => {
    expect(source).toContain('--starlight');
    expect(source).toContain('--dim-light');
  });

  it('should use ember accent for live indicator', () => {
    expect(source).toContain('--ember');
  });

  it('should display home and away team names', () => {
    expect(source).toContain('homeTeam');
    expect(source).toContain('awayTeam');
  });

  it('should display home and away scores', () => {
    expect(source).toContain('homeScore');
    expect(source).toContain('awayScore');
  });

  it('should show a live indicator for in_progress games', () => {
    expect(source).toContain('in_progress');
    expect(source).toContain('LIVE');
  });

  it('should handle empty games state', () => {
    expect(source).toContain('No games');
  });

  it('should use minimum text size for kiosk legibility', () => {
    expect(source).toMatch(/--text-sm|--text-base|--text-lg|--text-xl|--text-2xl/);
    expect(source).not.toContain('--text-xs');
  });

  it('should display the game period or status', () => {
    expect(source).toContain('period');
    expect(source).toContain('status');
  });

  it('should display the league name', () => {
    expect(source).toContain('league');
  });
});
