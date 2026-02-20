import { createReconnectManager } from './ws-reconnect.js';
import type {
  AgentGatewayOptions,
  AgentGatewayInstance,
  AgentTaskResult,
  WsMessage,
  ConnectionStatus,
  DataBusMessage,
  DataSnapshotPayload,
  AgentWebSocket,
} from '@lensing/types';

const WS_OPEN = 1;

function generateId(): string {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 11)}`;
}

export function createAgentGateway(options: AgentGatewayOptions): AgentGatewayInstance {
  const {
    url,
    dataBus,
    onResponse,
    onStatusChange,
    createWebSocket,
    baseDelay = 1000,
    maxDelay = 30000,
    maxRetries = Infinity,
  } = options;

  let closed = false;
  let ws: AgentWebSocket | null = null;
  let intentionalDisconnect = false;
  let reconnectAttemptCount = 0;
  const pendingRequests = new Set<string>();

  const reconnectManager = createReconnectManager({
    onReconnect: () => {
      reconnectAttemptCount++;
      openConnection();
    },
    onStatusChange: (status: ConnectionStatus) => {
      onStatusChange?.(status);
    },
    baseDelay,
    maxDelay,
    maxRetries,
  });

  function openConnection(): void {
    if (closed) return;

    const wsFactory =
      createWebSocket ?? ((u: string) => new WebSocket(u) as unknown as AgentWebSocket);

    const socket = wsFactory(url);
    ws = socket;

    socket.onopen = () => {
      if (closed) {
        socket.close(1000, 'Gateway closed during connect');
        return;
      }
      reconnectAttemptCount = 0;
      reconnectManager.connect();
    };

    socket.onclose = (_event) => {
      ws = null;
      if (closed || intentionalDisconnect) return;
      reconnectManager.connectionLost();
    };

    socket.onmessage = (event) => {
      if (closed) return;
      handleMessage(event.data);
    };

    socket.onerror = (_event) => {
      // Error events are always followed by onclose — reconnect logic lives there
    };
  }

  function handleMessage(raw: string): void {
    let msg: WsMessage;
    try {
      msg = JSON.parse(raw) as WsMessage;
    } catch {
      return; // malformed — ignore silently
    }

    switch (msg.type) {
      case 'agent_response': {
        const payload = msg.payload as { requestId: string; result: AgentTaskResult };
        if (!pendingRequests.has(payload.requestId)) return;
        pendingRequests.delete(payload.requestId);
        try {
          onResponse(payload.result);
        } catch {
          // Isolate callback errors — a throwing listener must not crash the gateway
        }
        break;
      }

      case 'data_snapshot_request': {
        const payload = msg.payload as { requestId: string };
        const channels = dataBus.getChannels();
        const snapshots: Record<string, DataBusMessage> = {};
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
          } as DataSnapshotPayload,
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

  function sendRaw(msg: WsMessage): void {
    if (ws !== null && ws.readyState === WS_OPEN) {
      ws.send(JSON.stringify(msg));
    }
  }

  return {
    get status(): ConnectionStatus {
      if (closed) return 'disconnected';
      return reconnectManager.status;
    },

    get reconnectAttempts(): number {
      if (closed) return 0;
      return reconnectAttemptCount;
    },

    connect(): void {
      if (closed) return;
      intentionalDisconnect = false;
      openConnection();
    },

    sendRequest(prompt: string): string {
      if (closed) {
        throw new Error('Gateway is closed');
      }
      if (reconnectManager.status !== 'connected') {
        throw new Error('Not connected to Agent Service');
      }
      const requestId = generateId();
      pendingRequests.add(requestId);
      sendRaw({
        type: 'agent_request',
        payload: { requestId, prompt },
        timestamp: new Date().toISOString(),
      });
      return requestId;
    },

    disconnect(): void {
      if (closed) return;
      intentionalDisconnect = true;
      reconnectAttemptCount = 0;
      reconnectManager.disconnect();
      ws?.close(1000, 'Intentional disconnect');
      ws = null;
    },

    close(): void {
      if (closed) return;
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
