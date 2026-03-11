import type {
  SportsServerOptions,
  SportsServerInstance,
  SportsData,
  SportsGame,
  GameStatus,
  DataBusInstance,
  FetchFn,
} from '@lensing/types';
import { DEFAULT_SPORTS_MAX_STALE_MS } from '@lensing/types';
import type { NotificationQueueInstance } from './notification-queue.js';

const PLUGIN_ID = 'sports-server';
const DATA_BUS_SCORES_CHANNEL = 'sports.scores';

// ── ESPN API types ─────────────────────────────────────────────────────────

interface EspnCompetitor {
  homeAway: 'home' | 'away';
  team: { displayName: string; abbreviation: string };
  score?: string;
}

interface EspnCompetitionStatus {
  type: { state: string; completed: boolean; description: string };
  period?: number;
  displayClock?: string;
}

interface EspnCompetition {
  competitors: EspnCompetitor[];
  status: EspnCompetitionStatus;
  venue?: { fullName: string };
  date: string;
}

interface EspnEvent {
  id: string;
  status: { type: { state: string; completed: boolean; description: string } };
  competitions: EspnCompetition[];
}

interface EspnScoreboard {
  events?: EspnEvent[];
}

// ── ESPN URL builder ───────────────────────────────────────────────────────

function buildEspnUrl(sport: string, league: string): string {
  return `https://site.api.espn.com/apis/site/v2/sports/${sport}/${league}/scoreboard`;
}

// ── Transform helpers ──────────────────────────────────────────────────────

const FETCH_TIMEOUT_MS = 10_000;

function mapStatus(state: string, completed: boolean): GameStatus {
  if (completed) return 'final';
  if (state === 'in') return 'in_progress';
  return 'scheduled';
}

function safeScore(score: string | undefined): number {
  const n = Number(score);
  return Number.isFinite(n) ? n : 0;
}

function transformEvent(event: EspnEvent, league: string): SportsGame {
  const competition = event.competitions[0];
  const home = competition?.competitors.find((c) => c.homeAway === 'home');
  const away = competition?.competitors.find((c) => c.homeAway === 'away');
  const statusType = event.status.type;

  const period = competition?.status?.period;
  const clock = competition?.status?.displayClock;
  const periodStr =
    statusType.state === 'in' && period
      ? `${period > 0 ? period : ''}${clock ? ' ' + clock : ''}`.trim()
      : statusType.description;

  return {
    id: event.id,
    league,
    homeTeam: home?.team.displayName ?? '',
    awayTeam: away?.team.displayName ?? '',
    homeScore: safeScore(home?.score),
    awayScore: safeScore(away?.score),
    status: mapStatus(statusType.state, statusType.completed),
    startTime: competition?.date ? Date.parse(competition.date) : Date.now(),
    period: periodStr,
    venue: competition?.venue?.fullName,
  };
}

function transformScoreboard(data: EspnScoreboard, league: string): SportsGame[] {
  if (!Array.isArray(data.events)) return [];
  const games: SportsGame[] = [];
  for (const event of data.events) {
    try {
      games.push(transformEvent(event, league));
    } catch {
      // skip malformed events
    }
  }
  return games;
}

// ── Defensive copies ───────────────────────────────────────────────────────

function copyGame(g: SportsGame): SportsGame {
  return { ...g };
}

function copyData(d: SportsData): SportsData {
  return {
    games: d.games.map(copyGame),
    lastUpdated: d.lastUpdated,
  };
}

// ── Factory ────────────────────────────────────────────────────────────────

