import type { PluginAdminEntry } from '@lensing/types';
import type { GridWidget } from './types';

/** Position/size layout for a widget (without id) */
export interface WidgetLayout {
  x: number;
  y: number;
  w: number;
  h: number;
}

/** Default layout positions for known built-in plugins on a 12-column grid */
export const DEFAULT_WIDGET_LAYOUTS: Record<string, WidgetLayout> = {
  weather: { x: 0, y: 0, w: 3, h: 4 },
  news: { x: 3, y: 0, w: 4, h: 4 },
  sports: { x: 7, y: 0, w: 3, h: 4 },
  crypto: { x: 10, y: 0, w: 2, h: 4 },
  calendar: { x: 0, y: 4, w: 4, h: 5 },
  'home-assistant': { x: 4, y: 4, w: 4, h: 5 },
  'photo-slideshow': { x: 8, y: 4, w: 4, h: 5 },
  allergies: { x: 0, y: 9, w: 3, h: 3 },
};

/** Default size for unknown plugins */
const FALLBACK_WIDGET_SIZE = { w: 3, h: 4 };

/**
 * Track the next auto-placement row for unknown plugins.
 * Resets each time pluginsToGridWidgets is called.
 */
let _autoPlaceCol = 0;
let _autoPlaceRow = 12;

/**
 * Get the layout for a known plugin, or generate a fallback position for unknown ones.
 * For unknown plugins, auto-places at the next available position on a 24-col grid.
 */
export function getWidgetLayout(pluginId: string): WidgetLayout {
  const known = DEFAULT_WIDGET_LAYOUTS[pluginId];
  if (known) return known;

  // Auto-place unknown plugins below the known ones
  const layout: WidgetLayout = {
    x: _autoPlaceCol,
    y: _autoPlaceRow,
    w: FALLBACK_WIDGET_SIZE.w,
    h: FALLBACK_WIDGET_SIZE.h,
  };

  // Advance auto-placement cursor
  _autoPlaceCol += FALLBACK_WIDGET_SIZE.w;
  if (_autoPlaceCol + FALLBACK_WIDGET_SIZE.w > 12) {
    _autoPlaceCol = 0;
    _autoPlaceRow += FALLBACK_WIDGET_SIZE.h;
  }

  return layout;
}

/**
 * Convert an array of PluginAdminEntry to GridWidget[] for the GridStack adapter.
 * Only includes enabled plugins.
 */
export function pluginsToGridWidgets(plugins: PluginAdminEntry[]): GridWidget[] {
  // Reset auto-placement for each conversion
  _autoPlaceCol = 0;
  _autoPlaceRow = 12;

  return plugins
    .filter((p) => p.enabled)
    .map((p) => {
      const layout = getWidgetLayout(p.plugin_id);
      return {
        id: p.plugin_id,
        x: layout.x,
        y: layout.y,
        w: layout.w,
        h: layout.h,
      };
    });
}
