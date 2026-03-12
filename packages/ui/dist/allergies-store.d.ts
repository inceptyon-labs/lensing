import type { AllergyData, PollenLevel } from '@lensing/types';
export interface AllergiesStoreOptions {
    /** Max staleness in ms before isStale() returns true (default: 3600000 = 1 hour) */
    maxStale_ms?: number;
}
export interface AllergiesStoreState {
    data: AllergyData | null;
    isLoading: boolean;
    error: string | null;
}
export interface AllergiesStore {
    getState(): AllergiesStoreState;
    setData(data: AllergyData): void;
    setLoading(loading: boolean): void;
    setError(error: string): void;
    isStale(): boolean;
    getPollenLevel(index: number): PollenLevel;
    getPollenColor(index: number): string;
    onChange(callback: () => void): void;
}
export declare function createAllergiesStore(options?: AllergiesStoreOptions): AllergiesStore;
//# sourceMappingURL=allergies-store.d.ts.map