export function createSportsServer(options: SportsServerOptions): SportsServerInstance {
  const {
    leagues,
    teams,
    dataBus,
    notifications: _notifications,
    maxStale_ms = DEFAULT_SPORTS_MAX_STALE_MS,
    fetchFn,
  } = options;

  // Pre-compute lowercase team filters for case-insensitive substring matching
  const teamFilters = (teams ?? []).map((t) => t.toLowerCase().trim()).filter(Boolean);

  if (!leagues || leagues.length === 0) {
    throw new Error('SportsServer: leagues is required and must not be empty');
  }

  const effectiveFetch = (fetchFn ?? fetch) as unknown as FetchFn;
  const _notificationQueue = _notifications as NotificationQueueInstance;

  let lastData: SportsData | null = null;
  let lastFetchedAt: number | null = null;
  let closed = false;
  let refreshing = false;
  const updateListeners: Array<(data: SportsData) => void> = [];
  const errorListeners: Array<(error: string) => void> = [];

  function notifyUpdate(data: SportsData): void {
    for (const cb of [...updateListeners]) {
      try {
        cb(data);
      } catch {
        // isolate listener errors
      }
    }
  }

  function notifyError(message: string): void {
    for (const cb of [...errorListeners]) {
      try {
        cb(message);
      } catch {
        // isolate listener errors
      }
    }
  }

  function matchesTeamFilter(game: SportsGame): boolean {
    if (teamFilters.length === 0) return true;
    const home = game.homeTeam.toLowerCase();
    const away = game.awayTeam.toLowerCase();
    return teamFilters.some((filter) => home.includes(filter) || away.includes(filter));
  }

  async function fetchLeague(
    sport: string,
    league: string,
    label?: string
  ): Promise<SportsGame[] | null> {
    const url = buildEspnUrl(sport, league);
    let response: Awaited<ReturnType<FetchFn>>;

    try {
      response = await Promise.race([
        effectiveFetch(url),
        new Promise<never>((_, reject) =>
          setTimeout(
            () => reject(new Error(`timeout after ${FETCH_TIMEOUT_MS}ms`)),
            FETCH_TIMEOUT_MS
          )
        ),
      ]);
    } catch (err) {
      const message = err instanceof Error ? err.message : String(err);
      notifyError(`Sports fetch failed [${league}]: ${message}`);
      return null;
    }

    if (!response.ok) {
      // ESPN returns 400 for off-season leagues — treat as empty, not an error
      if (response.status === 400) {
        return [];
      }
      notifyError(
        `Sports API error ${response.status ?? ''} [${league}]: ${response.statusText ?? 'unknown'}`
      );
      return null;
    }

    let raw: unknown;
    try {
      raw = await response.json();
    } catch (err) {
      const message = err instanceof Error ? err.message : String(err);
      notifyError(`Sports response parse error [${league}]: ${message}`);
      return null;
    }

    return transformScoreboard(raw as EspnScoreboard, label ?? league);
  }

  async function refresh(): Promise<void> {
    if (closed) return;
    if (refreshing) return;

    if (lastFetchedAt !== null && maxStale_ms > 0 && Date.now() - lastFetchedAt < maxStale_ms) {
      return;
    }

    refreshing = true;

    try {
      const allGames: SportsGame[] = [];
      let anySuccess = false;

      for (const { sport, league, label } of leagues) {
        const games = await fetchLeague(sport, league, label);
        if (games !== null) {
          allGames.push(...games);
          anySuccess = true;
        }
      }

      if (!anySuccess) {
        // All leagues failed — preserve stale data, errors already notified
        return;
      }

      const filteredGames = allGames.filter(matchesTeamFilter);
      const now = Date.now();

      lastData = {
        games: filteredGames.map(copyGame),
        lastUpdated: now,
      };
      lastFetchedAt = now;

      const publishData: SportsData = {
        games: filteredGames.map(copyGame),
        lastUpdated: now,
      };

      (dataBus as DataBusInstance).publish(DATA_BUS_SCORES_CHANNEL, PLUGIN_ID, publishData);
      notifyUpdate(publishData);
    } finally {
      refreshing = false;
    }
  }

  return {
    refresh,

    getScores(): SportsData | null {
      if (!lastData) return null;
      return copyData(lastData);
    },

    onUpdate(callback: (data: SportsData) => void): () => void {
      updateListeners.push(callback);
      return () => {
        const idx = updateListeners.indexOf(callback);
        if (idx !== -1) updateListeners.splice(idx, 1);
      };
    },

    onError(callback: (error: string) => void): void {
      errorListeners.push(callback);
    },

    close(): void {
      closed = true;
    },
  };
}
