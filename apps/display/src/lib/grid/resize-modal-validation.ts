/**
 * Pure validation helpers for WidgetResizeModal.
 * Keeps validation logic testable without DOM.
 */

export interface WidgetPosition {
  x: number;
  y: number;
  w: number;
  h: number;
}

export interface WidgetConstraints {
  minW: number;
  minH: number;
  maxW: number;
  maxH: number;
}

export interface ValidationResult {
  valid: boolean;
  errors: string[];
}

/** Validate a widget position within a grid of given column count */
export function validatePosition(pos: WidgetPosition, cols: number): ValidationResult {
  const errors: string[] = [];

  if (pos.x < 0) errors.push('X position must be 0 or greater');
  if (pos.y < 0) errors.push('Y position must be 0 or greater');
  if (pos.w < 1) errors.push('Width must be at least 1');
  if (pos.h < 1) errors.push('Height must be at least 1');
  if (pos.x + pos.w > cols) errors.push(`Widget extends beyond grid (max ${cols} columns)`);

  return { valid: errors.length === 0, errors };
}

/** Clamp a position to the given min/max constraints */
export function clampToConstraints(
  pos: WidgetPosition,
  constraints: WidgetConstraints,
): WidgetPosition {
  return {
    x: pos.x,
    y: pos.y,
    w: Math.max(constraints.minW, Math.min(constraints.maxW, pos.w)),
    h: Math.max(constraints.minH, Math.min(constraints.maxH, pos.h)),
  };
}
