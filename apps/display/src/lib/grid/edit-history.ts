/**
 * Undo/redo history stack for grid widget editing.
 * Pure logic — no framework dependencies.
 */

import type { GridWidget } from './types';

const MAX_DEPTH = 50;

export interface EditHistory {
  /** Push a new state snapshot onto the stack */
  pushState(widgets: GridWidget[]): void;
  /** Undo to the previous state, returns restored snapshot */
  undo(): GridWidget[];
  /** Redo to the next state, returns restored snapshot */
  redo(): GridWidget[];
  /** Whether there are states to undo to */
  canUndo(): boolean;
  /** Whether there are states to redo to */
  canRedo(): boolean;
  /** Whether the current state differs from the base state */
  isDirty(): boolean;
  /** Reset history with a new base state (clears undo/redo) */
  reset(widgets: GridWidget[]): void;
  /** Get the current state snapshot */
  getCurrent(): GridWidget[];
}

function cloneWidgets(widgets: GridWidget[]): GridWidget[] {
  return widgets.map((w) => ({ ...w }));
}

function widgetsEqual(a: GridWidget[], b: GridWidget[]): boolean {
  if (a.length !== b.length) return false;
  for (let i = 0; i < a.length; i++) {
    if (
      a[i].id !== b[i].id ||
      a[i].x !== b[i].x ||
      a[i].y !== b[i].y ||
      a[i].w !== b[i].w ||
      a[i].h !== b[i].h
    ) {
      return false;
    }
  }
  return true;
}

/**
 * Create a new edit history stack initialized with the given base state.
 * The base state is treated as the "saved" state for dirty detection.
 */
export function createEditHistory(initialWidgets: GridWidget[]): EditHistory {
  let baseState = cloneWidgets(initialWidgets);
  const undoStack: GridWidget[][] = [];
  const redoStack: GridWidget[][] = [];
  let current = cloneWidgets(initialWidgets);

  return {
    pushState(widgets: GridWidget[]) {
      undoStack.push(cloneWidgets(current));
      current = cloneWidgets(widgets);
      // Clear redo stack on new action
      redoStack.length = 0;
      // Cap undo depth
      if (undoStack.length > MAX_DEPTH) {
        undoStack.shift();
      }
    },

    undo(): GridWidget[] {
      if (undoStack.length === 0) return cloneWidgets(current);
      redoStack.push(cloneWidgets(current));
      current = undoStack.pop()!;
      return cloneWidgets(current);
    },

    redo(): GridWidget[] {
      if (redoStack.length === 0) return cloneWidgets(current);
      undoStack.push(cloneWidgets(current));
      current = redoStack.pop()!;
      return cloneWidgets(current);
    },

    canUndo(): boolean {
      return undoStack.length > 0;
    },

    canRedo(): boolean {
      return redoStack.length > 0;
    },

    isDirty(): boolean {
      return !widgetsEqual(current, baseState);
    },

    reset(widgets: GridWidget[]) {
      baseState = cloneWidgets(widgets);
      current = cloneWidgets(widgets);
      undoStack.length = 0;
      redoStack.length = 0;
    },

    getCurrent(): GridWidget[] {
      return cloneWidgets(current);
    },
  };
}
