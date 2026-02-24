import { describe, it, expect } from 'vitest';
import * as fs from 'fs';
import * as path from 'path';

const WIDGET_PATH = path.join(__dirname, '..', 'src', 'lib', 'PhotoSlideshow.svelte');

describe('PhotoSlideshow Widget', () => {
  let content: string;

  it('should have PhotoSlideshow.svelte file', () => {
    content = fs.readFileSync(WIDGET_PATH, 'utf-8');
    expect(content).toBeTruthy();
  });

  it('should accept photoPaths prop', () => {
    content = fs.readFileSync(WIDGET_PATH, 'utf-8');
    expect(content).toContain('photoPaths');
  });

  it('should accept cycleInterval prop', () => {
    content = fs.readFileSync(WIDGET_PATH, 'utf-8');
    expect(content).toContain('cycleInterval');
  });

  it('should use --void for background (ambient dark theme)', () => {
    content = fs.readFileSync(WIDGET_PATH, 'utf-8');
    expect(content).toContain('--void');
  });

  it('should use CSS animation classes from ken-burns.css', () => {
    content = fs.readFileSync(WIDGET_PATH, 'utf-8');
    expect(content).toContain('ken-burns');
  });

  it('should display an img element for the photo', () => {
    content = fs.readFileSync(WIDGET_PATH, 'utf-8');
    expect(content).toContain('<img');
  });

  it('should use object-fit: cover for full-frame photos', () => {
    content = fs.readFileSync(WIDGET_PATH, 'utf-8');
    expect(content).toContain('object-fit: cover');
  });

  it('should handle empty photoPaths gracefully', () => {
    content = fs.readFileSync(WIDGET_PATH, 'utf-8');
    // Should have a conditional or fallback for empty paths
    expect(content).toMatch(/if.*photoPaths|photoPaths\.length|empty/);
  });

  it('should not have hardcoded dimensions (use inset/percent sizing)', () => {
    content = fs.readFileSync(WIDGET_PATH, 'utf-8');
    // No pixel widths/heights for layout — use relative/inset
    expect(content).not.toMatch(/style="width:\s*\d+px/);
    expect(content).not.toMatch(/style="height:\s*\d+px/);
  });

  it('should not import from @lensing/core (Node.js package breaks SSR build)', () => {
    content = fs.readFileSync(WIDGET_PATH, 'utf-8');
    expect(content).not.toContain('@lensing/core');
  });

  it('should have inline getNextPhotoIndex function', () => {
    content = fs.readFileSync(WIDGET_PATH, 'utf-8');
    expect(content).toContain('getNextPhotoIndex');
  });
});
