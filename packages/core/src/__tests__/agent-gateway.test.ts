import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { createAgentGateway } from '../agent-gateway';
import type {
  AgentGatewayOptions,
  AgentGatewayInstance,
  AgentTaskResult,
  DataBusInstance,
  DataBusMessage,
  ConnectionStatus,
  WsMessage,
} from '@lensing/types';

// ── Mock helpers ───────────────────────────────────────────────────────────

function createMockDataBus(): DataBusInstance {
  const channels = new Map<string, DataBusMessage>();

  return {
    publish: vi.fn(),
    subscribe: vi.fn(() => () => {}),
    getLatest: vi.fn((channel: string) => channels.get(channel)),
    getChannels: vi.fn(() => [...channels.keys()]),
    onMessage: vi.fn(() => () => {}),
    clear: vi.fn(),
    close: vi.fn(),
  };
}

function createMockResult(response = 'Test response'): AgentTaskResult {
  return {
    response,
    tool_calls_made: 0,
    audit_entries: [],
  };
}

// Mock WebSocket class for testing
class MockWebSocket {
  static CONNECTING = 0;
  static OPEN = 1;
  static CLOSING = 2;
  static CLOSED = 3;

  readyState = MockWebSocket.CONNECTING;
  url: string;
  onopen: (() => void) | null = null;
  onclose: ((event: { code: number; reason: string }) => void) | null = null;
  onmessage: ((event: { data: string }) => void) | null = null;
  onerror: ((event: unknown) => void) | null = null;

  sent: string[] = [];

  constructor(url: string) {
    this.url = url;
  }

  send(data: string): void {
    if (this.readyState !== MockWebSocket.OPEN) {
      throw new Error('WebSocket is not open');
    }
    this.sent.push(data);
  }

  close(code?: number, reason?: string): void {
    this.readyState = MockWebSocket.CLOSING;
    setTimeout(() => {
      this.readyState = MockWebSocket.CLOSED;
      this.onclose?.({ code: code ?? 1000, reason: reason ?? '' });
    }, 0);
  }

  // Test helpers
  simulateOpen(): void {
    this.readyState = MockWebSocket.OPEN;
    this.onopen?.();
  }

  simulateMessage(msg: WsMessage): void {
    this.onmessage?.({ data: JSON.stringify(msg) });
  }

  simulateClose(code = 1006, reason = ''): void {
    this.readyState = MockWebSocket.CLOSED;
    this.onclose?.({ code, reason });
  }

  simulateError(): void {
    this.onerror?.({ message: 'Connection failed' });
  }
}

// Track all created WebSocket instances
let mockInstances: MockWebSocket[] = [];

function getMockWebSocketFactory() {
  return (url: string) => {
    const ws = new MockWebSocket(url);
    mockInstances.push(ws);
    return ws;
  };
}

function getLatestMockWs(): MockWebSocket {
  return mockInstances[mockInstances.length - 1];
}

// ── Tests ──────────────────────────────────────────────────────────────────

