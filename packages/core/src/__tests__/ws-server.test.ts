import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { WebSocket } from 'ws';
import { createWsServer, type WsServerInstance } from '../ws-server';
import type { WsMessage } from '@lensing/types';

function waitForOpen(ws: WebSocket): Promise<void> {
  return new Promise((resolve, reject) => {
    if (ws.readyState === WebSocket.OPEN) {
      resolve();
      return;
    }
    ws.on('open', resolve);
    ws.on('error', reject);
  });
}

function waitForMessage(ws: WebSocket): Promise<WsMessage> {
  return new Promise((resolve) => {
    ws.once('message', (data) => {
      resolve(JSON.parse(data.toString()));
    });
  });
}

describe('WsServer', () => {
  let server: WsServerInstance;
  let clients: WebSocket[];

  beforeEach(async () => {
    clients = [];
    server = createWsServer({ port: 0 }); // Random available port
    await server.ready();
  });

  afterEach(async () => {
    for (const client of clients) {
      if (client.readyState === WebSocket.OPEN) {
        client.close();
      }
    }
    await server.close();
  });

  function connect(): WebSocket {
    const ws = new WebSocket(`ws://localhost:${server.port}`);
    clients.push(ws);
    return ws;
  }

  describe('client connections', () => {
    it('should accept client connections', async () => {
      const ws = connect();
      await waitForOpen(ws);

      expect(ws.readyState).toBe(WebSocket.OPEN);
      expect(server.clientCount).toBe(1);
    });

    it('should track multiple clients', async () => {
      const ws1 = connect();
      const ws2 = connect();
      await waitForOpen(ws1);
      await waitForOpen(ws2);

      expect(server.clientCount).toBe(2);
    });

    it('should remove clients on disconnect', async () => {
      const ws = connect();
      await waitForOpen(ws);
      expect(server.clientCount).toBe(1);

      ws.close();
      // Wait for close event to propagate
      await new Promise((r) => setTimeout(r, 50));
      expect(server.clientCount).toBe(0);
    });
  });

  describe('broadcasting', () => {
    it('should broadcast messages to all connected clients', async () => {
      const ws1 = connect();
      const ws2 = connect();
      await waitForOpen(ws1);
      await waitForOpen(ws2);

      const msg1Promise = waitForMessage(ws1);
      const msg2Promise = waitForMessage(ws2);

      server.broadcast({
        type: 'layout_change',
        payload: { zone: 'center', plugins: ['weather'] },
        timestamp: new Date().toISOString(),
      });

      const [msg1, msg2] = await Promise.all([msg1Promise, msg2Promise]);
      expect(msg1.type).toBe('layout_change');
      expect(msg2.type).toBe('layout_change');
      expect(msg1.payload).toEqual({ zone: 'center', plugins: ['weather'] });
    });

    it('should broadcast plugin data updates', async () => {
      const ws = connect();
      await waitForOpen(ws);

      const msgPromise = waitForMessage(ws);

      server.broadcast({
        type: 'plugin_data',
        payload: { plugin_id: 'weather', data: { temp: 72 } },
        timestamp: new Date().toISOString(),
      });

      const msg = await msgPromise;
      expect(msg.type).toBe('plugin_data');
      expect(msg.payload).toEqual({ plugin_id: 'weather', data: { temp: 72 } });
    });

    it('should broadcast scene changes', async () => {
      const ws = connect();
      await waitForOpen(ws);

      const msgPromise = waitForMessage(ws);

      server.broadcast({
        type: 'scene_change',
        payload: { name: 'evening' },
        timestamp: new Date().toISOString(),
      });

      const msg = await msgPromise;
      expect(msg.type).toBe('scene_change');
    });

    it('should not fail when broadcasting with no clients', () => {
      expect(() => {
        server.broadcast({
          type: 'layout_change',
          payload: {},
          timestamp: new Date().toISOString(),
        });
      }).not.toThrow();
    });
  });

  describe('heartbeat', () => {
    it('should respond to client ping with pong', async () => {
      const ws = connect();
      await waitForOpen(ws);

      const pongPromise = new Promise<void>((resolve) => {
        ws.on('pong', () => resolve());
      });

      ws.ping();
      await pongPromise;
    });

    it('should handle client ping messages as JSON', async () => {
      const ws = connect();
      await waitForOpen(ws);

      const msgPromise = waitForMessage(ws);

      // Send a ping as a WsMessage
      ws.send(
        JSON.stringify({
          type: 'ping',
          payload: {},
          timestamp: new Date().toISOString(),
        })
      );

      const msg = await msgPromise;
      expect(msg.type).toBe('pong');
    });
  });

  describe('error handling', () => {
    it('should emit connection events', async () => {
      const onConnect = vi.fn();
      const onDisconnect = vi.fn();

      server.on('connection', onConnect);
      server.on('disconnection', onDisconnect);

      const ws = connect();
      await waitForOpen(ws);
      expect(onConnect).toHaveBeenCalledTimes(1);

      ws.close();
      await new Promise((r) => setTimeout(r, 50));
      expect(onDisconnect).toHaveBeenCalledTimes(1);
    });
  });
});
