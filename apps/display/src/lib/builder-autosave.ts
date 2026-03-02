import type { CanvasSize } from './canvas-sizes';

export interface WizardMetadata {
  name: string;
  description: string;
  category: string;
  icon: string;
  id: string;
}

export interface ConnectorConfig {
  selectedType: string;
  url?: string;
  method?: string;
  refreshInterval: number;
  headers: Array<{ key: string; value: string }>;
  [key: string]: unknown;
}

export interface WizardState {
  metadata: WizardMetadata;
  connectorConfig: ConnectorConfig | null;
  fieldMappings: Record<string, { path: string; value: unknown }>;
  editorProject: Record<string, unknown> | null;
  currentStep: number;
  canvasSize: CanvasSize;
}

interface StoredState extends WizardState {
  timestamp: number;
}

const KEY_PREFIX = 'lensing:builder:';

function storageKey(pluginId: string): string {
  return `${KEY_PREFIX}${pluginId}`;
}

export function saveWizardState(pluginId: string, state: WizardState): void {
  try {
    const stored: StoredState = { ...state, timestamp: Date.now() };
    localStorage.setItem(storageKey(pluginId), JSON.stringify(stored));
  } catch {
    // localStorage unavailable (SSR, private browsing, quota exceeded)
  }
}

export function loadWizardState(pluginId: string): WizardState | null {
  try {
    const raw = localStorage.getItem(storageKey(pluginId));
    if (!raw) return null;
    const parsed: StoredState = JSON.parse(raw);
    const { timestamp: _, ...state } = parsed;
    return state;
  } catch {
    return null;
  }
}

export function clearWizardState(pluginId: string): void {
  try {
    localStorage.removeItem(storageKey(pluginId));
  } catch {
    // ignore
  }
}

export function hasSavedState(pluginId: string): boolean {
  try {
    return localStorage.getItem(storageKey(pluginId)) !== null;
  } catch {
    return false;
  }
}

export interface AutoSaver {
  save(state: WizardState): void;
  load(): WizardState | null;
  clear(): void;
  hasSaved(): boolean;
  startPeriodicSave(getState: () => WizardState): () => void;
  stopPeriodicSave(): void;
}

export function createAutoSaver(pluginId: string): AutoSaver {
  let intervalId: ReturnType<typeof setInterval> | null = null;

  function save(state: WizardState): void {
    saveWizardState(pluginId, state);
  }

  function load(): WizardState | null {
    return loadWizardState(pluginId);
  }

  function clear(): void {
    clearWizardState(pluginId);
  }

  function hasSaved(): boolean {
    return hasSavedState(pluginId);
  }

  function startPeriodicSave(getState: () => WizardState): () => void {
    // Save immediately
    save(getState());
    // Then every 30 seconds
    intervalId = setInterval(() => {
      save(getState());
    }, 30_000);

    return () => {
      if (intervalId !== null) {
        clearInterval(intervalId);
        intervalId = null;
      }
    };
  }

  function stopPeriodicSave(): void {
    if (intervalId !== null) {
      clearInterval(intervalId);
      intervalId = null;
    }
  }

  return { save, load, clear, hasSaved, startPeriodicSave, stopPeriodicSave };
}
