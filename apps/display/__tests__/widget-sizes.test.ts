import { describe, it, expect } from 'vitest';
import type { GridSpan, PluginManifest } from '@lensing/types';

describe('Widget Size Registry', () => {
  describe('WIDGET_SIZE_REGISTRY', () => {
    it('should export a registry with entries for all built-in plugins', async () => {
      const { WIDGET_SIZE_REGISTRY } = await import('../src/lib/grid/widget-sizes');
      const expectedPlugins = [
        'weather',
        'allergies',
        'crypto',
        'news',
        'sports',
        'photo-slideshow',
        'calendar',
        'home-assistant',
      ];
      for (const pluginId of expectedPlugins) {
        expect(WIDGET_SIZE_REGISTRY[pluginId]).toBeDefined();
      }
    });

    it('should have valid GridSpan for every registry entry (min <= preferred <= max)', async () => {
      const { WIDGET_SIZE_REGISTRY } = await import('../src/lib/grid/widget-sizes');
      for (const [pluginId, span] of Object.entries(WIDGET_SIZE_REGISTRY)) {
        // Cols: min <= preferred <= max
        expect(span.min[0]).toBeLessThanOrEqual(span.preferred[0]);
        expect(span.preferred[0]).toBeLessThanOrEqual(span.max[0]);
        // Rows: min <= preferred <= max
        expect(span.min[1]).toBeLessThanOrEqual(span.preferred[1]);
        expect(span.preferred[1]).toBeLessThanOrEqual(span.max[1]);
        // All values must be positive integers
        for (const tuple of [span.min, span.preferred, span.max]) {
          expect(tuple[0]).toBeGreaterThan(0);
          expect(tuple[1]).toBeGreaterThan(0);
          expect(Number.isInteger(tuple[0])).toBe(true);
          expect(Number.isInteger(tuple[1])).toBe(true);
        }
      }
    });
  });

  describe('DEFAULT_WIDGET_SIZE', () => {
    it('should export a valid fallback GridSpan', async () => {
      const { DEFAULT_WIDGET_SIZE } = await import('../src/lib/grid/widget-sizes');
      expect(DEFAULT_WIDGET_SIZE.min).toHaveLength(2);
      expect(DEFAULT_WIDGET_SIZE.preferred).toHaveLength(2);
      expect(DEFAULT_WIDGET_SIZE.max).toHaveLength(2);
      expect(DEFAULT_WIDGET_SIZE.min[0]).toBeLessThanOrEqual(DEFAULT_WIDGET_SIZE.preferred[0]);
      expect(DEFAULT_WIDGET_SIZE.preferred[0]).toBeLessThanOrEqual(DEFAULT_WIDGET_SIZE.max[0]);
      expect(DEFAULT_WIDGET_SIZE.min[1]).toBeLessThanOrEqual(DEFAULT_WIDGET_SIZE.preferred[1]);
      expect(DEFAULT_WIDGET_SIZE.preferred[1]).toBeLessThanOrEqual(DEFAULT_WIDGET_SIZE.max[1]);
    });
  });

  describe('isGridSpan (via getWidgetConstraints)', () => {
    it('should detect a GridSpan object with min/preferred/max', async () => {
      const { isGridSpan } = await import('../src/lib/grid/widget-sizes');
      const span: GridSpan = {
        min: [2, 2],
        preferred: [4, 3],
        max: [8, 6],
      };
      expect(isGridSpan(span)).toBe(true);
    });

    it('should reject a WidgetSize array', async () => {
      const { isGridSpan } = await import('../src/lib/grid/widget-sizes');
      const sizes = ['small', 'medium'] as const;
      expect(isGridSpan(sizes as unknown as GridSpan)).toBe(false);
    });

    it('should reject an object missing required fields', async () => {
      const { isGridSpan } = await import('../src/lib/grid/widget-sizes');
      expect(isGridSpan({ min: [1, 1] } as unknown as GridSpan)).toBe(false);
      expect(isGridSpan({ preferred: [1, 1] } as unknown as GridSpan)).toBe(false);
      expect(isGridSpan({} as unknown as GridSpan)).toBe(false);
    });
  });

  describe('getWidgetConstraints', () => {
    it('should return registry values for known plugins', async () => {
      const { getWidgetConstraints, WIDGET_SIZE_REGISTRY } =
        await import('../src/lib/grid/widget-sizes');
      const result = getWidgetConstraints('weather');
      expect(result).toEqual(WIDGET_SIZE_REGISTRY['weather']);
    });

    it('should return default constraints for unknown plugins', async () => {
      const { getWidgetConstraints, DEFAULT_WIDGET_SIZE } =
        await import('../src/lib/grid/widget-sizes');
      const result = getWidgetConstraints('some-unknown-plugin');
      expect(result).toEqual(DEFAULT_WIDGET_SIZE);
    });

    it('should prefer manifest GridSpan over registry', async () => {
      const { getWidgetConstraints, WIDGET_SIZE_REGISTRY } =
        await import('../src/lib/grid/widget-sizes');
      const manifest: PluginManifest = {
        id: 'weather',
        name: 'Weather',
        version: '1.0.0',
        widget_sizes: {
          min: [1, 1],
          preferred: [2, 2],
          max: [4, 4],
        },
      };
      const result = getWidgetConstraints('weather', manifest);
      // Should use manifest, not registry
      expect(result).toEqual(manifest.widget_sizes);
      expect(result).not.toEqual(WIDGET_SIZE_REGISTRY['weather']);
    });

    it('should fall back to registry when manifest has WidgetSize[] instead of GridSpan', async () => {
      const { getWidgetConstraints, WIDGET_SIZE_REGISTRY } =
        await import('../src/lib/grid/widget-sizes');
      const manifest: PluginManifest = {
        id: 'weather',
        name: 'Weather',
        version: '1.0.0',
        widget_sizes: ['small', 'medium'],
      };
      const result = getWidgetConstraints('weather', manifest);
      expect(result).toEqual(WIDGET_SIZE_REGISTRY['weather']);
    });

    it('should fall back to registry when manifest has no widget_sizes', async () => {
      const { getWidgetConstraints, WIDGET_SIZE_REGISTRY } =
        await import('../src/lib/grid/widget-sizes');
      const manifest: PluginManifest = {
        id: 'weather',
        name: 'Weather',
        version: '1.0.0',
      };
      const result = getWidgetConstraints('weather', manifest);
      expect(result).toEqual(WIDGET_SIZE_REGISTRY['weather']);
    });
  });

  describe('toGridWidgetConstraints', () => {
    it('should convert GridSpan to minW/minH/maxW/maxH fields', async () => {
      const { toGridWidgetConstraints } = await import('../src/lib/grid/widget-sizes');
      const span: GridSpan = {
        min: [3, 2],
        preferred: [6, 4],
        max: [12, 8],
      };
      const result = toGridWidgetConstraints(span);
      expect(result).toEqual({
        minW: 3,
        minH: 2,
        maxW: 12,
        maxH: 8,
      });
    });

    it('should handle single-cell constraints', async () => {
      const { toGridWidgetConstraints } = await import('../src/lib/grid/widget-sizes');
      const span: GridSpan = {
        min: [1, 1],
        preferred: [1, 1],
        max: [1, 1],
      };
      const result = toGridWidgetConstraints(span);
      expect(result).toEqual({
        minW: 1,
        minH: 1,
        maxW: 1,
        maxH: 1,
      });
    });
  });

  describe('getPreferredSize', () => {
    it('should return preferred size for a known plugin', async () => {
      const { getPreferredSize, WIDGET_SIZE_REGISTRY } =
        await import('../src/lib/grid/widget-sizes');
      const result = getPreferredSize('weather');
      expect(result).toEqual({
        w: WIDGET_SIZE_REGISTRY['weather'].preferred[0],
        h: WIDGET_SIZE_REGISTRY['weather'].preferred[1],
      });
    });

    it('should return default preferred size for unknown plugins', async () => {
      const { getPreferredSize, DEFAULT_WIDGET_SIZE } =
        await import('../src/lib/grid/widget-sizes');
      const result = getPreferredSize('totally-unknown');
      expect(result).toEqual({
        w: DEFAULT_WIDGET_SIZE.preferred[0],
        h: DEFAULT_WIDGET_SIZE.preferred[1],
      });
    });

    it('should use manifest GridSpan when provided', async () => {
      const { getPreferredSize } = await import('../src/lib/grid/widget-sizes');
      const manifest: PluginManifest = {
        id: 'custom',
        name: 'Custom',
        version: '1.0.0',
        widget_sizes: {
          min: [1, 1],
          preferred: [10, 8],
          max: [20, 16],
        },
      };
      const result = getPreferredSize('custom', manifest);
      expect(result).toEqual({ w: 10, h: 8 });
    });
  });
});
