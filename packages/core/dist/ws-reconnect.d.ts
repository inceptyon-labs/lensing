import type { ConnectionStatus } from '@lensing/types';
/** Options for backoff calculation */
export interface BackoffOptions {
    /** Base delay in ms (default: 1000) */
    baseDelay: number;
    /** Maximum delay cap in ms (default: 30000) */
    maxDelay: number;
}
/** Options for the reconnect manager */
export interface ReconnectOptions {
    /** Called when a reconnect attempt should be made */
    onReconnect: () => void;
    /** Called when connection status changes */
    onStatusChange?: (status: ConnectionStatus) => void;
    /** Base delay for exponential backoff in ms (default: 1000) */
    baseDelay?: number;
    /** Maximum backoff delay in ms (default: 30000) */
    maxDelay?: number;
    /** Maximum number of reconnect attempts (default: Infinity) */
    maxRetries?: number;
}
/**
 * Calculates exponential backoff delay with jitter.
 * Jitter prevents thundering herd when multiple clients reconnect simultaneously.
 */
export declare function calculateBackoff(attempt: number, options: BackoffOptions): number;
/**
 * Creates a reconnection manager with exponential backoff.
 * Handles Pi sleep/wake, network blips, and host restarts gracefully.
 * Exposes connection status for UI indicators.
 */
export declare function createReconnectManager(options: ReconnectOptions): {
    /** Current connection status */
    readonly status: ConnectionStatus;
    /** Current attempt count */
    readonly attempts: number;
    /** Signal that connection is established */
    connect(): void;
    /** Signal that connection was lost (triggers reconnect) */
    connectionLost(): void;
    /** Explicitly disconnect (cancels pending reconnect) */
    disconnect(): void;
    /** Clean up all resources */
    destroy(): void;
};
/** Type of reconnect manager instance */
export type ReconnectManager = ReturnType<typeof createReconnectManager>;
//# sourceMappingURL=ws-reconnect.d.ts.map