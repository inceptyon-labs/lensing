import http from 'node:http';
import type { ZoneConfig, ConversationEntry, PluginAdminEntry, ZoneName } from '@lensing/types';

/** Log entry emitted after each request */
export interface LogEntry {
  method: string;
  path: string;
  status: number;
  duration_ms: number;
}

/** Callbacks supplying data from storage */
export interface RestServerHandlers {
  getSettings: () => Promise<Record<string, unknown>>;
  putSettings: (settings: Record<string, unknown>) => Promise<void>;
  getLayout: () => Promise<ZoneConfig[]>;
  putLayout: (layout: ZoneConfig[]) => Promise<void>;
  postAsk: (question: string) => Promise<ConversationEntry>;
  // Plugin management (optional — omit to disable plugin endpoints)
  getPlugins?: () => Promise<PluginAdminEntry[]>;
  getPlugin?: (id: string) => Promise<PluginAdminEntry | undefined>;
  setPluginEnabled?: (id: string, enabled: boolean) => Promise<void>;
  updatePluginConfig?: (id: string, config: Record<string, unknown>) => Promise<void>;
  assignPluginZone?: (id: string, zone: ZoneName | undefined) => Promise<void>;
  reloadPlugins?: () => Promise<void>;
  installPlugin?: (zipBuffer: Buffer) => Promise<PluginAdminEntry>;
  // Module management
  restartModule?: (id: string) => Promise<{ ok: boolean; running: boolean }>;
}

/** Configuration options for the REST server */
export interface RestServerOptions {
  /** Port to listen on. Defaults to 0 (OS-assigned) */
  port?: number;
  /** Allowed CORS origins. Defaults to ['*'] (wildcard) */
  corsOrigins?: string[];
  /** Structured log callback. Receives one entry per request */
  logger?: (entry: LogEntry) => void;
}

/** Public interface returned by createRestServer */
export interface RestServerInstance {
  /** Resolves when the server is listening */
  ready(): Promise<void>;
  /** Actual bound port (available after ready resolves) */
  readonly port: number;
  /** The underlying Node.js HTTP server (for attaching WebSocket, etc.) */
  readonly server: http.Server;
  /** Gracefully close the server */
  close(): Promise<void>;
}

/** Route record: method → async handler */
type RouteHandler = (
  req: http.IncomingMessage,
  res: http.ServerResponse,
  body: string
) => Promise<void>;

type RouteTable = Map<string, Map<string, RouteHandler>>;

/** Write a JSON response */
function writeJson(res: http.ServerResponse, status: number, data: unknown): void {
  const payload = JSON.stringify(data);
  res.writeHead(status, {
    'Content-Type': 'application/json',
    'Content-Length': Buffer.byteLength(payload),
  });
  res.end(payload);
}

/** Read the full request body as a Buffer with size limit */
function readBinaryBody(
  req: http.IncomingMessage,
  maxBytes: number = 10 * 1024 * 1024
): Promise<Buffer> {
  return new Promise((resolve, reject) => {
    let totalBytes = 0;
    const chunks: Buffer[] = [];

    req.on('data', (chunk: Buffer) => {
      totalBytes += chunk.length;
      if (totalBytes > maxBytes) {
        req.pause();
        reject(new Error('Payload too large'));
        return;
      }
      chunks.push(chunk);
    });

    req.on('end', () => {
      resolve(Buffer.concat(chunks));
    });

    req.on('error', reject);
  });
}

/** Read the full request body as a string with size limit */
function readBody(req: http.IncomingMessage, maxBytes: number = 1024 * 100): Promise<string> {
  return new Promise((resolve, reject) => {
    let totalBytes = 0;
    const chunks: Buffer[] = [];

    req.on('data', (chunk: Buffer) => {
      totalBytes += chunk.length;
      if (totalBytes > maxBytes) {
        req.pause();
        reject(new Error('Payload too large'));
        return;
      }
      chunks.push(chunk);
    });

    req.on('end', () => {
      try {
        const data = Buffer.concat(chunks).toString('utf8');
        resolve(data);
      } catch (err) {
        reject(err);
      }
    });

    req.on('error', reject);
  });
}

