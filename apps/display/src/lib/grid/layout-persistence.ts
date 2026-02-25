/**
 * Layout persistence — save and load grid widget positions via REST API.
 */

import type { GridWidget } from './types';

const LAYOUT_API = '/api/layout';

/**
 * Save the current grid layout to the backend.
 * Returns true on success, false on failure.
 */
export async function saveLayout(widgets: GridWidget[]): Promise<boolean> {
  try {
    const res = await fetch(LAYOUT_API, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ widgets }),
    });
    return res.ok;
  } catch {
    return false;
  }
}

/**
 * Load the saved grid layout from the backend.
 * Returns null if not found or on error.
 */
export async function loadLayout(): Promise<GridWidget[] | null> {
  try {
    const res = await fetch(LAYOUT_API);
    if (!res.ok) return null;
    const data = await res.json();
    return data.widgets ?? null;
  } catch {
    return null;
  }
}
