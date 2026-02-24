import { createHostService } from '@lensing/core';
import type { HostServiceInstance } from '@lensing/core';

export interface StartServerOptions {
  port?: number;
  pluginsDir?: string;
  dbPath?: string;
  logger?: {
    info(msg: string, data?: unknown): void;
    error(msg: string, err?: unknown): void;
  };
}

export interface StartServerResult {
  host: HostServiceInstance;
  port: number;
}

const DEFAULT_PORT = 3100;
const DEFAULT_PLUGINS_DIR = './plugins';
const DEFAULT_DB_PATH = './data/lensing.db';

export async function startServer(options: StartServerOptions = {}): Promise<StartServerResult> {
  const { port = DEFAULT_PORT, pluginsDir = DEFAULT_PLUGINS_DIR, dbPath = DEFAULT_DB_PATH, logger } = options;

  const host = createHostService({ port, pluginsDir, dbPath });
  await host.ready;

  const boundPort = host.port;
  logger?.info(`Lensing listening on http://localhost:${boundPort}`);

  return { host, port: boundPort };
}