/** Create a REST server with the factory pattern */
export function createRestServer(
  handlers: RestServerHandlers,
  options: RestServerOptions = {}
): RestServerInstance {
  const { port = 0, corsOrigins, logger } = options;
  const startedAt = Date.now();
  let boundPort = 0;
  let closed = false;

  const corsOrigin = corsOrigins && corsOrigins.length > 0 ? corsOrigins[0] : '*';

  const corsHeaders = {
    'Access-Control-Allow-Origin': corsOrigin,
    'Access-Control-Allow-Methods': 'GET, PUT, POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
  };

  // Build route table: path → method → handler
  const routes: RouteTable = new Map();

  function addRoute(path: string, method: string, handler: RouteHandler): void {
    if (!routes.has(path)) {
      routes.set(path, new Map());
    }
    routes.get(path)!.set(method.toUpperCase(), handler);
  }

  // Register routes
  addRoute('/health', 'GET', async (_req, res) => {
    writeJson(res, 200, { status: 'ok', uptime: (Date.now() - startedAt) / 1000 });
  });

  addRoute('/settings', 'GET', async (_req, res) => {
    const settings = await handlers.getSettings();
    writeJson(res, 200, settings);
  });

  addRoute('/settings', 'PUT', async (_req, res, body) => {
    let settings: Record<string, unknown>;
    try {
      settings = JSON.parse(body) as Record<string, unknown>;
    } catch {
      writeJson(res, 400, { error: 'Invalid JSON' });
      return;
    }
    await handlers.putSettings(settings);
    writeJson(res, 200, { ok: true });
  });

  addRoute('/layout', 'GET', async (_req, res) => {
    const layout = await handlers.getLayout();
    writeJson(res, 200, layout);
  });

  addRoute('/layout', 'PUT', async (_req, res, body) => {
    let layout: ZoneConfig[];
    try {
      layout = JSON.parse(body) as ZoneConfig[];
    } catch {
      writeJson(res, 400, { error: 'Invalid JSON' });
      return;
    }
    await handlers.putLayout(layout);
    writeJson(res, 200, { ok: true });
  });

  addRoute('/ask', 'POST', async (_req, res, body) => {
    let parsed: Record<string, unknown>;
    try {
      parsed = JSON.parse(body) as Record<string, unknown>;
    } catch {
      writeJson(res, 400, { error: 'Invalid JSON' });
      return;
    }
    const question = parsed['question'];
    if (typeof question !== 'string' || question.trim() === '') {
      writeJson(res, 400, { error: 'question is required' });
      return;
    }
    const entry = await handlers.postAsk(question);
    writeJson(res, 200, entry);
  });

  const server = http.createServer((req, res) => {
    const method = (req.method ?? 'GET').toUpperCase();
    const path = req.url ?? '/';
    const start = Date.now();

    // Apply CORS headers to all responses
    for (const [key, value] of Object.entries(corsHeaders)) {
      res.setHeader(key, value);
    }

    // Handle preflight
    if (method === 'OPTIONS') {
      res.writeHead(204);
      res.end();
      try {
        logger?.({ method, path, status: 204, duration_ms: Date.now() - start });
      } catch {
        // Ignore logger errors
      }
      return;
    }

    // Wrap handler in error handling
    (async () => {
      try {
        // Strip query string from path for route matching
        const cleanPath = path.split('?')[0];

        // Module restart route: POST /modules/:id/restart
        const moduleMatch = cleanPath.match(/^\/modules\/([^/]+)\/restart$/);
        if (moduleMatch && method === 'POST') {
          if (!handlers.restartModule) {
            writeJson(res, 404, { error: 'Not Found' });
            try {
              logger?.({ method, path, status: 404, duration_ms: Date.now() - start });
            } catch {
              // Ignore logger errors
            }
            return;
          }
          try {
            const moduleId = decodeURIComponent(moduleMatch[1]!);
            const result = await handlers.restartModule(moduleId);
            writeJson(res, 200, result);
            try {
              logger?.({ method, path, status: 200, duration_ms: Date.now() - start });
            } catch {
              // Ignore logger errors
            }
          } catch (err) {
            const msg = err instanceof Error ? err.message : 'Restart failed';
            writeJson(res, 500, { error: msg });
            try {
              logger?.({ method, path, status: 500, duration_ms: Date.now() - start });
            } catch {
              // Ignore logger errors
            }
          }
          return;
        }

        // Try parameterized plugin routes before exact-match lookup
        if (cleanPath === '/plugins/install' && method === 'POST') {
          if (!handlers.installPlugin) {
            writeJson(res, 404, { error: 'Not Found' });
            try {
              logger?.({ method, path, status: 404, duration_ms: Date.now() - start });
            } catch {
              // Ignore logger errors
            }
            return;
          }
          try {
            const zipBuffer = await readBinaryBody(req);
            const plugin = await handlers.installPlugin(zipBuffer);
            writeJson(res, 201, { ok: true, plugin });
            try {
              logger?.({ method, path, status: 201, duration_ms: Date.now() - start });
            } catch {
              // Ignore logger errors
            }
          } catch (err) {
            const msg = err instanceof Error ? err.message : 'Install failed';
            writeJson(res, 400, { error: msg });
            try {
              logger?.({ method, path, status: 400, duration_ms: Date.now() - start });
            } catch {
              // Ignore logger errors
            }
          }
          return;
        }

        if (cleanPath === '/plugins/reload' && method === 'POST') {
          if (!handlers.reloadPlugins) {
            writeJson(res, 404, { error: 'Not Found' });
            try {
              logger?.({ method, path, status: 404, duration_ms: Date.now() - start });
            } catch {
              // Ignore logger errors
            }
            return;
          }
          await handlers.reloadPlugins();
          writeJson(res, 200, { ok: true });
          try {
            logger?.({ method, path, status: 200, duration_ms: Date.now() - start });
          } catch {
            // Ignore logger errors
          }
          return;
        }

        const pluginMatch = cleanPath.match(/^\/plugins\/([^/]+)(?:\/(.+))?$/);
        if (pluginMatch) {
          const pluginId = decodeURIComponent(pluginMatch[1]!);
          const action = pluginMatch[2];

          // GET /plugins/:id
          if (!action && method === 'GET') {
            if (!handlers.getPlugin) {
              writeJson(res, 404, { error: 'Not Found' });
              try {
                logger?.({ method, path, status: 404, duration_ms: Date.now() - start });
              } catch {
                // Ignore logger errors
              }
              return;
            }
            const plugin = await handlers.getPlugin(pluginId);
            if (!plugin) {
              writeJson(res, 404, { error: `Plugin '${pluginId}' not found` });
            } else {
              writeJson(res, 200, plugin);
            }
            try {
              logger?.({ method, path, status: res.statusCode, duration_ms: Date.now() - start });
            } catch {
              // Ignore logger errors
            }
            return;
          }

          // PUT /plugins/:id/enabled
          if (action === 'enabled' && method === 'PUT') {
            if (!handlers.setPluginEnabled) {
              writeJson(res, 404, { error: 'Not Found' });
              try {
                logger?.({ method, path, status: 404, duration_ms: Date.now() - start });
              } catch {
                // Ignore logger errors
              }
              return;
            }
            const body = await readBody(req);
            let parsed: Record<string, unknown>;
            try {
              parsed = JSON.parse(body) as Record<string, unknown>;
            } catch {
              writeJson(res, 400, { error: 'Invalid JSON' });
              try {
                logger?.({ method, path, status: 400, duration_ms: Date.now() - start });
              } catch {
                // Ignore logger errors
              }
              return;
            }
            if (typeof parsed['enabled'] !== 'boolean') {
              writeJson(res, 400, { error: 'enabled (boolean) is required' });
              try {
                logger?.({ method, path, status: 400, duration_ms: Date.now() - start });
              } catch {
                // Ignore logger errors
              }
              return;
            }
            await handlers.setPluginEnabled(pluginId, parsed['enabled'] as boolean);
            writeJson(res, 200, { ok: true });
            try {
              logger?.({ method, path, status: 200, duration_ms: Date.now() - start });
            } catch {
              // Ignore logger errors
            }
            return;
          }

          // PUT /plugins/:id/config
          if (action === 'config' && method === 'PUT') {
            if (!handlers.updatePluginConfig) {
              writeJson(res, 404, { error: 'Not Found' });
              try {
                logger?.({ method, path, status: 404, duration_ms: Date.now() - start });
              } catch {
                // Ignore logger errors
              }
              return;
            }
            const body = await readBody(req);
            let parsed: Record<string, unknown>;
            try {
              parsed = JSON.parse(body) as Record<string, unknown>;
            } catch {
              writeJson(res, 400, { error: 'Invalid JSON' });
              try {
                logger?.({ method, path, status: 400, duration_ms: Date.now() - start });
              } catch {
                // Ignore logger errors
              }
              return;
            }
            if (
              !parsed['config'] ||
              typeof parsed['config'] !== 'object' ||
              Array.isArray(parsed['config'])
            ) {
              writeJson(res, 400, { error: 'config (object) is required' });
              try {
                logger?.({ method, path, status: 400, duration_ms: Date.now() - start });
              } catch {
                // Ignore logger errors
              }
              return;
            }
            await handlers.updatePluginConfig(
              pluginId,
              parsed['config'] as Record<string, unknown>
            );
            writeJson(res, 200, { ok: true });
            try {
              logger?.({ method, path, status: 200, duration_ms: Date.now() - start });
            } catch {
              // Ignore logger errors
            }
            return;
          }

          // PUT /plugins/:id/zone
          if (action === 'zone' && method === 'PUT') {
            if (!handlers.assignPluginZone) {
              writeJson(res, 404, { error: 'Not Found' });
              try {
                logger?.({ method, path, status: 404, duration_ms: Date.now() - start });
              } catch {
                // Ignore logger errors
              }
              return;
            }
            const body = await readBody(req);
            let parsed: Record<string, unknown>;
            try {
              parsed = JSON.parse(body) as Record<string, unknown>;
            } catch {
              writeJson(res, 400, { error: 'Invalid JSON' });
              try {
                logger?.({ method, path, status: 400, duration_ms: Date.now() - start });
              } catch {
                // Ignore logger errors
              }
              return;
            }
            if (!Object.prototype.hasOwnProperty.call(parsed, 'zone')) {
              writeJson(res, 400, { error: 'zone is required' });
              try {
                logger?.({ method, path, status: 400, duration_ms: Date.now() - start });
              } catch {
                // Ignore logger errors
              }
              return;
            }
            const zone = parsed['zone'] === null ? undefined : (parsed['zone'] as ZoneName);
            await handlers.assignPluginZone(pluginId, zone);
            writeJson(res, 200, { ok: true });
            try {
              logger?.({ method, path, status: 200, duration_ms: Date.now() - start });
            } catch {
              // Ignore logger errors
            }
            return;
          }

          writeJson(res, 404, { error: 'Not Found' });
          try {
            logger?.({ method, path, status: 404, duration_ms: Date.now() - start });
          } catch {
            // Ignore logger errors
          }
          return;
        }

        // GET /plugins (exact match handled here since it's not parameterized)
        if (cleanPath === '/plugins' && method === 'GET') {
          if (!handlers.getPlugins) {
            writeJson(res, 404, { error: 'Not Found' });
            try {
              logger?.({ method, path, status: 404, duration_ms: Date.now() - start });
            } catch {
              // Ignore logger errors
            }
            return;
          }
          const plugins = await handlers.getPlugins();
          writeJson(res, 200, plugins);
          try {
            logger?.({ method, path, status: 200, duration_ms: Date.now() - start });
          } catch {
            // Ignore logger errors
          }
          return;
        }

        const pathRoutes = routes.get(cleanPath);
        if (!pathRoutes) {
          writeJson(res, 404, { error: 'Not Found' });
          try {
            logger?.({ method, path, status: 404, duration_ms: Date.now() - start });
          } catch {
            // Ignore logger errors
          }
          return;
        }

        const handler = pathRoutes.get(method);
        if (!handler) {
          writeJson(res, 405, { error: 'Method Not Allowed' });
          try {
            logger?.({ method, path, status: 405, duration_ms: Date.now() - start });
          } catch {
            // Ignore logger errors
          }
          return;
        }

        const body = await readBody(req);
        await handler(req, res, body);

        const status = res.statusCode;
        try {
          logger?.({ method, path, status, duration_ms: Date.now() - start });
        } catch {
          // Ignore logger errors
        }
      } catch (err) {
        // If response already sent, can't write error
        if (!res.headersSent) {
          const status = err instanceof Error && err.message === 'Payload too large' ? 413 : 500;
          const errorMsg = status === 413 ? 'Payload Too Large' : 'Internal Server Error';
          writeJson(res, status, { error: errorMsg });
        }
        try {
          logger?.({
            method,
            path,
            status: res.statusCode ?? 500,
            duration_ms: Date.now() - start,
          });
        } catch {
          // Ignore logger errors
        }
      }
    })();
  });

  // Promise resolver pattern (avoids TS2454)
  let onReady: () => void;
  let onError: (err: Error) => void;

  const readyPromise = new Promise<void>((resolve, reject) => {
    onReady = resolve;
    onError = reject;
  });

  server.listen(port, '127.0.0.1', () => {
    const addr = server.address();
    if (typeof addr === 'object' && addr) {
      boundPort = addr.port;
    }
    onReady!();
  });

  server.on('error', (err: Error) => {
    onError!(err);
  });

  return {
    get port() {
      return boundPort;
    },
    get server() {
      return server;
    },
    ready() {
      return readyPromise;
    },
    async close() {
      if (closed) return;
      closed = true;
      return new Promise<void>((resolve, reject) => {
        server.close((err) => {
          if (err) reject(err);
          else resolve();
        });
      });
    },
  };
}
