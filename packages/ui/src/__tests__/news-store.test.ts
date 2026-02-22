import { describe, it, expect, vi } from 'vitest';
import { createNewsStore } from '../news-store';
import type { NewsData } from '@lensing/types';

// ── Test helpers ─────────────────────────────────────────────────────────────

function makeArticle(overrides: Partial<ReturnType<typeof makeArticle>> = {}) {
  return {
    id: 'article-1',
    title: 'Test Article',
    summary: 'This is a summary of the test article for display purposes',
    link: 'https://example.com/article-1',
    published: Date.now() - 3600_000,
    source: 'Test Feed',
    category: 'technology',
    ...overrides,
  };
}

function makeData(overrides: Partial<NewsData> = {}): NewsData {
  return {
    articles: [makeArticle(), makeArticle({ id: 'article-2', category: 'world' })],
    lastUpdated: Date.now(),
    ...overrides,
  };
}

// ── Tests ────────────────────────────────────────────────────────────────────

describe('News Store', () => {
  // ── Initial state ────────────────────────────────────────────────────────

  it('should return null data, not loading, no error initially', () => {
    const store = createNewsStore();
    const state = store.getState();
    expect(state.data).toBeNull();
    expect(state.isLoading).toBe(false);
    expect(state.error).toBeNull();
  });

  // ── setData ──────────────────────────────────────────────────────────────

  it('should update data and clear error on setData', () => {
    const store = createNewsStore();
    const data = makeData();

    store.setData(data);
    const state = store.getState();

    expect(state.data).not.toBeNull();
    expect(state.data!.articles).toHaveLength(2);
    expect(state.isLoading).toBe(false);
    expect(state.error).toBeNull();
  });

  it('should return defensive copy from getState', () => {
    const store = createNewsStore();
    const data = makeData();
    store.setData(data);

    const state1 = store.getState();
    const state2 = store.getState();

    expect(state1).toEqual(state2);
    expect(state1.data).not.toBe(state2.data);
    expect(state1.data!.articles).not.toBe(state2.data!.articles);
  });

  // ── setLoading ───────────────────────────────────────────────────────────

  it('should update loading state', () => {
    const store = createNewsStore();
    store.setLoading(true);
    expect(store.getState().isLoading).toBe(true);
    store.setLoading(false);
    expect(store.getState().isLoading).toBe(false);
  });

  // ── setError ─────────────────────────────────────────────────────────────

  it('should set error and clear data on setError', () => {
    const store = createNewsStore();
    store.setData(makeData());
    store.setError('Feed unavailable');

    const state = store.getState();
    expect(state.error).toBe('Feed unavailable');
    expect(state.data).toBeNull();
    expect(state.isLoading).toBe(false);
  });

  // ── onChange ─────────────────────────────────────────────────────────────

  it('should notify onChange when setData is called', () => {
    const store = createNewsStore();
    const callback = vi.fn();
    store.onChange(callback);

    store.setData(makeData());
    expect(callback).toHaveBeenCalledTimes(1);
  });

  it('should notify onChange when setLoading is called', () => {
    const store = createNewsStore();
    const callback = vi.fn();
    store.onChange(callback);

    store.setLoading(true);
    expect(callback).toHaveBeenCalledTimes(1);
  });

  it('should notify onChange when setError is called', () => {
    const store = createNewsStore();
    const callback = vi.fn();
    store.onChange(callback);

    store.setError('Error');
    expect(callback).toHaveBeenCalledTimes(1);
  });

  it('should allow unsubscribing from onChange', () => {
    const store = createNewsStore();
    const callback = vi.fn();
    const unsubscribe = store.onChange(callback);
    unsubscribe();

    store.setData(makeData());
    expect(callback).not.toHaveBeenCalled();
  });

  it('should isolate callback errors from other callbacks', () => {
    const store = createNewsStore();
    const goodCallback = vi.fn();

    store.onChange(() => {
      throw new Error('Bad callback');
    });
    store.onChange(goodCallback);

    store.setData(makeData());
    expect(goodCallback).toHaveBeenCalledTimes(1);
  });

  // ── isStale ──────────────────────────────────────────────────────────────

  it('should not be stale when no data loaded', () => {
    const store = createNewsStore();
    expect(store.isStale()).toBe(false);
  });

  it('should not be stale when data is fresh', () => {
    const store = createNewsStore({ maxStale_ms: 60_000 });
    store.setData(makeData({ lastUpdated: Date.now() }));
    expect(store.isStale()).toBe(false);
  });

  it('should be stale when data exceeds maxStale_ms', () => {
    const store = createNewsStore({ maxStale_ms: 60_000 });
    store.setData(makeData({ lastUpdated: Date.now() - 60_001 }));
    expect(store.isStale()).toBe(true);
  });

  // ── getByCategory ────────────────────────────────────────────────────────

  it('should filter articles by category', () => {
    const store = createNewsStore();
    store.setData(makeData());

    const tech = store.getByCategory('technology');
    expect(tech).toHaveLength(1);
    expect(tech[0].category).toBe('technology');
  });

  it('should return empty array when no data loaded', () => {
    const store = createNewsStore();
    expect(store.getByCategory('technology')).toEqual([]);
  });

  it('should return empty array when category not found', () => {
    const store = createNewsStore();
    store.setData(makeData());
    expect(store.getByCategory('sports')).toEqual([]);
  });

  // ── getCategories ────────────────────────────────────────────────────────

  it('should return unique categories from articles', () => {
    const store = createNewsStore();
    store.setData(makeData());

    const categories = store.getCategories();
    expect(categories).toContain('technology');
    expect(categories).toContain('world');
    expect(categories).toHaveLength(2);
  });

  it('should return empty array from getCategories when no data', () => {
    const store = createNewsStore();
    expect(store.getCategories()).toEqual([]);
  });

  // ── truncateSummary ──────────────────────────────────────────────────────

  it('should truncate long summaries with ellipsis', () => {
    const store = createNewsStore();
    const longText = 'A'.repeat(200);
    const result = store.truncateSummary(longText, 100);
    expect(result.length).toBeLessThanOrEqual(103); // 100 + '...'
    expect(result.endsWith('...')).toBe(true);
  });

  it('should not truncate short summaries', () => {
    const store = createNewsStore();
    const shortText = 'Short summary';
    const result = store.truncateSummary(shortText, 100);
    expect(result).toBe(shortText);
    expect(result.endsWith('...')).toBe(false);
  });
});
