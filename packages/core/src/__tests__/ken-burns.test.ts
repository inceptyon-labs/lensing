import { describe, it, expect } from 'vitest';
import fs from 'fs';
import path from 'path';

const KEN_BURNS_CSS_PATH = path.join(
  __dirname,
  '..',
  'plugins',
  'photo-slideshow',
  'ken-burns.css'
);

describe('Ken Burns CSS Animation', () => {
  let cssContent: string;

  it('should have ken-burns.css file', () => {
    cssContent = fs.readFileSync(KEN_BURNS_CSS_PATH, 'utf-8');
    expect(cssContent).toBeTruthy();
  });

  it('should define ken-burns animation keyframes', () => {
    expect(cssContent).toContain('@keyframes ken-burns');
    expect(cssContent).toContain('0%');
    expect(cssContent).toContain('100%');
  });

  it('should use GPU-accelerated transforms (transform, opacity only)', () => {
    // Should use 'transform' for 3D acceleration
    expect(cssContent).toContain('transform:');
    expect(cssContent).toContain('translate');
    expect(cssContent).toContain('scale');

    // Should NOT use CPU-intensive properties
    expect(cssContent).not.toContain('left:');
    expect(cssContent).not.toContain('top:');
    expect(cssContent).not.toContain('width:');
    expect(cssContent).not.toContain('height:');
  });

  it('should have smooth animation with configurable duration', () => {
    // Animation should use variables for duration
    expect(cssContent).toContain('--ken-burns-duration');
    expect(cssContent).toContain('animation');
    expect(cssContent).toContain('ease-in-out');
  });

  it('should support multiple Ken Burns variations', () => {
    // At least 3 variations for visual variety
    expect(cssContent).toContain('ken-burns-1');
    expect(cssContent).toContain('ken-burns-2');
    expect(cssContent).toContain('ken-burns-3');
  });

  it('should disable animations on prefers-reduced-motion', () => {
    expect(cssContent).toContain('prefers-reduced-motion');
    expect(cssContent).toContain('animation: none');
  });

  it('should use will-change for animation optimization', () => {
    expect(cssContent).toContain('will-change');
  });

  it('should have backdrop-filter or background for card effect', () => {
    // For ambient display kiosk look
    expect(cssContent).toMatch(/backdrop-filter|background/);
  });
});
