import { createReconnectManager } from './ws-reconnect.js';
const WS_OPEN = 1;
function generateId() {
    return `${Date.now()}-${Math.random().toString(36).slice(2, 11)}`;
}
export function createAgentGateway(options) {
    const { url, dataBus, onResponse, onStatusChange, createWebSocket, baseDelay = 1000, maxDelay = 30000, maxRetries = Infinity, } = options;
    let closed = false;
    let ws = null;
    let intentionalDisconnect = false;
    let reconnectAttemptCount = 0;
    let currentSocketId = 0;
    const pendingRequests = new Set();
    const reconnectManager = createReconnectManager({
        onReconnect: () => {
            reconnectAttemptCount++;
            openConnection();
        },
        onStatusChange: (status) => {
            onStatusChange?.(status);
        },
        baseDelay,
        maxDelay,
        maxRetries,
    });
    function openConnection() {
        if (closed)
            return;
        const wsFactory = createWebSocket ?? ((u) => new WebSocket(u));
        const socket = wsFactory(url);
        const socketId = ++currentSocketId;
        ws = socket;
        socket.onopen = () => {
            if (closed) {
                socket.close(1000, 'Gateway closed during connect');
                return;
            }
            if (socketId !== currentSocketId)
                return; // ignore stale socket
            reconnectAttemptCount = 0;
            reconnectManager.connect();
        };
        socket.onclose = (_event) => {
            if (socketId !== currentSocketId)
                return; // ignore stale socket
            ws = null;
            if (closed || intentionalDisconnect)
                return;
            reconnectManager.connectionLost();
        };
        socket.onmessage = (event) => {
            if (socketId !== currentSocketId)
                return; // ignore stale socket
            if (closed)
                return;
            handleMessage(event.data);
        };
        socket.onerror = (_event) => {
            // Error events are always followed by onclose — reconnect logic lives there
        };
    }
    function handleMessage(raw) {
        let msg;
        try {
            msg = JSON.parse(raw);
        }
        catch {
            return; // malformed — ignore silently
        }
        switch (msg.type) {
            case 'agent_response': {
                const payload = msg.payload;
                if (!pendingRequests.has(payload.requestId))
                    return;
                pendingRequests.delete(payload.requestId);
                try {
                    onResponse(payload.result);
                }
                catch {
                    // Isolate callback errors — a throwing listener must not crash the gateway
                }
                break;
            }
            case 'data_snapshot_request': {
                const payload = msg.payload;
                const channels = dataBus.getChannels();
                const snapshots = {};
                for (const channel of channels) {
                    const latest = dataBus.getLatest(channel);
                    if (latest !== undefined) {
                        snapshots[channel] = latest;
                    }
                }
                sendRaw({
                    type: 'data_snapshot_response',
                    payload: {
                        requestId: payload.requestId,
                        channels,
                        snapshots,
                    },
                    timestamp: new Date().toISOString(),
                });
                break;
            }
            case 'ping': {
                sendRaw({
                    type: 'pong',
                    payload: {},
                    timestamp: new Date().toISOString(),
                });
                break;
            }
            default:
                break;
        }
    }
    function sendRaw(msg) {
        if (ws !== null && ws.readyState === WS_OPEN) {
            ws.send(JSON.stringify(msg));
        }
    }
    function sendRawStrict(msg) {
        if (ws === null || ws.readyState !== WS_OPEN) {
            throw new Error('WebSocket is not open');
        }
        ws.send(JSON.stringify(msg));
    }
    return {
        get status() {
            if (closed)
                return 'disconnected';
            return reconnectManager.status;
        },
        get reconnectAttempts() {
            if (closed)
                return 0;
            return reconnectAttemptCount;
        },
        connect() {
            if (closed)
                return;
            intentionalDisconnect = false;
            openConnection();
        },
        sendRequest(prompt) {
            if (closed) {
                throw new Error('Gateway is closed');
            }
            if (reconnectManager.status !== 'connected') {
                throw new Error('Not connected to Agent Service');
            }
            const requestId = generateId();
            pendingRequests.add(requestId);
            try {
                sendRawStrict({
                    type: 'agent_request',
                    payload: { requestId, prompt },
                    timestamp: new Date().toISOString(),
                });
            }
            catch (error) {
                pendingRequests.delete(requestId);
                throw error;
            }
            return requestId;
        },
        disconnect() {
            if (closed)
                return;
            intentionalDisconnect = true;
            reconnectAttemptCount = 0;
            reconnectManager.disconnect();
            ws?.close(1000, 'Intentional disconnect');
            ws = null;
        },
        close() {
            if (closed)
                return;
            closed = true;
            intentionalDisconnect = true;
            reconnectAttemptCount = 0;
            reconnectManager.destroy();
            ws?.close(1000, 'Gateway closed');
            ws = null;
            pendingRequests.clear();
        },
    };
}
//# sourceMappingURL=agent-gateway.js.map