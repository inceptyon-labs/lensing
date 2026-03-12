import type { SportsData, SportsGame } from '@lensing/types';
export interface SportsStoreOptions {
    /** Max staleness in ms before isStale() returns true (default: 120000 = 2 min) */
    maxStale_ms?: number;
}
export interface SportsStoreState {
    data: SportsData | null;
    isLoading: boolean;
    error: string | null;
}
export interface SportsStore {
    getState(): SportsStoreState;
    setData(data: SportsData): void;
    setLoading(loading: boolean): void;
    setError(error: string): void;
    isStale(): boolean;
    onChange(callback: () => void): () => void;
    getByLeague(league: string): SportsGame[];
    getByTeam(team: string): SportsGame[];
    getLiveGames(): SportsGame[];
    getUpcoming(): SportsGame[];
    getLeagues(): string[];
}
export declare function createSportsStore(options?: SportsStoreOptions): SportsStore;
//# sourceMappingURL=sports-store.d.ts.map