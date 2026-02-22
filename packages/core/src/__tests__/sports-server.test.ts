import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { createSportsServer } from '../sports-server';
import { createDataBus } from '../data-bus';
import { createNotificationQueue } from '../notification-queue';
import type { DataBusInstance, SportsData, FetchFn } from '@lensing/types';
import type { NotificationQueueInstance } from '../notification-queue';

// ── Test helpers ─────────────────────────────────────────────────────────────

function makeEspnGame(overrides: Record<string, unknown> = {}): Record<string, unknown> {
  return {
    id: 'game-1',
    status: { type: { state: 'in', completed: false, description: 'In Progress' } },
    competitions: [
      {
        competitors: [
          {
            homeAway: 'home',
            team: { displayName: 'Kansas City Chiefs', abbreviation: 'KC' },
            score: '21',
          },
          {
            homeAway: 'away',
            team: { displayName: 'Philadelphia Eagles', abbreviation: 'PHI' },
            score: '17',
          },
        ],
        status: {
          type: { state: 'in', completed: false, description: 'In Progress' },
          period: 3,
          displayClock: '8:42',
        },
        venue: { fullName: 'Arrowhead Stadium' },
        date: '2024-01-15T18:00:00Z',
      },
    ],
    ...overrides,
  };
}

function makeEspnResponse(games: Record<string, unknown>[] = []): Record<string, unknown> {
  return {
    events: games,
  };
}

function createMockFetch(responseData: unknown): FetchFn {
  return vi.fn().mockResolvedValue({
    ok: true,
    status: 200,
    json: async () => responseData,
  }) as unknown as FetchFn;
}

function createErrorFetch(status: number): FetchFn {
  return vi.fn().mockResolvedValue({
    ok: false,
    status,
    statusText: 'Not Found',
    json: async () => ({}),
  }) as unknown as FetchFn;
}

function createNetworkErrorFetch(): FetchFn {
  return vi.fn().mockRejectedValue(new Error('Network error')) as unknown as FetchFn;
}

// ── Tests ────────────────────────────────────────────────────────────────────

