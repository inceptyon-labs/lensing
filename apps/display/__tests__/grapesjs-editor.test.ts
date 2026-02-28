import { describe, it, expect } from 'vitest';
import { readFileSync } from 'fs';
import { join } from 'path';

describe('GrapesJSEditor Component', () => {
  const editorPath = join(__dirname, '../src/lib/GrapesJSEditor.svelte');

  it('should have GrapesJSEditor.svelte file', () => {
    const source = readFileSync(editorPath, 'utf-8');
    expect(source).toBeTruthy();
  });

  it('should accept width and height props', () => {
    const source = readFileSync(editorPath, 'utf-8');
    expect(source).toContain('export let width');
    expect(source).toContain('export let height');
  });

  it('should accept optional initialProject prop', () => {
    const source = readFileSync(editorPath, 'utf-8');
    expect(source).toContain('initialProject');
  });

  it('should have onMount lifecycle for editor initialization', () => {
    const source = readFileSync(editorPath, 'utf-8');
    expect(source).toContain('onMount');
    expect(source).toContain('grapesjs');
  });

  it('should have onDestroy lifecycle for cleanup', () => {
    const source = readFileSync(editorPath, 'utf-8');
    expect(source).toContain('onDestroy');
    expect(source).toContain('destroy');
  });

  it('should export getHtml method', () => {
    const source = readFileSync(editorPath, 'utf-8');
    expect(source).toContain('getHtml');
    expect(source).toContain('export');
  });

  it('should export getCss method', () => {
    const source = readFileSync(editorPath, 'utf-8');
    expect(source).toContain('getCss');
  });

  it('should export getProjectData method', () => {
    const source = readFileSync(editorPath, 'utf-8');
    expect(source).toContain('getProjectData');
  });

  it('should use --event-horizon for background', () => {
    const source = readFileSync(editorPath, 'utf-8');
    expect(source).toContain('--event-horizon');
  });

  it('should use --radius-md for border radius', () => {
    const source = readFileSync(editorPath, 'utf-8');
    expect(source).toContain('--radius-md');
  });

  it('should use --space-4 for padding', () => {
    const source = readFileSync(editorPath, 'utf-8');
    expect(source).toContain('--space-4');
  });

  it('should use --edge for border', () => {
    const source = readFileSync(editorPath, 'utf-8');
    expect(source).toContain('--edge');
  });

  it('should use design system text colors', () => {
    const source = readFileSync(editorPath, 'utf-8');
    expect(source).toContain('--dim-light');
  });
});
