import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import fs from 'fs';
import path from 'path';
import os from 'os';
import { createPhotoSlideshowServer } from '../photo-slideshow-server';
import type { PhotoSlideshowServerOptions } from '../photo-slideshow-server';
import { createDataBus } from '../data-bus';

let tmpDir: string;

beforeEach(() => {
  tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), 'photos-'));
  // Create test images
  fs.writeFileSync(path.join(tmpDir, 'cat.jpg'), 'fake-jpg');
  fs.writeFileSync(path.join(tmpDir, 'dog.png'), 'fake-png');
  fs.writeFileSync(path.join(tmpDir, 'readme.txt'), 'not an image');
});

afterEach(() => {
  fs.rmSync(tmpDir, { recursive: true, force: true });
});

function validOptions(
  overrides: Partial<PhotoSlideshowServerOptions> = {}
): PhotoSlideshowServerOptions {
  return {
    photoDir: tmpDir,
    dataBus: createDataBus(),
    ...overrides,
  };
}

describe('PhotoSlideshowServer', () => {
  describe('factory', () => {
    it('should create a server instance with refresh and close', () => {
      const server = createPhotoSlideshowServer(validOptions());
      expect(server).toBeDefined();
      expect(typeof server.refresh).toBe('function');
      expect(typeof server.close).toBe('function');
    });

    it('should throw if photoDir is empty', () => {
      expect(() => createPhotoSlideshowServer(validOptions({ photoDir: '' }))).toThrow(/photoDir/i);
    });
  });

  describe('photo discovery', () => {
    it('should discover image files on refresh', async () => {
      const server = createPhotoSlideshowServer(validOptions());
      await server.refresh();
      const paths = server.getPhotoPaths();
      expect(paths).toHaveLength(2);
    });

    it('should return URL paths (not filesystem paths)', async () => {
      const server = createPhotoSlideshowServer(validOptions());
      await server.refresh();
      const paths = server.getPhotoPaths();
      expect(paths.every((p) => p.startsWith('/photos/'))).toBe(true);
      expect(paths.some((p) => p === '/photos/cat.jpg')).toBe(true);
      expect(paths.some((p) => p === '/photos/dog.png')).toBe(true);
    });

    it('should filter out non-image files', async () => {
      const server = createPhotoSlideshowServer(validOptions());
      await server.refresh();
      const paths = server.getPhotoPaths();
      expect(paths.every((p) => !p.includes('.txt'))).toBe(true);
    });

    it('should return empty array for non-existent directory', async () => {
      const server = createPhotoSlideshowServer(validOptions({ photoDir: '/nonexistent' }));
      await server.refresh();
      expect(server.getPhotoPaths()).toEqual([]);
    });

    it('should detect new photos on subsequent refresh', async () => {
      const server = createPhotoSlideshowServer(validOptions());
      await server.refresh();
      expect(server.getPhotoPaths()).toHaveLength(2);

      fs.writeFileSync(path.join(tmpDir, 'bird.webp'), 'fake-webp');
      await server.refresh();
      expect(server.getPhotoPaths()).toHaveLength(3);
    });
  });

  describe('data bus publishing', () => {
    it('should publish photo paths to data bus on refresh', async () => {
      const dataBus = createDataBus();
      const spy = vi.fn();
      dataBus.onMessage(spy);

      const server = createPhotoSlideshowServer(validOptions({ dataBus }));
      await server.refresh();

      expect(spy).toHaveBeenCalledTimes(1);
      const msg = spy.mock.calls[0][0];
      expect(msg.plugin_id).toBe('photo-slideshow-server');
      expect(msg.data.photoPaths).toHaveLength(2);
      expect(msg.data.lastUpdated).toBeTypeOf('number');
    });

    it('should publish to photos.paths channel', async () => {
      const dataBus = createDataBus();
      const spy = vi.fn();
      dataBus.subscribe('photos.paths', spy);

      const server = createPhotoSlideshowServer(validOptions({ dataBus }));
      await server.refresh();

      expect(spy).toHaveBeenCalledTimes(1);
    });
  });
});