describe('Sports Server', () => {
  let dataBus: DataBusInstance;
  let notifications: NotificationQueueInstance;

  beforeEach(() => {
    dataBus = createDataBus();
    notifications = createNotificationQueue();
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  // ── Configuration ────────────────────────────────────────────────────────

  it('should throw if leagues is empty', () => {
    expect(() =>
      createSportsServer({
        leagues: [],
        dataBus,
        notifications,
      })
    ).toThrow('leagues');
  });

  it('should throw if leagues is missing', () => {
    expect(() =>
      createSportsServer({
        leagues: undefined as unknown as [],
        dataBus,
        notifications,
      })
    ).toThrow();
  });

  // ── Fetching & Parsing ───────────────────────────────────────────────────

  it('should parse ESPN scoreboard response and return games', async () => {
    const server = createSportsServer({
      leagues: [{ sport: 'football', league: 'nfl' }],
      dataBus,
      notifications,
      fetchFn: createMockFetch(makeEspnResponse([makeEspnGame()])),
    });

    await server.refresh();
    const data = server.getScores();

    expect(data).not.toBeNull();
    expect(data!.games).toHaveLength(1);
    expect(data!.games[0].homeTeam).toBe('Kansas City Chiefs');
    expect(data!.games[0].awayTeam).toBe('Philadelphia Eagles');
    expect(data!.games[0].homeScore).toBe(21);
    expect(data!.games[0].awayScore).toBe(17);
    expect(data!.games[0].league).toBe('nfl');
    expect(data!.lastUpdated).toBeGreaterThan(0);

    server.close();
  });

  it('should map ESPN game status to GameStatus', async () => {
    const inProgressGame = makeEspnGame({
      status: { type: { state: 'in', completed: false, description: 'In Progress' } },
    });
    const finalGame = makeEspnGame({
      id: 'game-2',
      status: { type: { state: 'post', completed: true, description: 'Final' } },
    });

    const server = createSportsServer({
      leagues: [{ sport: 'football', league: 'nfl' }],
      dataBus,
      notifications,
      fetchFn: createMockFetch(makeEspnResponse([inProgressGame, finalGame])),
    });

    await server.refresh();
    const data = server.getScores();

    expect(data!.games[0].status).toBe('in_progress');
    expect(data!.games[1].status).toBe('final');

    server.close();
  });

  it('should map ESPN pre-game status to scheduled', async () => {
    const scheduledGame = makeEspnGame({
      status: { type: { state: 'pre', completed: false, description: 'Scheduled' } },
    });

    const server = createSportsServer({
      leagues: [{ sport: 'football', league: 'nfl' }],
      dataBus,
      notifications,
      fetchFn: createMockFetch(makeEspnResponse([scheduledGame])),
    });

    await server.refresh();
    const data = server.getScores();

    expect(data!.games[0].status).toBe('scheduled');

    server.close();
  });

  it('should handle empty scoreboard (no games)', async () => {
    const server = createSportsServer({
      leagues: [{ sport: 'football', league: 'nfl' }],
      dataBus,
      notifications,
      fetchFn: createMockFetch(makeEspnResponse([])),
    });

    await server.refresh();
    const data = server.getScores();

    expect(data).not.toBeNull();
    expect(data!.games).toHaveLength(0);

    server.close();
  });

  it('should aggregate games from multiple leagues', async () => {
    const fetchFn = createMockFetch(makeEspnResponse([makeEspnGame()]));
    const server = createSportsServer({
      leagues: [
        { sport: 'football', league: 'nfl' },
        { sport: 'basketball', league: 'nba' },
      ],
      dataBus,
      notifications,
      fetchFn,
    });

    await server.refresh();

    expect(fetchFn).toHaveBeenCalledTimes(2);
    const data = server.getScores();
    // 1 game per league × 2 leagues = 2 total
    expect(data!.games).toHaveLength(2);

    server.close();
  });

  it('should tag each game with its league', async () => {
    const fetchFn = vi
      .fn()
      .mockResolvedValueOnce({
        ok: true,
        json: async () => makeEspnResponse([makeEspnGame()]),
      })
      .mockResolvedValueOnce({
        ok: true,
        json: async () =>
          makeEspnResponse([
            makeEspnGame({
              id: 'nba-game-1',
              competitions: [
                {
                  competitors: [
                    {
                      homeAway: 'home',
                      team: { displayName: 'Lakers', abbreviation: 'LAL' },
                      score: '105',
                    },
                    {
                      homeAway: 'away',
                      team: { displayName: 'Celtics', abbreviation: 'BOS' },
                      score: '98',
                    },
                  ],
                  status: {
                    type: { state: 'post', completed: true, description: 'Final' },
                    period: 4,
                    displayClock: '0:00',
                  },
                  date: '2024-01-15T20:00:00Z',
                },
              ],
            }),
          ]),
      }) as unknown as FetchFn;

    const server = createSportsServer({
      leagues: [
        { sport: 'football', league: 'nfl' },
        { sport: 'basketball', league: 'nba' },
      ],
      dataBus,
      notifications,
      fetchFn,
    });

    await server.refresh();
    const data = server.getScores();

    const nflGame = data!.games.find((g) => g.league === 'nfl');
    const nbaGame = data!.games.find((g) => g.league === 'nba');
    expect(nflGame).toBeDefined();
    expect(nbaGame).toBeDefined();

    server.close();
  });

  // ── Data Bus Publishing ──────────────────────────────────────────────────

  it('should publish to sports.scores data bus channel', async () => {
    const published: unknown[] = [];
    dataBus.subscribe('sports.scores', (msg) => published.push(msg.data));

    const server = createSportsServer({
      leagues: [{ sport: 'football', league: 'nfl' }],
      dataBus,
      notifications,
      fetchFn: createMockFetch(makeEspnResponse([makeEspnGame()])),
    });

    await server.refresh();

    expect(published).toHaveLength(1);
    const data = published[0] as SportsData;
    expect(data.games).toHaveLength(1);

    server.close();
  });

  // ── Callbacks ────────────────────────────────────────────────────────────

  it('should call onUpdate listeners after successful refresh', async () => {
    const onUpdate = vi.fn();
    const server = createSportsServer({
      leagues: [{ sport: 'football', league: 'nfl' }],
      dataBus,
      notifications,
      fetchFn: createMockFetch(makeEspnResponse([makeEspnGame()])),
    });

    server.onUpdate(onUpdate);
    await server.refresh();

    expect(onUpdate).toHaveBeenCalledTimes(1);

    server.close();
  });

  it('should allow unsubscribing from onUpdate', async () => {
    const onUpdate = vi.fn();
    const server = createSportsServer({
      leagues: [{ sport: 'football', league: 'nfl' }],
      dataBus,
      notifications,
      fetchFn: createMockFetch(makeEspnResponse([makeEspnGame()])),
    });

    const unsubscribe = server.onUpdate(onUpdate);
    unsubscribe();
    await server.refresh();

    expect(onUpdate).not.toHaveBeenCalled();

    server.close();
  });

  it('should call onError on fetch failure', async () => {
    const onError = vi.fn();
    const server = createSportsServer({
      leagues: [{ sport: 'football', league: 'nfl' }],
      dataBus,
      notifications,
      fetchFn: createNetworkErrorFetch(),
    });

    server.onError(onError);
    await server.refresh();

    expect(onError).toHaveBeenCalledTimes(1);
    expect(onError.mock.calls[0][0]).toContain('Network error');

    server.close();
  });

  it('should call onError on non-ok HTTP response', async () => {
    const onError = vi.fn();
    const server = createSportsServer({
      leagues: [{ sport: 'football', league: 'nfl' }],
      dataBus,
      notifications,
      fetchFn: createErrorFetch(404),
    });

    server.onError(onError);
    await server.refresh();

    expect(onError).toHaveBeenCalledTimes(1);
    expect(onError.mock.calls[0][0]).toContain('404');

    server.close();
  });

  it('should isolate listener errors from other listeners', async () => {
    const goodListener = vi.fn();
    const server = createSportsServer({
      leagues: [{ sport: 'football', league: 'nfl' }],
      dataBus,
      notifications,
      fetchFn: createMockFetch(makeEspnResponse([makeEspnGame()])),
    });

    server.onUpdate(() => {
      throw new Error('Bad listener');
    });
    server.onUpdate(goodListener);
    await server.refresh();

    expect(goodListener).toHaveBeenCalledTimes(1);

    server.close();
  });

  // ── Caching ──────────────────────────────────────────────────────────────

  it('should not re-fetch if data is still fresh', async () => {
    const fetchFn = createMockFetch(makeEspnResponse([makeEspnGame()]));
    const server = createSportsServer({
      leagues: [{ sport: 'football', league: 'nfl' }],
      maxStale_ms: 60_000,
      dataBus,
      notifications,
      fetchFn,
    });

    await server.refresh();
    await server.refresh();

    expect(fetchFn).toHaveBeenCalledTimes(1);

    server.close();
  });

  it('should re-fetch after maxStale_ms expires', async () => {
    const fetchFn = createMockFetch(makeEspnResponse([makeEspnGame()]));
    const server = createSportsServer({
      leagues: [{ sport: 'football', league: 'nfl' }],
      maxStale_ms: 60_000,
      dataBus,
      notifications,
      fetchFn,
    });

    await server.refresh();
    vi.advanceTimersByTime(60_001);
    await server.refresh();

    expect(fetchFn).toHaveBeenCalledTimes(2);

    server.close();
  });

  // ── Concurrency ──────────────────────────────────────────────────────────

  it('should prevent concurrent refreshes', async () => {
    let resolveFirst: (() => void) | undefined;
    const fetchFn = vi.fn().mockImplementation(
      () =>
        new Promise<{ ok: boolean; json: () => Promise<unknown> }>((resolve) => {
          resolveFirst = () =>
            resolve({
              ok: true,
              json: async () => makeEspnResponse([makeEspnGame()]),
            });
        })
    ) as unknown as FetchFn;

    const server = createSportsServer({
      leagues: [{ sport: 'football', league: 'nfl' }],
      maxStale_ms: 0,
      dataBus,
      notifications,
      fetchFn,
    });

    const first = server.refresh();
    const second = server.refresh();

    resolveFirst!();
    await first;
    await second;

    expect(fetchFn).toHaveBeenCalledTimes(1);

    server.close();
  });

  // ── Defensive Copies ─────────────────────────────────────────────────────

  it('should return defensive copies from getScores', async () => {
    const server = createSportsServer({
      leagues: [{ sport: 'football', league: 'nfl' }],
      dataBus,
      notifications,
      fetchFn: createMockFetch(makeEspnResponse([makeEspnGame()])),
    });

    await server.refresh();
    const data1 = server.getScores();
    const data2 = server.getScores();

    expect(data1).toEqual(data2);
    expect(data1).not.toBe(data2);
    expect(data1!.games).not.toBe(data2!.games);

    server.close();
  });

  // ── Lifecycle ────────────────────────────────────────────────────────────

  it('should return null from getScores before any refresh', () => {
    const server = createSportsServer({
      leagues: [{ sport: 'football', league: 'nfl' }],
      dataBus,
      notifications,
      fetchFn: createMockFetch(makeEspnResponse([makeEspnGame()])),
    });

    expect(server.getScores()).toBeNull();

    server.close();
  });

  it('should not fetch after close', async () => {
    const fetchFn = createMockFetch(makeEspnResponse([makeEspnGame()]));
    const server = createSportsServer({
      leagues: [{ sport: 'football', league: 'nfl' }],
      dataBus,
      notifications,
      fetchFn,
    });

    server.close();
    await server.refresh();

    expect(fetchFn).not.toHaveBeenCalled();
  });

  // ── Error Fixes (Codex review) ───────────────────────────────────────────

  it('should not map post+incomplete games as final (postponed scenario)', async () => {
    // ESPN marks postponed games with state='post', completed=false
    const postponedGame = makeEspnGame({
      id: 'postponed-1',
      status: { type: { state: 'post', completed: false, description: 'Postponed' } },
    });

    const server = createSportsServer({
      leagues: [{ sport: 'football', league: 'nfl' }],
      dataBus,
      notifications,
      fetchFn: createMockFetch(makeEspnResponse([postponedGame])),
    });

    await server.refresh();
    const data = server.getScores();

    expect(data!.games[0].status).not.toBe('final');

    server.close();
  });

  it('should skip malformed events without crashing refresh', async () => {
    const goodGame = makeEspnGame({ id: 'good-1' });
    const malformedGame = { id: 'bad-1' }; // missing status and competitions

    const server = createSportsServer({
      leagues: [{ sport: 'football', league: 'nfl' }],
      dataBus,
      notifications,
      fetchFn: createMockFetch(makeEspnResponse([malformedGame, goodGame])),
    });

    await server.refresh();
    const data = server.getScores();

    // Should have 1 game (the good one) and not crash
    expect(data).not.toBeNull();
    expect(data!.games).toHaveLength(1);
    expect(data!.games[0].id).toBe('good-1');

    server.close();
  });

  it('should release refreshing lock after fetch timeout', async () => {
    const hangingFetch: FetchFn = vi.fn().mockReturnValue(
      new Promise(() => {}) // never resolves
    ) as unknown as FetchFn;

    const server = createSportsServer({
      leagues: [{ sport: 'football', league: 'nfl' }],
      dataBus,
      notifications,
      fetchFn: hangingFetch,
    });

    const onError = vi.fn();
    server.onError(onError);

    const refreshPromise = server.refresh(); // starts, won't complete without timeout
    await vi.advanceTimersByTimeAsync(10_001); // advance past FETCH_TIMEOUT_MS (10_000)
    await refreshPromise; // should resolve now (timeout fired, refreshing lock released)

    expect(onError).toHaveBeenCalledTimes(1);
    expect(onError.mock.calls[0][0]).toContain('timeout');

    server.close();
  });
});
