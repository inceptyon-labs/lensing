import { describe, it, expect } from 'vitest';
import fs from 'fs';
import path from 'path';
import {
  discoverPhotos,
  calculateKenBurnsTransform,
  getNextPhotoIndex,
} from '@lensing/core';
import {
  DEFAULT_KEN_BURNS_CONFIG,
  DEFAULT_CYCLE_INTERVAL_MS,
  SUPPORTED_IMAGE_EXTENSIONS,
} from '@lensing/core';

const PLUGIN_DIR = path.join(
  __dirname,
  '..',
  'plugins',
  'photo-slideshow'
);

describe('Photo Slideshow Plugin Integration', () => {
  it('should export discoverPhotos from @lensing/core', () => {
    expect(typeof discoverPhotos).toBe('function');
  });

  it('should export calculateKenBurnsTransform from @lensing/core', () => {
    expect(typeof calculateKenBurnsTransform).toBe('function');
  });

  it('should export getNextPhotoIndex from @lensing/core', () => {
    expect(typeof getNextPhotoIndex).toBe('function');
  });

  it('should export DEFAULT_KEN_BURNS_CONFIG from @lensing/core', () => {
    expect(DEFAULT_KEN_BURNS_CONFIG).toBeDefined();
    expect(DEFAULT_KEN_BURNS_CONFIG.duration).toBeGreaterThan(0);
  });

  it('should export DEFAULT_CYCLE_INTERVAL_MS from @lensing/core', () => {
    expect(DEFAULT_CYCLE_INTERVAL_MS).toBeGreaterThan(0);
  });

  it('should export SUPPORTED_IMAGE_EXTENSIONS from @lensing/core', () => {
    expect(SUPPORTED_IMAGE_EXTENSIONS).toContain('.jpg');
    expect(SUPPORTED_IMAGE_EXTENSIONS).toContain('.png');
  });

  it('should have plugin.json manifest in plugin directory', () => {
    const manifestPath = path.join(PLUGIN_DIR, 'plugin.json');
    expect(fs.existsSync(manifestPath)).toBe(true);
  });

  it('should have valid plugin.json with required fields', () => {
    const manifestPath = path.join(PLUGIN_DIR, 'plugin.json');
    const manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf-8'));
    expect(manifest.id).toBeTruthy();
    expect(manifest.name).toBeTruthy();
    expect(manifest.version).toBeTruthy();
  });

  it('should have widget_sizes in plugin.json', () => {
    const manifestPath = path.join(PLUGIN_DIR, 'plugin.json');
    const manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf-8'));
    expect(manifest.widget_sizes).toBeDefined();
    expect(Array.isArray(manifest.widget_sizes) || typeof manifest.widget_sizes === 'object').toBe(true);
  });
});
