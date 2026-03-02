import { describe, it, expect, afterEach } from 'vitest';
import { createWsServer } from '../ws-server';
import http from 'node:http';
import WebSocket from 'ws';

const AUTH_TOKEN = 'test-secret-token-xyz789';

describe('WebSocket server auth', () => {
  const serverInstances: Array<{
    restServer: http.Server;
    wsServer: ReturnType<typeof createWsServer>;
  }> = [];

  afterEach(async () => {
    for (const { restServer, wsServer } of serverInstances) {
      await wsServer.close();
      await new Promise<void>((resolve) => {
        restServer.close(() => resolve());
      });
    }
    serverInstances.length = 0;
  });

  /**
   * Helper to create and start an HTTP server with WebSocket.
   * Returns the port and wsServer instance.
   */
  async function startServer(options?: {
    authToken?: string;
  }): Promise<{ port: number; wsServer: any }> {
    const restServer = http.createServer();
    const wsServer = createWsServer({
      server: restServer,
      authToken: options?.authToken,
    });

    const port = await new Promise<number>((resolve, reject) => {
      restServer.listen(0, '127.0.0.1', () => {
        const addr = restServer.address();
        if (typeof addr === 'object' && addr) {
          resolve(addr.port);
        } else {
          reject(new Error('Failed to get port'));
        }
      });
    });

    await wsServer.ready();
    serverInstances.push({ restServer, wsServer });
    return { port, wsServer };
  }

  /**
   * Helper to attempt WebSocket connection with optional Authorization header.
   */
  async function attemptConnection(port: number, token?: string): Promise<WebSocket> {
    return new Promise((resolve, reject) => {
      const url = `ws://127.0.0.1:${port}`;
      const headers = token ? { Authorization: `Bearer ${token}` } : {};
      const ws = new WebSocket(url, { headers });

      const openHandler = () => {
        ws.removeEventListener('error', errorHandler);
        resolve(ws);
      };

      const errorHandler = (event: Event) => {
        ws.removeEventListener('open', openHandler);
        reject(new Error('Connection rejected'));
      };

      ws.on('open', openHandler);
      ws.on('error', errorHandler);

      // Timeout after 2 seconds
      setTimeout(() => {
        ws.removeEventListener('open', openHandler);
        ws.removeEventListener('error', errorHandler);
        reject(new Error('Connection timeout'));
      }, 2000);
    });
  }

  describe('when authToken is configured', () => {
    it('should reject WebSocket upgrade without token', async () => {
      const { port } = await startServer({ authToken: AUTH_TOKEN });

      let connectionSucceeded = false;
      try {
        const ws = await attemptConnection(port);
        connectionSucceeded = true;
        ws.close();
      } catch {
        // Expected to fail
      }

      expect(connectionSucceeded).toBe(false);
    });

    it('should reject WebSocket upgrade with wrong token', async () => {
      const { port } = await startServer({ authToken: AUTH_TOKEN });

      let connectionSucceeded = false;
      try {
        const ws = await attemptConnection(port, 'wrong-token');
        connectionSucceeded = true;
        ws.close();
      } catch {
        // Expected to fail
      }

      expect(connectionSucceeded).toBe(false);
    });

    it('should allow WebSocket upgrade with valid token', async () => {
      const { port } = await startServer({ authToken: AUTH_TOKEN });

      const ws = await attemptConnection(port, AUTH_TOKEN);
      expect(ws.readyState).toBe(WebSocket.OPEN);
      ws.close();
    });
  });

  describe('when authToken is not configured', () => {
    it('should allow WebSocket upgrade without token', async () => {
      const { port } = await startServer();

      const ws = await attemptConnection(port);
      expect(ws.readyState).toBe(WebSocket.OPEN);
      ws.close();
    });
  });
});
