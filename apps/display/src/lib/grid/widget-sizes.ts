import type { GridSpan, PluginManifest, WidgetSize } from '@lensing/types';

/** Default size constraints for built-in widgets */
export const WIDGET_SIZE_REGISTRY: Record<string, GridSpan> = {
  // Small widgets
  weather: {
    min: [3, 2],
    preferred: [6, 4],
    max: [12, 8],
  },
  allergies: {
    min: [3, 2],
    preferred: [6, 3],
    max: [12, 6],
  },
  crypto: {
    min: [3, 2],
    preferred: [5, 4],
    max: [12, 8],
  },
  // Medium widgets
  news: {
    min: [4, 3],
    preferred: [8, 4],
    max: [16, 10],
  },
  sports: {
    min: [3, 2],
    preferred: [5, 4],
    max: [12, 8],
  },
  // Large widgets
  'photo-slideshow': {
    min: [4, 3],
    preferred: [8, 5],
    max: [24, 12],
  },
  calendar: {
    min: [4, 3],
    preferred: [8, 5],
    max: [16, 10],
  },
  'home-assistant': {
    min: [4, 3],
    preferred: [8, 5],
    max: [16, 10],
  },
};

/** Fallback constraints for unknown/third-party plugins */
export const DEFAULT_WIDGET_SIZE: GridSpan = {
  min: [2, 2],
  preferred: [4, 3],
  max: [24, 12],
};

/** Type guard for GridSpan vs WidgetSize[] */
export function isGridSpan(sizes: WidgetSize[] | GridSpan | unknown): sizes is GridSpan {
  return (
    sizes !== null &&
    typeof sizes === 'object' &&
    !Array.isArray(sizes) &&
    'min' in sizes &&
    'preferred' in sizes &&
    'max' in sizes
  );
}

/**
 * Get size constraints for a plugin, checking manifest first,
 * then registry, then falling back to defaults.
 */
export function getWidgetConstraints(pluginId: string, manifest?: PluginManifest): GridSpan {
  // 1. Check manifest widget_sizes (if it's a GridSpan)
  if (manifest?.widget_sizes && isGridSpan(manifest.widget_sizes)) {
    return manifest.widget_sizes;
  }
  // 2. Check registry
  if (pluginId in WIDGET_SIZE_REGISTRY) {
    return WIDGET_SIZE_REGISTRY[pluginId];
  }
  // 3. Default
  return DEFAULT_WIDGET_SIZE;
}

/**
 * Convert GridSpan to GridWidget constraint fields.
 * Maps [cols, rows] tuple format to minW/minH/maxW/maxH.
 */
export function toGridWidgetConstraints(span: GridSpan): {
  minW: number;
  minH: number;
  maxW: number;
  maxH: number;
} {
  return {
    minW: span.min[0],
    minH: span.min[1],
    maxW: span.max[0],
    maxH: span.max[1],
  };
}

/**
 * Get preferred size for initial placement.
 */
export function getPreferredSize(
  pluginId: string,
  manifest?: PluginManifest
): { w: number; h: number } {
  const constraints = getWidgetConstraints(pluginId, manifest);
  return {
    w: constraints.preferred[0],
    h: constraints.preferred[1],
  };
}
