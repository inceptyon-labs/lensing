import { describe, it, expect, vi } from 'vitest';
import { createSportsStore } from '../sports-store';
import type { SportsData, SportsGame } from '@lensing/types';

// ── Test helpers ─────────────────────────────────────────────────────────────

function makeGame(overrides: Partial<SportsGame> = {}): SportsGame {
  return {
    id: 'game-1',
    league: 'nfl',
    homeTeam: 'Chiefs',
    awayTeam: 'Eagles',
    homeScore: 21,
    awayScore: 17,
    status: 'in_progress',
    startTime: Date.now() - 3600_000,
    period: 'Q3',
    ...overrides,
  };
}

function makeData(overrides: Partial<SportsData> = {}): SportsData {
  return {
    games: [makeGame(), makeGame({ id: 'game-2', league: 'nba', status: 'final' })],
    lastUpdated: Date.now(),
    ...overrides,
  };
}

// ── Tests ────────────────────────────────────────────────────────────────────

describe('Sports Store', () => {
  // ── Initial State ────────────────────────────────────────────────────────

  it('should initialize with null data, not loading, no error', () => {
    const store = createSportsStore();
    const state = store.getState();

    expect(state.data).toBeNull();
    expect(state.isLoading).toBe(false);
    expect(state.error).toBeNull();
  });

  // ── setData ──────────────────────────────────────────────────────────────

  it('should update state when setData is called', () => {
    const store = createSportsStore();
    const data = makeData();
    store.setData(data);
    const state = store.getState();

    expect(state.data).not.toBeNull();
    expect(state.data!.games).toHaveLength(2);
    expect(state.isLoading).toBe(false);
    expect(state.error).toBeNull();
  });

  it('should return defensive copies from getState', () => {
    const store = createSportsStore();
    store.setData(makeData());

    const state1 = store.getState();
    const state2 = store.getState();

    expect(state1.data).toEqual(state2.data);
    expect(state1.data).not.toBe(state2.data);
    expect(state1.data!.games).not.toBe(state2.data!.games);
  });

  // ── setLoading ───────────────────────────────────────────────────────────

  it('should update isLoading flag', () => {
    const store = createSportsStore();
    store.setLoading(true);

    expect(store.getState().isLoading).toBe(true);
  });

  // ── setError ─────────────────────────────────────────────────────────────

  it('should set error and clear data', () => {
    const store = createSportsStore();
    store.setData(makeData());
    store.setError('API error');

    const state = store.getState();
    expect(state.error).toBe('API error');
    expect(state.data).toBeNull();
    expect(state.isLoading).toBe(false);
  });

  // ── onChange ─────────────────────────────────────────────────────────────

  it('should call onChange when data changes', () => {
    const store = createSportsStore();
    const callback = vi.fn();

    store.onChange(callback);
    store.setData(makeData());

    expect(callback).toHaveBeenCalledTimes(1);
  });

  it('should allow unsubscribing from onChange', () => {
    const store = createSportsStore();
    const callback = vi.fn();

    const unsubscribe = store.onChange(callback);
    unsubscribe();
    store.setData(makeData());

    expect(callback).not.toHaveBeenCalled();
  });

  it('should isolate callback errors from other callbacks', () => {
    const store = createSportsStore();
    const goodCallback = vi.fn();

    store.onChange(() => {
      throw new Error('Bad callback');
    });
    store.onChange(goodCallback);
    store.setData(makeData());

    expect(goodCallback).toHaveBeenCalledTimes(1);
  });

  // ── isStale ──────────────────────────────────────────────────────────────

  it('should return false when data is null', () => {
    const store = createSportsStore();
    expect(store.isStale()).toBe(false);
  });

  it('should return false when data is fresh', () => {
    const store = createSportsStore({ maxStale_ms: 60_000 });
    store.setData(makeData({ lastUpdated: Date.now() }));

    expect(store.isStale()).toBe(false);
  });

  it('should return true when data is stale', () => {
    const store = createSportsStore({ maxStale_ms: 60_000 });
    store.setData(makeData({ lastUpdated: Date.now() - 61_000 }));

    expect(store.isStale()).toBe(true);
  });

  // ── getByLeague ──────────────────────────────────────────────────────────

  it('should return empty array when no data', () => {
    const store = createSportsStore();
    expect(store.getByLeague('nfl')).toEqual([]);
  });

  it('should filter games by league', () => {
    const store = createSportsStore();
    store.setData(makeData());

    const nflGames = store.getByLeague('nfl');
    const nbaGames = store.getByLeague('nba');

    expect(nflGames).toHaveLength(1);
    expect(nflGames[0].league).toBe('nfl');
    expect(nbaGames).toHaveLength(1);
    expect(nbaGames[0].league).toBe('nba');
  });

  // ── getLiveGames ─────────────────────────────────────────────────────────

  it('should return only in_progress games', () => {
    const store = createSportsStore();
    store.setData(makeData());

    const liveGames = store.getLiveGames();

    expect(liveGames).toHaveLength(1);
    expect(liveGames[0].status).toBe('in_progress');
  });

  // ── getUpcoming ──────────────────────────────────────────────────────────

  it('should return only scheduled games', () => {
    const store = createSportsStore();
    store.setData(
      makeData({
        games: [
          makeGame({ id: '1', status: 'scheduled' }),
          makeGame({ id: '2', status: 'in_progress' }),
          makeGame({ id: '3', status: 'final' }),
        ],
      })
    );

    const upcoming = store.getUpcoming();

    expect(upcoming).toHaveLength(1);
    expect(upcoming[0].status).toBe('scheduled');
  });

  // ── getLeagues ───────────────────────────────────────────────────────────

  it('should return unique leagues from data', () => {
    const store = createSportsStore();
    store.setData(makeData());

    const leagues = store.getLeagues();

    expect(leagues.sort()).toEqual(['nba', 'nfl'].sort());
  });

  it('should return empty array when no data', () => {
    const store = createSportsStore();
    expect(store.getLeagues()).toEqual([]);
  });
});
