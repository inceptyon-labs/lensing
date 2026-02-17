import { describe, it, expect } from 'vitest';
import * as fs from 'fs';
import * as path from 'path';

describe('Main Page Component', () => {
  const pagesDir = path.join(__dirname, '..', 'src', 'routes');
  const pagePath = path.join(pagesDir, '+page.svelte');

  it('should have +page.svelte file', () => {
    expect(fs.existsSync(pagePath)).toBe(true);
  });

  it('should import Layout component', () => {
    const content = fs.readFileSync(pagePath, 'utf-8');
    expect(content).toContain('Layout');
    expect(content).toContain('import');
  });

  it('should import Placeholder component', () => {
    const content = fs.readFileSync(pagePath, 'utf-8');
    expect(content).toContain('Placeholder');
    expect(content).toContain('import');
  });

  it('should use Layout component in template', () => {
    const content = fs.readFileSync(pagePath, 'utf-8');
    expect(content).toContain('<Layout');
  });

  it('should have slot for top-bar zone', () => {
    const content = fs.readFileSync(pagePath, 'utf-8');
    expect(content).toContain('slot="top-bar"');
  });

  it('should have slot for left-col zone', () => {
    const content = fs.readFileSync(pagePath, 'utf-8');
    expect(content).toContain('slot="left-col"');
  });

  it('should have slot for center zone', () => {
    const content = fs.readFileSync(pagePath, 'utf-8');
    expect(content).toContain('slot="center"');
  });

  it('should have slot for right-col zone', () => {
    const content = fs.readFileSync(pagePath, 'utf-8');
    expect(content).toContain('slot="right-col"');
  });

  it('should have slot for bottom-bar zone', () => {
    const content = fs.readFileSync(pagePath, 'utf-8');
    expect(content).toContain('slot="bottom-bar"');
  });

  it('should use Placeholder widgets in at least one zone', () => {
    const content = fs.readFileSync(pagePath, 'utf-8');
    expect(content).toMatch(/<Placeholder[\s\S]*?\/>/);
  });

  it('should include svelte:head with meta viewport for kiosk', () => {
    const content = fs.readFileSync(pagePath, 'utf-8');
    expect(content).toContain('svelte:head');
    expect(content).toContain('viewport');
  });

  it('should import global styles in +layout.svelte', () => {
    const layoutPath = path.join(pagesDir, '+layout.svelte');
    if (fs.existsSync(layoutPath)) {
      const layoutContent = fs.readFileSync(layoutPath, 'utf-8');
      expect(layoutContent).toContain('global');
    }
  });

  it('should use svelte:fragment for slots (not div wrappers that bypass zone grid)', () => {
    const content = fs.readFileSync(pagePath, 'utf-8');
    // svelte:fragment slots pass children directly to Zone grid
    // div slot wrappers collapse all children into one grid item
    expect(content).toContain('svelte:fragment');
    expect(content).not.toMatch(/<div slot=/);
  });
});
