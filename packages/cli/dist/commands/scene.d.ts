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
export declare function listScenes(options: ListScenesOptions): string;
/** Validate and return result for switching to a scene */
export declare function switchScene(options: SwitchSceneOptions): SwitchSceneResult;
//# sourceMappingURL=scene.d.ts.map