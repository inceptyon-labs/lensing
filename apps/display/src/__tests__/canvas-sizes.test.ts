import { describe, it, expect } from 'vitest';
import {
  CANVAS_SIZES,
  CANVAS_SIZE_KEYS,
  DEFAULT_CANVAS_SIZE,
  type CanvasSize,
} from '../lib/canvas-sizes';

describe('Canvas Sizes', () => {
  it('should export small, medium, and large sizes', () => {
    expect(CANVAS_SIZES).toHaveProperty('small');
    expect(CANVAS_SIZES).toHaveProperty('medium');
    expect(CANVAS_SIZES).toHaveProperty('large');
  });

  it('should export size keys array in order', () => {
    expect(CANVAS_SIZE_KEYS).toEqual(['small', 'medium', 'large']);
  });

  it('should have width and height for each size', () => {
    for (const key of CANVAS_SIZE_KEYS) {
      const size = CANVAS_SIZES[key];
      expect(size.width).toBeGreaterThan(0);
      expect(size.height).toBeGreaterThan(0);
    }
  });

  it('should have increasing dimensions from small to large', () => {
    expect(CANVAS_SIZES.small.width).toBeLessThan(CANVAS_SIZES.medium.width);
    expect(CANVAS_SIZES.medium.width).toBeLessThan(CANVAS_SIZES.large.width);
    expect(CANVAS_SIZES.small.height).toBeLessThan(CANVAS_SIZES.medium.height);
    expect(CANVAS_SIZES.medium.height).toBeLessThan(CANVAS_SIZES.large.height);
  });

  it('should default to medium', () => {
    expect(DEFAULT_CANVAS_SIZE).toBe('medium');
  });

  it('should match BuilderPreview size values', () => {
    expect(CANVAS_SIZES.small).toEqual({ width: 200, height: 150 });
    expect(CANVAS_SIZES.medium).toEqual({ width: 300, height: 225 });
    expect(CANVAS_SIZES.large).toEqual({ width: 400, height: 300 });
  });

  it('should export CanvasSize type that accepts valid sizes', () => {
    const size: CanvasSize = 'medium';
    expect(CANVAS_SIZE_KEYS).toContain(size);
  });
});
