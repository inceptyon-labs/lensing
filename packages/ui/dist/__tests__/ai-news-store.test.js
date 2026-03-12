import { describe, it, expect, vi } from 'vitest';
import { createAiNewsStore } from '../ai-news-store';
// ── Test helpers ─────────────────────────────────────────────────────────────
function makeSummary(overrides = {}) {
    return {
        id: 'article-1',
        title: 'Test Headline',
        summary: 'AI-generated summary of the headline.',
        link: 'https://example.com/1',
        published: Date.now(),
        source: 'Test News',
        category: 'general',
        ...overrides,
    };
}
function makeData(overrides = {}) {
    return {
        summaries: [
            makeSummary(),
            makeSummary({ id: 'article-2', title: 'Second', source: 'Tech Daily', category: 'tech' }),
        ],
        lastUpdated: Date.now(),
        ...overrides,
    };
}
// ── Tests ────────────────────────────────────────────────────────────────────
describe('AI News Store', () => {
    // ── Initial State ────────────────────────────────────────────────────────
    it('should initialize with null data, not loading, no error', () => {
        const store = createAiNewsStore();
        const state = store.getState();
        expect(state.data).toBeNull();
        expect(state.isLoading).toBe(false);
        expect(state.error).toBeNull();
    });
    // ── setData ──────────────────────────────────────────────────────────────
    it('should update state when setData is called', () => {
        const store = createAiNewsStore();
        store.setData(makeData());
        const state = store.getState();
        expect(state.data).not.toBeNull();
        expect(state.data.summaries).toHaveLength(2);
        expect(state.isLoading).toBe(false);
        expect(state.error).toBeNull();
    });
    it('should return defensive copies from getState', () => {
        const store = createAiNewsStore();
        store.setData(makeData());
        const s1 = store.getState();
        const s2 = store.getState();
        expect(s1.data).not.toBe(s2.data);
        expect(s1.data.summaries[0]).not.toBe(s2.data.summaries[0]);
    });
    it('should clear error when setData is called', () => {
        const store = createAiNewsStore();
        store.setError('some error');
        store.setData(makeData());
        expect(store.getState().error).toBeNull();
    });
    // ── setLoading ──────────────────────────────────────────────────────────
    it('should update loading state', () => {
        const store = createAiNewsStore();
        store.setLoading(true);
        expect(store.getState().isLoading).toBe(true);
        store.setLoading(false);
        expect(store.getState().isLoading).toBe(false);
    });
    // ── setError ──────────────────────────────────────────────────────────
    it('should set error and clear data', () => {
        const store = createAiNewsStore();
        store.setData(makeData());
        store.setError('failed');
        const state = store.getState();
        expect(state.error).toBe('failed');
        expect(state.data).toBeNull();
        expect(state.isLoading).toBe(false);
    });
    // ── isStale ──────────────────────────────────────────────────────────────
    it('should return false when no data', () => {
        expect(createAiNewsStore().isStale()).toBe(false);
    });
    it('should return false when data is fresh', () => {
        const store = createAiNewsStore({ maxStale_ms: 60_000 });
        store.setData(makeData({ lastUpdated: Date.now() }));
        expect(store.isStale()).toBe(false);
    });
    it('should return true when data is stale', () => {
        const store = createAiNewsStore({ maxStale_ms: 1000 });
        store.setData(makeData({ lastUpdated: Date.now() - 2000 }));
        expect(store.isStale()).toBe(true);
    });
    it('should return true when lastUpdated is NaN', () => {
        const store = createAiNewsStore();
        store.setData(makeData({ lastUpdated: NaN }));
        expect(store.isStale()).toBe(true);
    });
    // ── onChange ──────────────────────────────────────────────────────────────
    it('should notify listeners on setData', () => {
        const store = createAiNewsStore();
        const cb = vi.fn();
        store.onChange(cb);
        store.setData(makeData());
        expect(cb).toHaveBeenCalledTimes(1);
    });
    it('should support unsubscribing', () => {
        const store = createAiNewsStore();
        const cb = vi.fn();
        const unsub = store.onChange(cb);
        unsub();
        store.setData(makeData());
        expect(cb).not.toHaveBeenCalled();
    });
    it('should isolate listener errors', () => {
        const store = createAiNewsStore();
        store.onChange(() => {
            throw new Error('bad');
        });
        const goodCb = vi.fn();
        store.onChange(goodCb);
        store.setData(makeData());
        expect(goodCb).toHaveBeenCalledTimes(1);
    });
    // ── getByCategory ──────────────────────────────────────────────────────
    it('should return empty array when no data', () => {
        expect(createAiNewsStore().getByCategory('tech')).toEqual([]);
    });
    it('should filter by category', () => {
        const store = createAiNewsStore();
        store.setData(makeData());
        const tech = store.getByCategory('tech');
        expect(tech).toHaveLength(1);
        expect(tech[0].category).toBe('tech');
    });
    // ── getBySource ──────────────────────────────────────────────────────
    it('should filter by source (case-insensitive, partial match)', () => {
        const store = createAiNewsStore();
        store.setData(makeData());
        const results = store.getBySource('tech');
        expect(results).toHaveLength(1);
        expect(results[0].source).toBe('Tech Daily');
    });
    // ── getCategories / getSources ──────────────────────────────────────
    it('should return unique categories', () => {
        const store = createAiNewsStore();
        store.setData(makeData());
        expect(store.getCategories()).toEqual(expect.arrayContaining(['general', 'tech']));
    });
    it('should return unique sources', () => {
        const store = createAiNewsStore();
        store.setData(makeData());
        expect(store.getSources()).toEqual(expect.arrayContaining(['Test News', 'Tech Daily']));
    });
    it('should return empty arrays when no data for categories/sources', () => {
        const store = createAiNewsStore();
        expect(store.getCategories()).toEqual([]);
        expect(store.getSources()).toEqual([]);
    });
});
//# sourceMappingURL=ai-news-store.test.js.map