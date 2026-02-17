import http from 'node:http';
import type { ZoneConfig } from '@lensing/types';

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
  /** Gracefully close the server */
  close(): Promise<void>;
}

/** Route record: method → async handler */
type RouteHandler = (
  req: http.IncomingMessage,
  res: http.ServerResponse,
  body: string,
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

/** Read the full request body as a string */
function readBody(req: http.IncomingMessage): Promise<string> {
  return new Promise((resolve, reject) => {
    let data = '';
    req.on('data', (chunk: Buffer) => {
      data += chunk.toString();
    });
    req.on('end', () => resolve(data));
    req.on('error', reject);
  });
}

/** Create a REST server with the factory pattern */
export function createRestServer(
  handlers: RestServerHandlers,
  options: RestServerOptions = {},
): RestServerInstance {
  const { port = 0, corsOrigins, logger } = options;
  const startedAt = Date.now();
  let boundPort = 0;
  let closed = false;

  const corsOrigin =
    corsOrigins && corsOrigins.length > 0 ? corsOrigins[0] : '*';

  const corsHeaders = {
    'Access-Control-Allow-Origin': corsOrigin,
    'Access-Control-Allow-Methods': 'GET, PUT, OPTIONS',
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

  const server = http.createServer(async (req, res) => {
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
      logger?.({ method, path, status: 204, duration_ms: Date.now() - start });
      return;
    }

    const pathRoutes = routes.get(path);
    if (!pathRoutes) {
      writeJson(res, 404, { error: 'Not Found' });
      logger?.({ method, path, status: 404, duration_ms: Date.now() - start });
      return;
    }

    const handler = pathRoutes.get(method);
    if (!handler) {
      writeJson(res, 405, { error: 'Method Not Allowed' });
      logger?.({ method, path, status: 405, duration_ms: Date.now() - start });
      return;
    }

    const body = await readBody(req);
    await handler(req, res, body);

    const status = res.statusCode;
    logger?.({ method, path, status, duration_ms: Date.now() - start });
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
