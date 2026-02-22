import fs from 'fs';
import path from 'path';
import type { KenBurnsConfig } from '@lensing/types';
import { SUPPORTED_IMAGE_EXTENSIONS } from '@lensing/types';

/**
 * Discover photo files in the given directory.
 * Returns full paths filtered by supported image extensions.
 */
export function discoverPhotos(dir: string): string[] {
  if (!fs.existsSync(dir)) return [];
  const files = fs.readdirSync(dir);
  return files
    .filter((f) =>
      SUPPORTED_IMAGE_EXTENSIONS.includes(path.extname(f).toLowerCase())
    )
    .map((f) => path.join(dir, f));
}

/**
 * Calculate a CSS transform string for a Ken Burns animation frame.
 * Uses the given config and a variation index.
 */
export function calculateKenBurnsTransform(
  config: KenBurnsConfig,
  variationIndex: number
): string {
  const [scaleStart] = config.scale;
  const [panXMin, panXMax] = config.panX;
  const [panYMin, panYMax] = config.panY;

  // Pick a deterministic start position based on variation
  const variation = variationIndex % 4;
  const panX = variation % 2 === 0 ? panXMin : panXMax;
  const panY = variation < 2 ? panYMin : panYMax;

  return `transform: scale(${scaleStart}) translate(${panX}%, ${panY}%)`;
}

/**
 * Get the next photo index, wrapping around.
 */
export function getNextPhotoIndex(current: number, total: number): number {
  if (total <= 1) return 0;
  return (current + 1) % total;
}
