import type { SceneConfig, SceneManagerInstance, ScenePersistence } from '@lensing/types';
export declare const DEFAULT_SCENES: SceneConfig[];
export interface SceneManagerOptions {
    persistence?: ScenePersistence;
}
type SceneManagerWithLoader = SceneManagerInstance & {
    loadFromPersistence(): Promise<SceneManagerInstance>;
};
export declare function createSceneManager(options?: SceneManagerOptions): SceneManagerWithLoader;
export {};
//# sourceMappingURL=scene-manager.d.ts.map