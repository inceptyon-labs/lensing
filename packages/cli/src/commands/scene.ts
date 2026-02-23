import type { SceneConfig, SceneScheduleEntry } from '@lensing/types';

export interface ListScenesOptions {
  scenes: SceneConfig[];
  activeSceneName: string;
  scheduleEntries?: SceneScheduleEntry[];
}

export interface SwitchSceneOptions {
  sceneName: string;
  availableScenes: string[];
}

export interface SwitchSceneResult {
  success: boolean;
  sceneName?: string;
  error?: string;
}

/** Format a list of scenes and optional schedule for display */
export function listScenes(options: ListScenesOptions): string {
  const { scenes, activeSceneName, scheduleEntries } = options;
  const lines: string[] = [];

  lines.push('Available scenes:');
  for (const scene of scenes) {
    const marker = scene.name === activeSceneName ? ' * (active)' : '';
    lines.push(`  - ${scene.name}${marker}`);
  }

  if (scheduleEntries && scheduleEntries.length > 0) {
    lines.push('');
    lines.push('Schedule:');
    for (const entry of scheduleEntries) {
      lines.push(`  ${entry.time}  →  ${entry.sceneName}`);
    }
  }

  return lines.join('\n');
}

/** Validate and return result for switching to a scene */
export function switchScene(options: SwitchSceneOptions): SwitchSceneResult {
  const { sceneName, availableScenes } = options;

  if (!sceneName) {
    return { success: false, error: 'Scene name is required' };
  }

  if (!availableScenes.includes(sceneName)) {
    return {
      success: false,
      error: `Unknown scene: "${sceneName}". Available scenes: ${availableScenes.join(', ')}`,
    };
  }

  return { success: true, sceneName };
}
