import { describe, it, expect } from 'vitest';
import { readFileSync } from 'fs';
import { resolve } from 'path';

const tokensPath = resolve(__dirname, '../tokens.css');

function getTokens() {
  return readFileSync(tokensPath, 'utf-8');
}

describe('CSS Tokens', () => {
  describe('file existence and structure', () => {
    it('should have tokens.css file', () => {
      const content = getTokens();
      expect(content).toBeDefined();
      expect(content.length).toBeGreaterThan(0);
    });

    it('should contain :root selector', () => {
      const content = getTokens();
      expect(content).toMatch(/:root\s*\{/);
    });
  });

  describe('surface tokens', () => {
    it('should define --void surface', () => {
      expect(getTokens()).toMatch(/--void\s*:\s*hsl\(240,\s*8%,\s*4%\)/);
    });

    it('should define --event-horizon surface', () => {
      expect(getTokens()).toMatch(/--event-horizon\s*:\s*hsl\(240,\s*6%,\s*7%\)/);
    });

    it('should define --accretion surface', () => {
      expect(getTokens()).toMatch(/--accretion\s*:\s*hsl\(240,\s*5%,\s*10%\)/);
    });

    it('should define --singularity surface', () => {
      expect(getTokens()).toMatch(/--singularity\s*:\s*hsl\(240,\s*4%,\s*13%\)/);
    });
  });

  describe('text tokens', () => {
    it('should define --starlight text color', () => {
      expect(getTokens()).toMatch(/--starlight\s*:\s*hsl\(220,\s*15%,\s*90%\)/);
    });

    it('should define --dim-light text color', () => {
      expect(getTokens()).toMatch(/--dim-light\s*:\s*hsl\(220,\s*10%,\s*62%\)/);
    });

    it('should define --faint-light text color', () => {
      expect(getTokens()).toMatch(/--faint-light\s*:\s*hsl\(220,\s*8%,\s*42%\)/);
    });

    it('should define --ghost-light text color', () => {
      expect(getTokens()).toMatch(/--ghost-light\s*:\s*hsl\(220,\s*6%,\s*28%\)/);
    });
  });

  describe('accent tokens', () => {
    it('should define --ember accent', () => {
      expect(getTokens()).toMatch(/--ember\s*:\s*hsl\(28,\s*85%,\s*55%\)/);
    });

    it('should define --ember-dim', () => {
      expect(getTokens()).toMatch(/--ember-dim\s*:\s*hsl\(28,\s*70%,\s*40%\)/);
    });

    it('should define --ember-glow', () => {
      expect(getTokens()).toMatch(/--ember-glow\s*:\s*hsla\(28,\s*85%,\s*55%,\s*0\.12\)/);
    });

    it('should define --ember-trace', () => {
      expect(getTokens()).toMatch(/--ember-trace\s*:\s*hsla\(28,\s*85%,\s*55%,\s*0\.06\)/);
    });
  });

  describe('border tokens', () => {
    it('should define --edge border', () => {
      expect(getTokens()).toMatch(/--edge\s*:\s*hsla\(220,\s*10%,\s*50%,\s*0\.12\)/);
    });

    it('should define --edge-soft', () => {
      expect(getTokens()).toMatch(/--edge-soft\s*:\s*hsla\(220,\s*10%,\s*50%,\s*0\.07\)/);
    });

    it('should define --edge-bright', () => {
      expect(getTokens()).toMatch(/--edge-bright\s*:\s*hsla\(220,\s*10%,\s*50%,\s*0\.2\)/);
    });

    it('should define --edge-focus', () => {
      expect(getTokens()).toMatch(/--edge-focus\s*:\s*hsla\(28,\s*85%,\s*55%,\s*0\.4\)/);
    });
  });

  describe('semantic tokens', () => {
    it('should define --alert-urgent', () => {
      expect(getTokens()).toMatch(/--alert-urgent\s*:\s*hsl\(0,\s*60%,\s*55%\)/);
    });

    it('should define --alert-warning', () => {
      expect(getTokens()).toMatch(/--alert-warning\s*:\s*hsl\(38,\s*65%,\s*50%\)/);
    });

    it('should define --alert-success', () => {
      expect(getTokens()).toMatch(/--alert-success\s*:\s*hsl\(160,\s*45%,\s*45%\)/);
    });

    it('should define --alert-info', () => {
      expect(getTokens()).toMatch(/--alert-info\s*:\s*hsl\(210,\s*50%,\s*55%\)/);
    });
  });

  describe('control tokens', () => {
    it('should define --control-bg', () => {
      expect(getTokens()).toMatch(/--control-bg\s*:\s*hsl\(240,\s*6%,\s*9%\)/);
    });

    it('should define --control-border', () => {
      expect(getTokens()).toMatch(/--control-border\s*:\s*hsla\(220,\s*10%,\s*50%,\s*0\.15\)/);
    });

    it('should define --control-focus', () => {
      expect(getTokens()).toMatch(/--control-focus\s*:\s*hsla\(28,\s*85%,\s*55%,\s*0\.25\)/);
    });
  });

  describe('typography tokens', () => {
    it('should define font family tokens', () => {
      const content = getTokens();
      expect(content).toMatch(/--font-sans\s*:/);
      expect(content).toMatch(/--font-mono\s*:/);
    });

    it('should define font size tokens', () => {
      const content = getTokens();
      const sizes = [
        '--text-xs',
        '--text-sm',
        '--text-base',
        '--text-lg',
        '--text-xl',
        '--text-2xl',
        '--text-3xl',
      ];
      sizes.forEach((size) => {
        expect(content).toMatch(new RegExp(`${size}\\s*:`));
      });
    });

    it('should define font weight tokens', () => {
      const content = getTokens();
      expect(content).toMatch(/--weight-normal\s*:/);
      expect(content).toMatch(/--weight-medium\s*:/);
      expect(content).toMatch(/--weight-semi\s*:/);
      expect(content).toMatch(/--weight-bold\s*:/);
    });

    it('should define tracking tokens', () => {
      const content = getTokens();
      expect(content).toMatch(/--tracking-tight\s*:/);
      expect(content).toMatch(/--tracking-normal\s*:/);
      expect(content).toMatch(/--tracking-wide\s*:/);
    });

    it('should define leading tokens', () => {
      const content = getTokens();
      expect(content).toMatch(/--leading-tight\s*:/);
      expect(content).toMatch(/--leading-normal\s*:/);
      expect(content).toMatch(/--leading-loose\s*:/);
    });
  });

  describe('spacing tokens', () => {
    it('should define all spacing scale', () => {
      const content = getTokens();
      for (let i = 1; i <= 8; i++) {
        expect(content).toMatch(new RegExp(`--space-${i}\\s*:`));
      }
    });
  });

  describe('radius tokens', () => {
    it('should define all radius scale', () => {
      const content = getTokens();
      const radii = ['--radius-sm', '--radius-md', '--radius-lg', '--radius-xl'];
      radii.forEach((radius) => {
        expect(content).toMatch(new RegExp(`${radius}\\s*:`));
      });
    });
  });

  describe('animation tokens', () => {
    it('should define duration tokens', () => {
      const content = getTokens();
      expect(content).toMatch(/--duration-fast\s*:/);
      expect(content).toMatch(/--duration-normal\s*:/);
      expect(content).toMatch(/--duration-slow\s*:/);
      expect(content).toMatch(/--duration-ambient\s*:/);
    });

    it('should define easing function tokens', () => {
      const content = getTokens();
      expect(content).toMatch(/--ease-out\s*:/);
      expect(content).toMatch(/--ease-in-out\s*:/);
    });
  });
});