describe('Agent Gateway', () => {
  let dataBus: DataBusInstance;
  let onResponse: ReturnType<typeof vi.fn>;
  let onStatusChange: ReturnType<typeof vi.fn>;
  let gateway: AgentGatewayInstance;

  beforeEach(() => {
    vi.useFakeTimers();
    mockInstances = [];
    dataBus = createMockDataBus();
    onResponse = vi.fn();
    onStatusChange = vi.fn();
  });

  afterEach(() => {
    gateway?.close();
    vi.useRealTimers();
  });

  function createGateway(overrides: Partial<AgentGatewayOptions> = {}): AgentGatewayInstance {
    gateway = createAgentGateway({
      url: 'ws://agent-host:8080',
      dataBus,
      onResponse,
      onStatusChange,
      createWebSocket:
        getMockWebSocketFactory() as unknown as AgentGatewayOptions['createWebSocket'],
      ...overrides,
    });
    return gateway;
  }

  describe('Connection Lifecycle', () => {
    it('should start in disconnected state', () => {
      createGateway();
      expect(gateway.status).toBe('disconnected');
    });

    it('should connect to remote agent service', () => {
      createGateway();
      gateway.connect();

      const ws = getLatestMockWs();
      expect(ws.url).toBe('ws://agent-host:8080');
      ws.simulateOpen();

      expect(gateway.status).toBe('connected');
    });

    it('should notify status change on connect', () => {
      createGateway();
      gateway.connect();
      getLatestMockWs().simulateOpen();

      expect(onStatusChange).toHaveBeenCalledWith('connected');
    });

    it('should disconnect from remote agent service', () => {
      createGateway();
      gateway.connect();
      getLatestMockWs().simulateOpen();

      gateway.disconnect();
      expect(gateway.status).toBe('disconnected');
    });

    it('should notify status change on disconnect', () => {
      createGateway();
      gateway.connect();
      getLatestMockWs().simulateOpen();

      onStatusChange.mockClear();
      gateway.disconnect();
      expect(onStatusChange).toHaveBeenCalledWith('disconnected');
    });

    it('should handle close and cleanup', () => {
      createGateway();
      gateway.connect();
      getLatestMockWs().simulateOpen();

      gateway.close();
      expect(gateway.status).toBe('disconnected');
    });
  });

  describe('Request Forwarding', () => {
    it('should forward user requests to remote agent', () => {
      createGateway();
      gateway.connect();
      const ws = getLatestMockWs();
      ws.simulateOpen();

      const requestId = gateway.sendRequest('What is the weather?');

      expect(requestId).toBeDefined();
      expect(ws.sent).toHaveLength(1);

      const sent = JSON.parse(ws.sent[0]) as WsMessage;
      expect(sent.type).toBe('agent_request');
      expect(sent.payload).toHaveProperty('requestId', requestId);
      expect(sent.payload).toHaveProperty('prompt', 'What is the weather?');
    });

    it('should generate unique request IDs', () => {
      createGateway();
      gateway.connect();
      getLatestMockWs().simulateOpen();

      const id1 = gateway.sendRequest('prompt 1');
      const id2 = gateway.sendRequest('prompt 2');

      expect(id1).not.toBe(id2);
    });

    it('should throw if sending request while disconnected', () => {
      createGateway();

      expect(() => gateway.sendRequest('test')).toThrow();
    });

    it('should throw if sending request after close', () => {
      createGateway();
      gateway.connect();
      getLatestMockWs().simulateOpen();
      gateway.close();

      expect(() => gateway.sendRequest('test')).toThrow();
    });
  });

  describe('Response Handling', () => {
    it('should invoke onResponse when agent_response arrives', () => {
      createGateway();
      gateway.connect();
      const ws = getLatestMockWs();
      ws.simulateOpen();

      const requestId = gateway.sendRequest('test prompt');
      const mockResult = createMockResult();

      ws.simulateMessage({
        type: 'agent_response',
        payload: { requestId, result: mockResult },
        timestamp: new Date().toISOString(),
      });

      expect(onResponse).toHaveBeenCalledWith(mockResult);
    });

    it('should handle multiple concurrent requests', () => {
      createGateway();
      gateway.connect();
      const ws = getLatestMockWs();
      ws.simulateOpen();

      const id1 = gateway.sendRequest('prompt 1');
      const id2 = gateway.sendRequest('prompt 2');

      const result1 = createMockResult('response 1');
      const result2 = createMockResult('response 2');

      // Respond out of order
      ws.simulateMessage({
        type: 'agent_response',
        payload: { requestId: id2, result: result2 },
        timestamp: new Date().toISOString(),
      });

      ws.simulateMessage({
        type: 'agent_response',
        payload: { requestId: id1, result: result1 },
        timestamp: new Date().toISOString(),
      });

      expect(onResponse).toHaveBeenCalledTimes(2);
      expect(onResponse).toHaveBeenCalledWith(result2);
      expect(onResponse).toHaveBeenCalledWith(result1);
    });

    it('should ignore responses for unknown request IDs', () => {
      createGateway();
      gateway.connect();
      const ws = getLatestMockWs();
      ws.simulateOpen();

      ws.simulateMessage({
        type: 'agent_response',
        payload: {
          requestId: 'unknown-id',
          result: createMockResult(),
        },
        timestamp: new Date().toISOString(),
      });

      expect(onResponse).not.toHaveBeenCalled();
    });

    it('should handle malformed messages gracefully', () => {
      createGateway();
      gateway.connect();
      const ws = getLatestMockWs();
      ws.simulateOpen();

      // Send invalid JSON via raw onmessage
      ws.onmessage?.({ data: 'not json' });
      expect(onResponse).not.toHaveBeenCalled();
    });
  });

  describe('Data Bus Snapshot Forwarding', () => {
    it('should respond to data_snapshot_request with channel data', () => {
      const mockSnapshot: DataBusMessage = {
        channel: 'weather',
        data: { temp: 72 },
        timestamp: new Date().toISOString(),
        plugin_id: 'weather-plugin',
      };

      (dataBus.getChannels as ReturnType<typeof vi.fn>).mockReturnValue(['weather']);
      (dataBus.getLatest as ReturnType<typeof vi.fn>).mockReturnValue(mockSnapshot);

      createGateway();
      gateway.connect();
      const ws = getLatestMockWs();
      ws.simulateOpen();

      ws.simulateMessage({
        type: 'data_snapshot_request',
        payload: { requestId: 'snap-1' },
        timestamp: new Date().toISOString(),
      });

      expect(ws.sent).toHaveLength(1);
      const response = JSON.parse(ws.sent[0]) as WsMessage;
      expect(response.type).toBe('data_snapshot_response');
      expect(response.payload).toHaveProperty('requestId', 'snap-1');
      expect(response.payload).toHaveProperty('channels', ['weather']);
      expect(response.payload).toHaveProperty('snapshots');
    });

    it('should handle empty data bus gracefully', () => {
      (dataBus.getChannels as ReturnType<typeof vi.fn>).mockReturnValue([]);

      createGateway();
      gateway.connect();
      const ws = getLatestMockWs();
      ws.simulateOpen();

      ws.simulateMessage({
        type: 'data_snapshot_request',
        payload: { requestId: 'snap-2' },
        timestamp: new Date().toISOString(),
      });

      expect(ws.sent).toHaveLength(1);
      const response = JSON.parse(ws.sent[0]) as WsMessage;
      expect(response.payload).toHaveProperty('channels', []);
      expect(response.payload).toHaveProperty('snapshots', {});
    });
  });

  describe('Connection Health & Auto-Reconnect', () => {
    it('should auto-reconnect on unexpected disconnect', () => {
      createGateway({ baseDelay: 100, maxDelay: 1000 });
      gateway.connect();
      const ws = getLatestMockWs();
      ws.simulateOpen();

      // Simulate unexpected close
      ws.simulateClose(1006, 'Abnormal Closure');
      expect(gateway.status).toBe('reconnecting');

      // Advance timer past reconnect delay
      vi.advanceTimersByTime(200);

      // Should have created a new WebSocket
      expect(mockInstances).toHaveLength(2);
    });

    it('should track reconnect attempts', () => {
      createGateway({ baseDelay: 100, maxDelay: 1000 });
      gateway.connect();
      getLatestMockWs().simulateOpen();

      expect(gateway.reconnectAttempts).toBe(0);

      getLatestMockWs().simulateClose(1006, 'Abnormal Closure');
      expect(gateway.reconnectAttempts).toBe(0); // not incremented until attempt

      vi.advanceTimersByTime(200);
      expect(gateway.reconnectAttempts).toBeGreaterThanOrEqual(1);
    });

    it('should reset attempts on successful reconnect', () => {
      createGateway({ baseDelay: 100, maxDelay: 1000 });
      gateway.connect();
      getLatestMockWs().simulateOpen();

      // Disconnect and reconnect
      getLatestMockWs().simulateClose(1006);
      vi.advanceTimersByTime(200);

      // Simulate successful reconnection
      getLatestMockWs().simulateOpen();

      expect(gateway.reconnectAttempts).toBe(0);
      expect(gateway.status).toBe('connected');
    });

    it('should not reconnect on intentional disconnect', () => {
      createGateway({ baseDelay: 100, maxDelay: 1000 });
      gateway.connect();
      getLatestMockWs().simulateOpen();

      gateway.disconnect();

      vi.advanceTimersByTime(5000);

      // Should still be only 1 instance (no reconnect)
      expect(mockInstances).toHaveLength(1);
      expect(gateway.status).toBe('disconnected');
    });

    it('should not reconnect after close', () => {
      createGateway({ baseDelay: 100, maxDelay: 1000 });
      gateway.connect();
      getLatestMockWs().simulateOpen();

      gateway.close();

      vi.advanceTimersByTime(5000);
      expect(mockInstances).toHaveLength(1);
    });

    it('should respect maxRetries limit', () => {
      createGateway({ baseDelay: 100, maxDelay: 200, maxRetries: 2 });
      gateway.connect();
      getLatestMockWs().simulateOpen();

      // First disconnect
      getLatestMockWs().simulateClose(1006);
      vi.advanceTimersByTime(200);

      // First reconnect attempt fails
      getLatestMockWs().simulateClose(1006);
      vi.advanceTimersByTime(400);

      // Second reconnect attempt fails
      getLatestMockWs().simulateClose(1006);
      vi.advanceTimersByTime(400);

      // Should stop trying (3 instances total: original + 2 retries)
      expect(mockInstances.length).toBeLessThanOrEqual(4);
      expect(gateway.status).toBe('disconnected');
    });

    it('should notify status change during reconnect', () => {
      createGateway({ baseDelay: 100 });
      gateway.connect();
      getLatestMockWs().simulateOpen();
      onStatusChange.mockClear();

      getLatestMockWs().simulateClose(1006);
      expect(onStatusChange).toHaveBeenCalledWith('reconnecting');
    });
  });

  describe('Error Handling', () => {
    it('should handle WebSocket errors without crashing', () => {
      createGateway();
      gateway.connect();
      const ws = getLatestMockWs();

      // Error before open
      ws.simulateError();
      expect(gateway.status).not.toBe('connected');
    });

    it('should handle response callback errors with isolation', () => {
      onResponse.mockImplementation(() => {
        throw new Error('Callback exploded');
      });

      createGateway();
      gateway.connect();
      const ws = getLatestMockWs();
      ws.simulateOpen();

      const requestId = gateway.sendRequest('test');

      // Should not throw
      expect(() => {
        ws.simulateMessage({
          type: 'agent_response',
          payload: { requestId, result: createMockResult() },
          timestamp: new Date().toISOString(),
        });
      }).not.toThrow();
    });
  });

  describe('Closed State', () => {
    it('should return disconnected after close', () => {
      createGateway();
      gateway.close();
      expect(gateway.status).toBe('disconnected');
    });

    it('should return 0 reconnect attempts after close', () => {
      createGateway();
      gateway.close();
      expect(gateway.reconnectAttempts).toBe(0);
    });

    it('should throw on sendRequest after close', () => {
      createGateway();
      gateway.close();
      expect(() => gateway.sendRequest('test')).toThrow();
    });

    it('should not crash on double close', () => {
      createGateway();
      gateway.close();
      expect(() => gateway.close()).not.toThrow();
    });

    it('should not crash on disconnect after close', () => {
      createGateway();
      gateway.close();
      expect(() => gateway.disconnect()).not.toThrow();
    });

    it('should not crash on connect after close', () => {
      createGateway();
      gateway.close();
      // connect() should be a no-op after close
      gateway.connect();
      expect(gateway.status).toBe('disconnected');
    });
  });

  describe('Stale Socket Handling', () => {
    it('should ignore old socket onclose when new socket is already open', () => {
      createGateway({ baseDelay: 100, maxDelay: 1000 });
      gateway.connect();
      const firstWs = getLatestMockWs();

      // Create second socket before first opens
      gateway.connect();
      const secondWs = getLatestMockWs();

      expect(mockInstances).toHaveLength(2);

      // Second socket opens successfully
      secondWs.simulateOpen();
      expect(gateway.status).toBe('connected');

      // Clear status change mocks to see if reconnect is triggered
      onStatusChange.mockClear();

      // First socket closes (stale) — should NOT trigger reconnect
      firstWs.simulateClose(1006);

      // Status should stay connected (not transition to reconnecting)
      expect(gateway.status).toBe('connected');
      expect(onStatusChange).not.toHaveBeenCalled();
    });

    it('should not receive messages from stale socket', () => {
      createGateway();
      gateway.connect();
      const firstWs = getLatestMockWs();
      firstWs.simulateOpen();

      gateway.connect();
      const secondWs = getLatestMockWs();
      secondWs.simulateOpen();

      onResponse.mockClear();

      // Send message from stale socket after new one is active
      const requestId = gateway.sendRequest('test');
      firstWs.simulateMessage({
        type: 'agent_response',
        payload: { requestId, result: createMockResult('wrong response') },
        timestamp: new Date().toISOString(),
      });

      // Stale message should be ignored (callback not invoked from old socket)
      expect(onResponse).not.toHaveBeenCalled();
    });
  });

  describe('Send Reliability', () => {
    it('should verify sendRequest actually sends before returning requestId', () => {
      createGateway();
      gateway.connect();
      const ws = getLatestMockWs();
      ws.simulateOpen();

      // Mock send to fail
      const originalSend = ws.send.bind(ws);
      ws.send = vi.fn(() => {
        throw new Error('WebSocket is not open');
      });

      // sendRequest should fail if actual send fails
      expect(() => gateway.sendRequest('test')).toThrow('WebSocket is not open');
    });
  });

  describe('Ping/Pong', () => {
    it('should respond to ping with pong', () => {
      createGateway();
      gateway.connect();
      const ws = getLatestMockWs();
      ws.simulateOpen();

      ws.simulateMessage({
        type: 'ping',
        payload: {},
        timestamp: new Date().toISOString(),
      });

      expect(ws.sent).toHaveLength(1);
      const pong = JSON.parse(ws.sent[0]) as WsMessage;
      expect(pong.type).toBe('pong');
    });
  });
});
