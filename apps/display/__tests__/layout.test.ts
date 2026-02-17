import { describe, it, expect } from 'vitest';
import * as fs from 'fs';
import * as path from 'path';

describe('Layout Component Architecture', () => {
  const libDir = path.join(__dirname, '..', 'src', 'lib');

  describe('config types', () => {
    it('should have config.ts file', () => {
      const configPath = path.join(libDir, 'config.ts');
      expect(fs.existsSync(configPath)).toBe(true);
    });

    it('should export ZONE_NAMES constant', async () => {
      const { ZONE_NAMES } = await import('../src/lib/config');
      expect(ZONE_NAMES).toContain('top-bar');
      expect(ZONE_NAMES).toContain('left-col');
      expect(ZONE_NAMES).toContain('center');
      expect(ZONE_NAMES).toContain('right-col');
      expect(ZONE_NAMES).toContain('bottom-bar');
      expect(ZONE_NAMES).toHaveLength(5);
    });

    it('should export DEFAULT_LAYOUT config with all 5 zones', async () => {
      const { DEFAULT_LAYOUT, ZONE_NAMES } = await import('../src/lib/config');
      expect(DEFAULT_LAYOUT.zones).toHaveLength(5);

      const names = DEFAULT_LAYOUT.zones.map((z: { name: string }) => z.name);
      for (const name of ZONE_NAMES) {
        expect(names).toContain(name);
      }
    });

    it('should have positive rows and columns for every zone', async () => {
      const { DEFAULT_LAYOUT } = await import('../src/lib/config');
      for (const zone of DEFAULT_LAYOUT.zones) {
        expect(zone.rows).toBeGreaterThan(0);
        expect(zone.columns).toBeGreaterThan(0);
      }
    });

    it('should export createZoneStyle helper that returns grid CSS', async () => {
      const { createZoneStyle } = await import('../src/lib/config');
      expect(typeof createZoneStyle).toBe('function');

      const style = createZoneStyle({ name: 'center', rows: 2, columns: 3 });
      expect(style).toContain('grid-template-rows');
      expect(style).toContain('grid-template-columns');
    });
  });

  describe('Svelte components', () => {
    it('should have Zone.svelte file', () => {
      const zonePath = path.join(libDir, 'Zone.svelte');
      expect(fs.existsSync(zonePath)).toBe(true);
    });

    it('should have Layout.svelte file', () => {
      const layoutPath = path.join(libDir, 'Layout.svelte');
      expect(fs.existsSync(layoutPath)).toBe(true);
    });

    it('Zone.svelte should use CSS grid', () => {
      const zonePath = path.join(libDir, 'Zone.svelte');
      const content = fs.readFileSync(zonePath, 'utf-8');
      expect(content).toContain('display: grid');
    });

    it('Zone.svelte should accept name prop', () => {
      const zonePath = path.join(libDir, 'Zone.svelte');
      const content = fs.readFileSync(zonePath, 'utf-8');
      expect(content).toContain('name');
    });

    it('Layout.svelte should reference all 5 zone names', () => {
      const layoutPath = path.join(libDir, 'Layout.svelte');
      const content = fs.readFileSync(layoutPath, 'utf-8');
      expect(content).toContain('top-bar');
      expect(content).toContain('left-col');
      expect(content).toContain('center');
      expect(content).toContain('right-col');
      expect(content).toContain('bottom-bar');
    });

    it('Layout.svelte should use CSS grid for zone positioning', () => {
      const layoutPath = path.join(libDir, 'Layout.svelte');
      const content = fs.readFileSync(layoutPath, 'utf-8');
      expect(content).toContain('grid-template-areas');
    });

    it('Layout.svelte should fill viewport height', () => {
      const layoutPath = path.join(libDir, 'Layout.svelte');
      const content = fs.readFileSync(layoutPath, 'utf-8');
      expect(content).toContain('100vh');
    });

    it('Layout.svelte should use design tokens', () => {
      const layoutPath = path.join(libDir, 'Layout.svelte');
      const content = fs.readFileSync(layoutPath, 'utf-8');
      expect(content).toContain('var(--');
    });
  });
});
