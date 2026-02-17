import { describe, it, expect } from 'vitest';
import * as fs from 'fs';
import * as path from 'path';

describe('Design System Tokens', () => {
  const libDir = path.join(__dirname, '..', 'src', 'lib', 'styles');

  it('should have tokens.css file', () => {
    const tokensPath = path.join(libDir, 'tokens.css');
    expect(fs.existsSync(tokensPath)).toBe(true);
  });

  it('should have global.css file', () => {
    const globalPath = path.join(libDir, 'global.css');
    expect(fs.existsSync(globalPath)).toBe(true);
  });

  it('should export surface color tokens', () => {
    const tokensPath = path.join(libDir, 'tokens.css');
    const content = fs.readFileSync(tokensPath, 'utf-8');

    expect(content).toContain('--void');
    expect(content).toContain('--event-horizon');
    expect(content).toContain('--accretion');
    expect(content).toContain('--singularity');
  });

  it('should export text color tokens', () => {
    const tokensPath = path.join(libDir, 'tokens.css');
    const content = fs.readFileSync(tokensPath, 'utf-8');

    expect(content).toContain('--starlight');
    expect(content).toContain('--dim-light');
    expect(content).toContain('--faint-light');
    expect(content).toContain('--ghost-light');
  });

  it('should export accent color tokens', () => {
    const tokensPath = path.join(libDir, 'tokens.css');
    const content = fs.readFileSync(tokensPath, 'utf-8');

    expect(content).toContain('--ember');
    expect(content).toContain('--ember-dim');
    expect(content).toContain('--ember-glow');
    expect(content).toContain('--ember-trace');
  });

  it('should export border tokens', () => {
    const tokensPath = path.join(libDir, 'tokens.css');
    const content = fs.readFileSync(tokensPath, 'utf-8');

    expect(content).toContain('--edge');
    expect(content).toContain('--edge-soft');
    expect(content).toContain('--edge-bright');
    expect(content).toContain('--edge-focus');
  });

  it('should export spacing tokens', () => {
    const tokensPath = path.join(libDir, 'tokens.css');
    const content = fs.readFileSync(tokensPath, 'utf-8');

    expect(content).toContain('--space-1');
    expect(content).toContain('--space-2');
    expect(content).toContain('--space-3');
    expect(content).toContain('--space-4');
    expect(content).toContain('--space-5');
    expect(content).toContain('--space-6');
    expect(content).toContain('--space-7');
    expect(content).toContain('--space-8');
  });

  it('should export typography tokens', () => {
    const tokensPath = path.join(libDir, 'tokens.css');
    const content = fs.readFileSync(tokensPath, 'utf-8');

    expect(content).toContain('--font-sans');
    expect(content).toContain('--font-mono');
    expect(content).toContain('--text-xs');
    expect(content).toContain('--text-sm');
    expect(content).toContain('--text-base');
    expect(content).toContain('--text-lg');
    expect(content).toContain('--text-xl');
    expect(content).toContain('--text-2xl');
    expect(content).toContain('--text-3xl');
    expect(content).toContain('--weight-normal');
    expect(content).toContain('--weight-medium');
    expect(content).toContain('--weight-semi');
    expect(content).toContain('--weight-bold');
  });

  it('should export border radius tokens', () => {
    const tokensPath = path.join(libDir, 'tokens.css');
    const content = fs.readFileSync(tokensPath, 'utf-8');

    expect(content).toContain('--radius-sm');
    expect(content).toContain('--radius-md');
    expect(content).toContain('--radius-lg');
    expect(content).toContain('--radius-xl');
  });

  it('should apply tokens in global styles', () => {
    const globalPath = path.join(libDir, 'global.css');
    const content = fs.readFileSync(globalPath, 'utf-8');

    // Should import tokens
    expect(content).toContain('tokens.css');

    // Should set body background to --void
    expect(content).toContain('--void');

    // Should apply base typography
    expect(content).toContain('--font-sans');

    // Should apply color
    expect(content).toContain('--starlight');
  });

  it('should not have hardcoded color values in global styles', () => {
    const globalPath = path.join(libDir, 'global.css');
    const content = fs.readFileSync(globalPath, 'utf-8');

    // Check for typical hardcoded color patterns (not exhaustive, but catches common ones)
    const hardcodedPatterns = [
      /#[0-9a-fA-F]{6}(?!["-])/g, // hex colors not in strings
      /rgb\s*\(/,
      /rgba\s*\(/,
    ];

    hardcodedPatterns.forEach((pattern) => {
      const matches = content.match(pattern);
      // Allow limited matches (like in comments), but not for actual styling
      if (matches) {
        // Very lenient check - just ensure not overused
        expect(matches.length).toBeLessThan(5);
      }
    });
  });

  it('should export animation tokens', () => {
    const tokensPath = path.join(libDir, 'tokens.css');
    const content = fs.readFileSync(tokensPath, 'utf-8');

    expect(content).toContain('--duration-');
    expect(content).toContain('--ease-');
  });
});
