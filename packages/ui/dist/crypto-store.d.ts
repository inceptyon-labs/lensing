import type { CryptoData, CoinPrice } from '@lensing/types';
export interface CryptoStoreOptions {
    /** Max staleness in ms before isStale() returns true (default: 300000 = 5 min) */
    maxStale_ms?: number;
}
export interface CryptoStoreState {
    data: CryptoData | null;
    isLoading: boolean;
    error: string | null;
}
export interface CryptoStore {
    getState(): CryptoStoreState;
    setData(data: CryptoData): void;
    setLoading(loading: boolean): void;
    setError(error: string): void;
    getChangeColor(pct: number): string;
    getChangeLabel(pct: number): string;
    formatPrice(price: number): string;
    isStale(): boolean;
    onChange(callback: () => void): () => void;
    getCoinById(id: string): CoinPrice | null;
}
export declare function createCryptoStore(options?: CryptoStoreOptions): CryptoStore;
//# sourceMappingURL=crypto-store.d.ts.map