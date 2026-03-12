import type { KenBurnsConfig } from '@lensing/types';
/**
 * Discover photo files in the given directory.
 * Returns full paths filtered by supported image extensions.
 */
export declare function discoverPhotos(dir: string): string[];
/**
 * Calculate a CSS transform string for a Ken Burns animation frame.
 * Uses the given config and a variation index.
 */
export declare function calculateKenBurnsTransform(config: KenBurnsConfig, variationIndex: number): string;
/**
 * Get the next photo index, wrapping around.
 */
export declare function getNextPhotoIndex(current: number, total: number): number;
//# sourceMappingURL=index.d.ts.map