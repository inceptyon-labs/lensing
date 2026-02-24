import path from 'path';
import type { DataBusInstance } from '@lensing/types';
import { discoverPhotos } from './plugins/photo-slideshow/index';

export interface PhotoSlideshowServerOptions {
  photoDir: string;
  dataBus: DataBusInstance;
}

export interface PhotoSlideshowServerInstance {
  refresh(): Promise<void>;
  close(): void;
  getPhotoPaths(): string[];
}

export function createPhotoSlideshowServer(
  opts: PhotoSlideshowServerOptions
): PhotoSlideshowServerInstance {
  if (!opts.photoDir) {
    throw new Error('photoDir is required');
  }

  let photoPaths: string[] = [];

  return {
    async refresh(): Promise<void> {
      const fsPaths = discoverPhotos(opts.photoDir);
      photoPaths = fsPaths.map((p) => `/photos/${path.basename(p)}`);

      opts.dataBus.publish('photos.paths', 'photo-slideshow-server', {
        photoPaths,
        lastUpdated: Date.now(),
      });
    },

    close(): void {},

    getPhotoPaths(): string[] {
      return photoPaths;
    },
  };
}
