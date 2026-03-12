import type { WsMessage } from '@lensing/types';
import type { Server as HttpServer } from 'node:http';
/** Options for creating the WebSocket server */
export interface WsServerOptions {
    /** Port to listen on (0 for random available port) */
    port?: number;
    /** Attach to existing HTTP server instead of standalone */
    server?: HttpServer;
    /** Heartbeat interval in ms (default: 30000) */
    heartbeatInterval?: number;
    /** Bearer token required for WebSocket connections. If omitted, auth is disabled. */
    authToken?: string;
}
/** Event types emitted by WsServerInstance */
export interface WsServerEvents {
    connection: () => void;
    disconnection: () => void;
}
/** WebSocket server instance with broadcasting capabilities */
export interface WsServerInstance {
    /** Number of currently connected clients */
    readonly clientCount: number;
    /** Port the server is listening on */
    readonly port: number;
    /** Wait for server to be ready */
    ready(): Promise<void>;
    /** Broadcast a message to all connected clients */
    broadcast(message: WsMessage): void;
    /** Register event listener */
    on<K extends keyof WsServerEvents>(event: K, listener: WsServerEvents[K]): void;
    /** Close the server */
    close(): Promise<void>;
}
/**
 * Creates a WebSocket server that pushes real-time updates to connected clients.
 * Supports layout changes, plugin data updates, and scene changes.
 */
export declare function createWsServer(options?: WsServerOptions): WsServerInstance;
//# sourceMappingURL=ws-server.d.ts.map