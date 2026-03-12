import { WebSocketServer, WebSocket } from 'ws';
import { extractBearerToken } from './auth-middleware';
/**
 * Creates a WebSocket server that pushes real-time updates to connected clients.
 * Supports layout changes, plugin data updates, and scene changes.
 */
export function createWsServer(options = {}) {
    const { port = 0, server, heartbeatInterval = 30000, authToken } = options;
    const clients = new Set();
    const listeners = {};
    let heartbeatTimer = null;
    let listeningPort = 0;
    // Create server (synchronous - executor runs immediately)
    let wss;
    let onReady;
    let onError;
    const readyPromise = new Promise((resolve, reject) => {
        onReady = resolve;
        onError = reject;
    });
    // Verify client for auth (if authToken is configured)
    const verifyClient = authToken
        ? (info, callback) => {
            const authHeader = info.req.headers.authorization;
            const headerStr = Array.isArray(authHeader) ? authHeader[0] : authHeader;
            const token = extractBearerToken(headerStr);
            if (token !== authToken) {
                callback(false, 401, 'Unauthorized');
                return;
            }
            callback(true);
        }
        : undefined;
    if (server) {
        wss = new WebSocketServer({ server, verifyClient });
        listeningPort = port;
        onReady();
    }
    else {
        wss = new WebSocketServer({ port, verifyClient }, () => {
            const addr = wss.address();
            if (typeof addr === 'object' && addr) {
                listeningPort = addr.port;
            }
            onReady();
        });
        // Handle startup errors (e.g., port conflict)
        wss.on('error', (err) => {
            onError(err);
        });
    }
    // Handle new connections
    wss.on('connection', (ws, _req) => {
        clients.add(ws);
        emit('connection');
        // Handle incoming messages from client
        ws.on('message', (data) => {
            try {
                const msg = JSON.parse(data.toString());
                if (msg.type === 'ping') {
                    // Respond with pong
                    ws.send(JSON.stringify({
                        type: 'pong',
                        payload: {},
                        timestamp: new Date().toISOString(),
                    }));
                }
            }
            catch {
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
    function emit(event) {
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
        broadcast(message) {
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
            listeners[event].push(listener);
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
            return new Promise((resolve) => {
                wss.close(() => resolve());
            });
        },
    };
}
//# sourceMappingURL=ws-server.js.map