export type CanvasSize = 'small' | 'medium' | 'large';

export const CANVAS_SIZES: Record<CanvasSize, { width: number; height: number }> = {
  small: { width: 200, height: 150 },
  medium: { width: 300, height: 225 },
  large: { width: 400, height: 300 },
};

export const CANVAS_SIZE_KEYS: CanvasSize[] = ['small', 'medium', 'large'];

export const DEFAULT_CANVAS_SIZE: CanvasSize = 'medium';
