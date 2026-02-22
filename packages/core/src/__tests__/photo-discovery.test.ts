import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import fs from 'fs';
import path from 'path';
import {
  discoverPhotos,
  calculateKenBurnsTransform,
  getNextPhotoIndex,
} from '../plugins/photo-slideshow/index';
import type { KenBurnsConfig } from '@lensing/types';

const TEST_PHOTO_DIR = path.join(__dirname, '.fixtures/photos');

describe('Photo Discovery & Cycling', () => {
  beforeEach(() => {
    // Create test photo directory with sample files
    if (!fs.existsSync(TEST_PHOTO_DIR)) {
      fs.mkdirSync(TEST_PHOTO_DIR, { recursive: true });
    }
    // Create dummy photo files
    fs.writeFileSync(path.join(TEST_PHOTO_DIR, 'photo1.jpg'), 'fake-jpg');
    fs.writeFileSync(path.join(TEST_PHOTO_DIR, 'photo2.png'), 'fake-png');
    fs.writeFileSync(path.join(TEST_PHOTO_DIR, 'photo3.webp'), 'fake-webp');
    fs.writeFileSync(path.join(TEST_PHOTO_DIR, 'readme.txt'), 'not-photo');
    fs.writeFileSync(path.join(TEST_PHOTO_DIR, '.DS_Store'), 'system-file');
  });

  afterEach(() => {
    // Clean up test directory
    if (fs.existsSync(TEST_PHOTO_DIR)) {
      const files = fs.readdirSync(TEST_PHOTO_DIR);
      files.forEach((f) => fs.unlinkSync(path.join(TEST_PHOTO_DIR, f)));
      fs.rmdirSync(TEST_PHOTO_DIR);
    }
  });

  it('should discover photos from directory', () => {
    const photos = discoverPhotos(TEST_PHOTO_DIR);
    expect(photos).toHaveLength(3);
    expect(photos.map((p) => path.basename(p))).toEqual(
      expect.arrayContaining(['photo1.jpg', 'photo2.png', 'photo3.webp'])
    );
  });

  it('should filter by supported image extensions only', () => {
    const photos = discoverPhotos(TEST_PHOTO_DIR);
    const extensions = photos.map((p) => path.extname(p).toLowerCase());
    expect(extensions).not.toContain('.txt');
    expect(extensions).not.toContain('.DS_Store');
    expect(extensions).toEqual(
      expect.arrayContaining(['.jpg', '.png', '.webp'])
    );
  });

  it('should return empty array for empty directory', () => {
    const emptyDir = path.join(TEST_PHOTO_DIR, 'empty');
    fs.mkdirSync(emptyDir, { recursive: true });
    try {
      const photos = discoverPhotos(emptyDir);
      expect(photos).toEqual([]);
    } finally {
      fs.rmdirSync(emptyDir);
    }
  });

  it('should calculate Ken Burns transform with start and end points', () => {
    const config: KenBurnsConfig = {
      duration: 8000,
      scale: [1.0, 1.12],
      panX: [-4, 4],
      panY: [-4, 4],
    };
    const transform = calculateKenBurnsTransform(config, 0);
    expect(transform).toBeDefined();
    expect(transform).toContain('transform:');
    expect(transform).toContain('scale');
    expect(transform).toContain('translate');
  });

  it('should cycle to next photo index', () => {
    expect(getNextPhotoIndex(0, 5)).toBe(1);
    expect(getNextPhotoIndex(4, 5)).toBe(0);
    expect(getNextPhotoIndex(2, 5)).toBe(3);
  });

  it('should handle single photo gracefully', () => {
    expect(getNextPhotoIndex(0, 1)).toBe(0);
  });
});
