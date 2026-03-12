import type { HomeAssistantData, HassEntity } from '@lensing/types';
export interface HomeAssistantStoreOptions {
    /** Max staleness in ms before isStale() returns true (default: 120000 = 2 min) */
    maxStale_ms?: number;
}
export interface HomeAssistantStoreState {
    data: HomeAssistantData | null;
    isLoading: boolean;
    error: string | null;
}
export interface HomeAssistantStore {
    getState(): HomeAssistantStoreState;
    setData(data: HomeAssistantData): void;
    setLoading(loading: boolean): void;
    setError(error: string): void;
    isStale(): boolean;
    onChange(callback: () => void): () => void;
    getLights(): HassEntity[];
    getSwitches(): HassEntity[];
    getLocks(): HassEntity[];
    getClimate(): HassEntity[];
    getSensorsByType(deviceClass: string): HassEntity[];
}
export declare function createHomeAssistantStore(options?: HomeAssistantStoreOptions): HomeAssistantStore;
//# sourceMappingURL=home-assistant-store.d.ts.map