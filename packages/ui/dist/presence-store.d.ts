import type { PresenceData } from '@lensing/types';
export type PresenceStoreOptions = Record<string, never>;
export interface PresenceStoreState {
    detected: boolean;
    available: boolean;
    lastMotionAt: number;
    timeSinceMotionMs: number;
    lastUpdated: number;
}
export interface PresenceStore {
    getState(): PresenceStoreState;
    setData(data: PresenceData): void;
    isMotionDetected(): boolean;
    onChange(callback: () => void): () => void;
}
export declare function createPresenceStore(_options?: PresenceStoreOptions): PresenceStore;
//# sourceMappingURL=presence-store.d.ts.map