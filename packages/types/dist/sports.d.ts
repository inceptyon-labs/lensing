import type { DataBusInstance, NotificationQueueInstance, FetchFn } from './index';
/** Status of a sports game */
export type GameStatus = 'scheduled' | 'in_progress' | 'final' | 'postponed' | 'cancelled';
/** A single sports game */
export interface SportsGame {
    id: string;
    league: string;
    homeTeam: string;
    awayTeam: string;
    homeScore: number;
    awayScore: number;
    status: GameStatus;
    startTime: number;
    period: string;
    venue?: string;
}
/** Full sports data payload */
export interface SportsData {
    games: SportsGame[];
    lastUpdated: number;
}
/** League identifier for ESPN API */
export interface LeagueConfig {
    sport: string;
    league: string;
    /** Display label for the league badge (e.g., "NCAAB"). Falls back to league slug if omitted. */
    label?: string;
}
/** Configuration for createSportsServer */
export interface SportsServerOptions {
    /** List of leagues to poll (must come from trusted admin config, not user input) */
    leagues: LeagueConfig[];
    /** Team name filters — only show games involving these teams (case-insensitive substring match). Empty = show all. */
    teams?: string[];
    /** Max staleness in ms before cache is stale (default: 120000 = 2 min) */
    maxStale_ms?: number;
    /** Data bus instance for publishing scores */
    dataBus: DataBusInstance;
    /** Notification queue for emitting alerts */
    notifications: NotificationQueueInstance;
    /** Injectable fetch function (defaults to global fetch) */
    fetchFn?: FetchFn;
}
/** Instance returned by createSportsServer */
export interface SportsServerInstance {
    /** Manually trigger a scores refresh */
    refresh(): Promise<void>;
    /** Get the last fetched scores data (null if not yet fetched) */
    getScores(): SportsData | null;
    /** Register a listener called when new data arrives; returns unsubscribe */
    onUpdate(callback: (data: SportsData) => void): () => void;
    /** Register a listener called when an error occurs */
    onError(callback: (error: string) => void): void;
    /** Stop and release resources */
    close(): void;
}
/** Default max staleness in ms (2 minutes — sports need frequent updates) */
export declare const DEFAULT_SPORTS_MAX_STALE_MS = 120000;
/** Default leagues to poll */
export declare const DEFAULT_SPORTS_LEAGUES: LeagueConfig[];
//# sourceMappingURL=sports.d.ts.map