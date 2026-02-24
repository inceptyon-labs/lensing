import { createDatabase } from './database';
import { createPluginLoader } from './plugin-loader';
import { createDataBus } from './data-bus';
import { createRestServer } from './rest-server';
import { createWsServer } from './ws-server';
import { createPluginScheduler } from './plugin-scheduler';
import type { HostServiceOptions, DatabaseInstance, PluginLoader } from '@lensing/types';
import type { RestServerInstance } from './rest-server';
import type { WsServerInstance } from './ws-server';

/** Public interface returned by createHostService factory */
export interface HostServiceInstance {
  /** Resolves when the host service has fully booted (all services ready) */
  ready: Promise<void>;
  /** Actual bound port (available after ready resolves) */
  readonly port: number;
  /** Stop all services and release resources */
  close(): Promise<void>;
  /** The database instance (available after ready) */
  readonly db: DatabaseInstance;
  /** The REST server instance (available after ready) */
  readonly rest: RestServerInstance;
  /** The WebSocket server instance (available after ready) */
  readonly ws: WsServerInstance;
  /** The plugin loader instance (available after ready) */
  readonly plugins: PluginLoader;
}

export function createHostService(options: HostServiceOptions = {}): HostServiceInstance {
  const { port = 0, pluginsDir = './plugins', dbPath = ':memory:', logger } = options;

  let _db: DatabaseInstance;
  let _rest: RestServerInstance;
  let _ws: WsServerInstance;
  let _plugins: PluginLoader;
  let _port = 0;

  const log = {
    info: (msg: string, data?: unknown) => logger?.info(msg, data),
    error: (msg: string, err?: unknown) => logger?.error(msg, err),
  };

  const ready = (async () => {
    // 1. Database
    _db = createDatabase({ path: dbPath });
    log.info('Database ready');

    // 2. Plugin loader
    _plugins = createPluginLoader({ pluginsDir });
    await _plugins.load();
    log.info('Plugins loaded', { count: _plugins.getAllPlugins().length });

    // 3. Data bus
    const dataBus = createDataBus();

    // 4. REST server (wired to database)
    _rest = createRestServer(
      {
        getSettings: async () => _db.getAllSettings(),
        putSettings: async (settings) => {
          for (const [key, value] of Object.entries(settings)) {
            _db.setSetting(key, String(value));
          }
        },
        getLayout: async () => _db.getLayout('default') ?? [],
        putLayout: async (layout) => {
          _db.setLayout('default', layout);
        },
        postAsk: async (question) => ({
          id: crypto.randomUUID(),
          question,
          response: 'Ask feature not yet available.',
          timestamp: new Date().toISOString(),
          tool_calls_made: 0,
        }),
      },
      { port }
    );

    await _rest.ready();
    _port = _rest.port;
    log.info('REST server ready', { port: _port });

    // 5. WebSocket server (attached to REST's HTTP server)
    _ws = createWsServer({ server: _rest.server });
    await _ws.ready();
    log.info('WebSocket server ready');

    // 6. Plugin scheduler (no-op — plugins can register themselves)
    createPluginScheduler();
    log.info('Host service boot complete');

    void dataBus; // used for future plugin wiring
  })();

  // Set up SIGINT/SIGTERM graceful shutdown
  const shutdownHandler = () => {
    void (async () => {
      await _ws?.close();
      await _rest?.close();
      _db?.close();
    })();
  };
  process.once('SIGINT', shutdownHandler);
  process.once('SIGTERM', shutdownHandler);

  return {
    ready,

    get port() {
      return _port;
    },

    async close() {
      process.off('SIGINT', shutdownHandler);
      process.off('SIGTERM', shutdownHandler);
      await _ws?.close();
      await _rest?.close();
      _db?.close();
    },

    get db() {
      return _db;
    },

    get rest() {
      return _rest;
    },

    get ws() {
      return _ws;
    },

    get plugins() {
      return _plugins;
    },
  };
}
