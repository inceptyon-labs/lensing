import { WebSocketServer, WebSocket } from 'ws';
import type { WsMessage } from '@lensing/types';
import type { IncomingMessage } from 'node:http';
import type { Server as HttpServer } from 'node:http';

/** Options for creating the WebSocket server */
export interface WsServerOptions {
  /** Port to listen on (0 for random available port) */
  port?: number;
  /** Attach to existing HTTP server instead of standalone */
  server?: HttpServer;
  /** Heartbeat interval in ms (default: 30000) */
  heartbeatInterval?: number;
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
export function createWsServer(options: WsServerOptions = {}): WsServerInstance {
  const { port = 0, server, heartbeatInterval = 30000 } = options;

  const clients = new Set<WebSocket>();
  const listeners: Record<string, Array<(...args: unknown[]) => void>> = {};
  let wss: WebSocketServer;
  let heartbeatTimer: ReturnType<typeof setInterval> | null = null;
  let readyResolve: (() => void) | null = null;
  let readyReject: ((err: Error) => void) | null = null;
  let listeningPort = 0;

  const readyPromise = new Promise<void>((resolve, reject) => {
    readyResolve = resolve;
    readyReject = reject;
  });

  // Create server
  if (server) {
    wss = new WebSocketServer({ server });
    listeningPort = port;
    readyResolve?.();
  } else {
    wss = new WebSocketServer({ port }, () => {
      const addr = wss.address();
      if (typeof addr === 'object' && addr) {
        listeningPort = addr.port;
      }
      readyResolve?.();
    });

    // Handle startup errors (e.g., port conflict)
    wss.on('error', (err: Error) => {
      readyReject?.(err);
    });
  }

  // Handle new connections
  wss.on('connection', (ws: WebSocket, _req: IncomingMessage) => {
    clients.add(ws);
    emit('connection');

    // Handle incoming messages from client
    ws.on('message', (data: Buffer | string) => {
      try {
        const msg = JSON.parse(data.toString()) as WsMessage;
        if (msg.type === 'ping') {
          // Respond with pong
          ws.send(
            JSON.stringify({
              type: 'pong',
              payload: {},
              timestamp: new Date().toISOString(),
            } satisfies WsMessage)
          );
        }
      } catch {
        // Ignore invalid JSON messages
      }
    });

    // Handle WebSocket protocol-level ping
    ws.on('ping', () => {
      ws.pong();
    });

    // Handle disconnect
    ws.on('close', () => {
      clients.delete(ws);
      emit('disconnection');
    });

    ws.on('error', () => {
      clients.delete(ws);
    });
  });

  // Start heartbeat if configured
  if (heartbeatInterval > 0) {
    heartbeatTimer = setInterval(() => {
      for (const client of clients) {
        if (client.readyState === WebSocket.OPEN) {
          client.ping();
        }
      }
    }, heartbeatInterval);
  }

  function emit(event: string) {
    const handlers = listeners[event];
    if (handlers) {
      for (const handler of handlers) {
        handler();
      }
    }
  }

  return {
    get clientCount() {
      return clients.size;
    },

    get port() {
      return listeningPort;
    },

    ready() {
      return readyPromise;
    },

    broadcast(message: WsMessage) {
      const serialized = JSON.stringify(message);
      for (const client of clients) {
        if (client.readyState === WebSocket.OPEN) {
          client.send(serialized);
        }
      }
    },

    on(event, listener) {
      if (!listeners[event]) {
        listeners[event] = [];
      }
      listeners[event].push(listener as (...args: unknown[]) => void);
    },

    async close() {
      if (heartbeatTimer) {
        clearInterval(heartbeatTimer);
        heartbeatTimer = null;
      }

      for (const client of clients) {
        client.close();
      }
      clients.clear();

      return new Promise<void>((resolve) => {
        wss.close(() => resolve());
      });
    },
  };
}
