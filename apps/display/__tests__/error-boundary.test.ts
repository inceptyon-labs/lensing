import { describe, it, expect } from 'vitest';
import * as fs from 'fs';
import * as path from 'path';

describe('ErrorBoundary Component', () => {
  const libDir = path.join(__dirname, '..', 'src', 'lib');
  const componentPath = path.join(libDir, 'ErrorBoundary.svelte');

  it('should have ErrorBoundary.svelte file', () => {
    expect(fs.existsSync(componentPath)).toBe(true);
  });

  it('should use svelte:boundary for error catching', () => {
    const content = fs.readFileSync(componentPath, 'utf-8');
    expect(content).toContain('svelte:boundary');
  });

  it('should accept a name prop for widget identification', () => {
    const content = fs.readFileSync(componentPath, 'utf-8');
    expect(content).toContain('name');
  });

  it('should use --alert-urgent for error accent', () => {
    const content = fs.readFileSync(componentPath, 'utf-8');
    expect(content).toContain('--alert-urgent');
  });

  it('should use --event-horizon for error tile background', () => {
    const content = fs.readFileSync(componentPath, 'utf-8');
    expect(content).toContain('--event-horizon');
  });

  it('should use --starlight for error text', () => {
    const content = fs.readFileSync(componentPath, 'utf-8');
    expect(content).toContain('--starlight');
  });

  it('should use --ember for retry button accent', () => {
    const content = fs.readFileSync(componentPath, 'utf-8');
    expect(content).toContain('--ember');
  });

  it('should have a retry mechanism', () => {
    const content = fs.readFileSync(componentPath, 'utf-8');
    // Should have retry button or reset functionality
    expect(content.toLowerCase()).toContain('retry');
  });

  it('should log errors for host visibility', () => {
    const content = fs.readFileSync(componentPath, 'utf-8');
    expect(content).toContain('console.error');
  });

  it('should use design system spacing tokens', () => {
    const content = fs.readFileSync(componentPath, 'utf-8');
    expect(content).toContain('--space-');
  });

  it('should use design system radius tokens', () => {
    const content = fs.readFileSync(componentPath, 'utf-8');
    expect(content).toContain('--radius-md');
  });
});

describe('ErrorBoundary Integration', () => {
  it('should wrap widgets in +page.svelte', () => {
    const pagePath = path.join(__dirname, '..', 'src', 'routes', '+page.svelte');
    const content = fs.readFileSync(pagePath, 'utf-8');
    expect(content).toContain('ErrorBoundary');
  });

  it('should import ErrorBoundary in +page.svelte', () => {
    const pagePath = path.join(__dirname, '..', 'src', 'routes', '+page.svelte');
    const content = fs.readFileSync(pagePath, 'utf-8');
    expect(content).toContain("import ErrorBoundary from");
  });
});
