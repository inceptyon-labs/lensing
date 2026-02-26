/** Position and size of a single widget in the grid */
export interface GridWidget {
  /** Unique identifier (typically plugin_id) */
  id: string;
  /** Column position (0-based) */
  x: number;
  /** Row position (0-based) */
  y: number;
  /** Width in columns */
  w: number;
  /** Height in rows */
  h: number;
  /** Minimum width in columns */
  minW?: number;
  /** Minimum height in rows */
  minH?: number;
  /** Maximum width in columns */
  maxW?: number;
  /** Maximum height in rows */
  maxH?: number;
  /** Whether the widget is locked (cannot move/resize) */
  locked?: boolean;
  /** Whether to show the header bar (default: true) */
  showHeader?: boolean;
}

/** Grid layout policy / options */
export interface GridPolicy {
  /** Number of columns (default: 12) */
  columns: number;
  /** Row height in pixels (default: 60) */
  rowHeight: number;
  /** Cell margin [horizontal, vertical] in pixels */
  margin: [number, number];
  /** Compaction mode: 'vertical' | 'horizontal' | 'none' */
  compact: 'vertical' | 'horizontal' | 'none';
  /** Whether items can float (not compacted) */
  float?: boolean;
  /** Resize handles to show (combination of 'n','ne','e','se','s','sw','w','nw') */
  resizeHandles: string[];
  /** Minimum number of rows */
  minRow?: number;
  /** Maximum number of rows (0 = no limit) */
  maxRow?: number;
  /** Animation speed in ms (0 = no animation) */
  animate?: number;
  /** Touch hold delay before drag begins on touch devices (ms) */
  touchDelay?: number;
  /** Minimum pointer movement to initiate drag (px) */
  moveTolerance?: number;
}

/** Default grid policy for the lensing dashboard */
export const DEFAULT_GRID_POLICY: GridPolicy = {
  columns: 12,
  rowHeight: 60,
  margin: [5, 5],
  compact: 'vertical',
  float: false,
  resizeHandles: ['n', 'ne', 'e', 'se', 's', 'sw', 'w', 'nw'],
  minRow: 1,
  maxRow: 0,
  animate: 150,
};
