/**
 * Mobile layout and touch configuration for the GridStack dashboard.
 * Provides constants and helpers for Pi touchscreen and mobile browser support.
 */

import type { GridPolicy } from './types';
import { DEFAULT_GRID_POLICY } from './types';

/** Touch delay before drag begins on touch devices (ms) */
export const TOUCH_DELAY = 200;

/** Minimum pointer movement to initiate a drag (px) */
export const MOVE_TOLERANCE = 5;

/** Viewport width threshold for mobile layout (px) */
export const MOBILE_BREAKPOINT = 768;

/** Column count on mobile (vs 24 on desktop) */
export const MOBILE_COLUMNS = 4;

/** WCAG minimum touch target size (px) */
export const TOUCH_TARGET_MIN = 44;

/** Row height on mobile — slightly taller for touch ergonomics */
export const MOBILE_ROW_HEIGHT = 70;

/** Corner-only resize handles for mobile (no edge handles — too small to hit) */
export const MOBILE_RESIZE_HANDLES: string[] = ['se', 'sw'];

/**
 * Returns true if the current viewport is considered mobile.
 * Safe to call in SSR (returns false when window is unavailable).
 */
export function isMobileViewport(): boolean {
  if (typeof window === 'undefined') return false;
  return window.innerWidth <= MOBILE_BREAKPOINT;
}

/**
 * Returns a GridPolicy tuned for mobile / touchscreen use.
 * Uses 4 columns, larger row height, corner-only handles,
 * and touch delay / move tolerance for accidental-scroll prevention.
 */
export function getMobileGridPolicy(): GridPolicy {
  return {
    ...DEFAULT_GRID_POLICY,
    columns: MOBILE_COLUMNS,
    rowHeight: MOBILE_ROW_HEIGHT,
    resizeHandles: MOBILE_RESIZE_HANDLES,
    touchDelay: TOUCH_DELAY,
    moveTolerance: MOVE_TOLERANCE,
    margin: [4, 4],
  };
}
