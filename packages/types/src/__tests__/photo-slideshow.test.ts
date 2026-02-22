import { describe, it, expect } from 'vitest';
import type {
  PhotoSlideshow,
  KenBurnsConfig,
  PhotoSlideshowManifest,
} from '../photo-slideshow';
import {
  DEFAULT_KEN_BURNS_CONFIG,
  DEFAULT_CYCLE_INTERVAL_MS,
  SUPPORTED_IMAGE_EXTENSIONS,
} from '../photo-slideshow';

describe('PhotoSlideshow Types & Constants', () => {
  it('should have PhotoSlideshow interface with photo paths', () => {
    const slideshow: PhotoSlideshow = {
      photoPaths: ['/photos/1.jpg', '/photos/2.jpg'],
      currentIndex: 0,
      cycleInterval: 5000,
      transitionStyle: 'crossfade',
    };

    expect(slideshow.photoPaths).toHaveLength(2);
    expect(slideshow.currentIndex).toBe(0);
    expect(slideshow.cycleInterval).toBe(5000);
    expect(slideshow.transitionStyle).toBe('crossfade');
  });

  it('should have KenBurnsConfig interface', () => {
    const config: KenBurnsConfig = {
      duration: 8000,
      scale: [1.0, 1.15],
      panX: [-5, 5],
      panY: [-5, 5],
    };

    expect(config.duration).toBe(8000);
    expect(config.scale).toEqual([1.0, 1.15]);
    expect(config.panX).toEqual([-5, 5]);
    expect(config.panY).toEqual([-5, 5]);
  });

  it('should have PhotoSlideshowManifest extending PluginManifestWithConfig', () => {
    const manifest: PhotoSlideshowManifest = {
      id: 'photo-slideshow',
      version: '1.0.0',
      name: 'Photo Slideshow',
      widget_sizes: ['large'],
      config_schema: {
        fields: [
          {
            key: 'photoDirectory',
            type: 'string',
            label: 'Photo Directory',
            description: 'Path to photo directory',
            required: true,
          },
        ],
      },
    };

    expect(manifest.id).toBe('photo-slideshow');
    expect(manifest.widget_sizes).toContain('large');
    expect(manifest.config_schema?.fields[0].key).toBe('photoDirectory');
  });

  it('should export DEFAULT_KEN_BURNS_CONFIG with valid animation params', () => {
    expect(DEFAULT_KEN_BURNS_CONFIG).toBeDefined();
    expect(DEFAULT_KEN_BURNS_CONFIG.duration).toBeGreaterThan(0);
    expect(DEFAULT_KEN_BURNS_CONFIG.scale).toHaveLength(2);
    expect(DEFAULT_KEN_BURNS_CONFIG.scale[0]).toBeLessThanOrEqual(
      DEFAULT_KEN_BURNS_CONFIG.scale[1]
    );
    expect(DEFAULT_KEN_BURNS_CONFIG.panX).toHaveLength(2);
    expect(DEFAULT_KEN_BURNS_CONFIG.panY).toHaveLength(2);
  });

  it('should export DEFAULT_CYCLE_INTERVAL_MS as a positive number', () => {
    expect(DEFAULT_CYCLE_INTERVAL_MS).toBeGreaterThan(0);
    expect(typeof DEFAULT_CYCLE_INTERVAL_MS).toBe('number');
  });

  it('should export SUPPORTED_IMAGE_EXTENSIONS with common formats', () => {
    expect(SUPPORTED_IMAGE_EXTENSIONS).toContain('.jpg');
    expect(SUPPORTED_IMAGE_EXTENSIONS).toContain('.jpeg');
    expect(SUPPORTED_IMAGE_EXTENSIONS).toContain('.png');
    expect(SUPPORTED_IMAGE_EXTENSIONS).toContain('.webp');
  });
});
