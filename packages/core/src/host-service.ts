import { createDatabase } from './database';
import { createPluginLoader } from './plugin-loader';
import { createDataBus } from './data-bus';
import { createRestServer } from './rest-server';
import { createWsServer } from './ws-server';
import { createPluginScheduler } from './plugin-scheduler';
import { createPluginAdminHandlers } from './plugin-admin-handlers';
import { createNotificationQueue } from './notification-queue';
import { bootEnabledModules, rebootModule } from './module-boot';
import type { BootedModule } from './module-boot';
import type { HostServiceOptions, DatabaseInstance, PluginLoader, ModuleId } from '@lensing/types';
import { MODULE_SCHEMAS } from '@lensing/types';
import type { DataBusInstance } from '@lensing/types';
import type { NotificationQueueInstance } from './notification-queue';
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
  /** Booted built-in modules (available after ready) */
  readonly modules: BootedModule[];
  /** The data bus instance (available after ready) */
  readonly dataBus: DataBusInstance;
}

export function createHostService(options: HostServiceOptions = {}): HostServiceInstance {
  const { port = 0, pluginsDir = './plugins', dbPath = ':memory:', logger } = options;

  let _db: DatabaseInstance | undefined;
  let _rest: RestServerInstance | undefined;
  let _ws: WsServerInstance | undefined;
  let _plugins: PluginLoader | undefined;
  let _modules: BootedModule[] = [];
  let _notificationQueue: NotificationQueueInstance | undefined;
  let _port = 0;
  let _dataBus: DataBusInstance | undefined;

  const log = {
    info: (msg: string, data?: unknown) => logger?.info(msg, data),
    error: (msg: string, err?: unknown) => logger?.error(msg, err),
  };

  const ready = (async () => {
    try {
      // 1. Database
      _db = createDatabase({ path: dbPath });
      log.info('Database ready');

      // 2. Plugin loader
      _plugins = createPluginLoader({ pluginsDir });
      await _plugins.load();
      log.info('Plugins loaded', { count: _plugins.getAllPlugins().length });

      // 3. Data bus
      const dataBus = createDataBus();
      _dataBus = dataBus;

      // 4. REST server (wired to database + plugins)
      const pluginHandlers = createPluginAdminHandlers({
        pluginLoader: _plugins,
        db: _db!,
        pluginsDir,
      });

      _rest = createRestServer(
        {
          getSettings: async () => {
            const all = _db!.getAllSettings();
            // Redact password-typed fields so plaintext secrets are never sent to the client
            const redacted: Record<string, unknown> = { ...all };
            for (const schema of MODULE_SCHEMAS) {
              for (const field of schema.fields) {
                if (field.type === 'password') {
                  const key = `${schema.id}.${field.key}`;
                  if (key in redacted) {
                    redacted[key] = '••••••••';
                  }
                }
              }
            }
            return redacted;
          },
          putSettings: async (settings) => {
            for (const [key, value] of Object.entries(settings)) {
              // Skip redacted placeholders so we never overwrite real secrets
              if (String(value) === '••••••••') continue;
              _db!.setSetting(key, String(value));
            }
          },
          getLayout: async () => _db!.getLayout('default') ?? [],
          putLayout: async (layout) => {
            _db!.setLayout('default', layout);
          },
          postAsk: async (question) => ({
            id: crypto.randomUUID(),
            question,
            response: 'Ask feature not yet available.',
            timestamp: new Date().toISOString(),
            tool_calls_made: 0,
          }),
          ...pluginHandlers,
          restartModule: async (id) => {
            const schema = MODULE_SCHEMAS.find((s) => s.id === id);
            if (!schema) throw new Error(`Unknown module: ${id}`);
            const result = rebootModule(
              id as ModuleId,
              _modules,
              _db!,
              { dataBus, notifications: _notificationQueue! },
              logger
            );
            return { ok: true, running: result !== null };
          },
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

      // Wire data bus → WebSocket: forward all module data to connected display clients
      dataBus.onMessage((msg) => {
        _ws!.broadcast({ type: 'plugin_data', payload: msg, timestamp: new Date().toISOString() });
      });

      // 6. Plugin scheduler (no-op — plugins can register themselves)
      createPluginScheduler();

      // 7. Boot enabled built-in modules from DB settings
      _notificationQueue = createNotificationQueue();
      _modules = bootEnabledModules(_db!, { dataBus, notifications: _notificationQueue }, logger);

      log.info('Host service boot complete');
    } catch (err) {
      // Clean up any resources that were initialized before the failure
      log.error('Boot failed, cleaning up', err);
      for (const mod of _modules) {
        try {
          if (mod.timer !== undefined) clearInterval(mod.timer);
          mod.instance.close();
        } catch {
          /* ignore */
        }
      }
      try {
        _notificationQueue?.close();
      } catch {
        /* ignore cleanup errors */
      }
      try {
        await _ws?.close();
      } catch {
        /* ignore cleanup errors */
      }
      try {
        await _rest?.close();
      } catch {
        /* ignore cleanup errors */
      }
      try {
        _db?.close();
      } catch {
        /* ignore cleanup errors */
      }
      throw err;
    }
  })();

  // Set up SIGINT/SIGTERM graceful shutdown
  const shutdownHandler = () => {
    void (async () => {
      try {
        for (const mod of _modules) {
          try {
            if (mod.timer !== undefined) clearInterval(mod.timer);
          mod.instance.close();
          } catch {
            /* ignore */
          }
        }
        _notificationQueue?.close();
        await _ws?.close();
        await _rest?.close();
        _db?.close();
      } catch (err) {
        log.error('Shutdown error', err);
      }
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
      for (const mod of _modules) {
        try {
          if (mod.timer !== undefined) clearInterval(mod.timer);
          mod.instance.close();
        } catch {
          /* ignore */
        }
      }
      _notificationQueue?.close();
      await _ws?.close();
      await _rest?.close();
      _db?.close();
    },

    get db() {
      return _db!;
    },

    get rest() {
      return _rest!;
    },

    get ws() {
      return _ws!;
    },

    get plugins() {
      return _plugins!;
    },

    get modules() {
      return _modules;
    },

    get dataBus() {
      return _dataBus!;
    },
  };
}
