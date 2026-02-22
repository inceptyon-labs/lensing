import { describe, it, expect } from 'vitest';
import type {
  SportsGame,
  GameStatus,
  LeagueConfig,
  SportsData,
  SportsServerOptions,
  SportsServerInstance,
} from '../sports';
import { DEFAULT_SPORTS_MAX_STALE_MS, DEFAULT_SPORTS_LEAGUES } from '../sports';

describe('Sports Types & Constants', () => {
  it('should export DEFAULT_SPORTS_MAX_STALE_MS as a positive number', () => {
    expect(DEFAULT_SPORTS_MAX_STALE_MS).toBeGreaterThan(0);
    expect(typeof DEFAULT_SPORTS_MAX_STALE_MS).toBe('number');
  });

  it('should export DEFAULT_SPORTS_LEAGUES as a non-empty array', () => {
    expect(Array.isArray(DEFAULT_SPORTS_LEAGUES)).toBe(true);
    expect(DEFAULT_SPORTS_LEAGUES.length).toBeGreaterThan(0);
    expect(DEFAULT_SPORTS_LEAGUES[0]).toHaveProperty('sport');
    expect(DEFAULT_SPORTS_LEAGUES[0]).toHaveProperty('league');
  });

  it('should have SportsGame with required fields', () => {
    const game: SportsGame = {
      id: 'game-1',
      league: 'nfl',
      homeTeam: 'Chiefs',
      awayTeam: 'Eagles',
      homeScore: 21,
      awayScore: 17,
      status: 'in_progress',
      startTime: Date.now(),
      period: 'Q3',
    };

    expect(game.id).toBe('game-1');
    expect(game.homeTeam).toBe('Chiefs');
    expect(game.homeScore).toBe(21);
    expect(game.status).toBe('in_progress');
  });

  it('should have SportsData with games and lastUpdated', () => {
    const data: SportsData = {
      games: [
        {
          id: '1',
          league: 'nba',
          homeTeam: 'Lakers',
          awayTeam: 'Celtics',
          homeScore: 105,
          awayScore: 102,
          status: 'final',
          startTime: Date.now(),
          period: 'Final',
        },
      ],
      lastUpdated: Date.now(),
    };

    expect(data.games).toHaveLength(1);
    expect(data.lastUpdated).toBeGreaterThan(0);
  });

  it('should have correct default values', () => {
    expect(DEFAULT_SPORTS_MAX_STALE_MS).toEqual(120_000);
  });

  it('should have default leagues with sport and league fields', () => {
    for (const league of DEFAULT_SPORTS_LEAGUES) {
      expect(typeof league.sport).toBe('string');
      expect(typeof league.league).toBe('string');
      expect(league.sport.length).toBeGreaterThan(0);
      expect(league.league.length).toBeGreaterThan(0);
    }
  });
});
