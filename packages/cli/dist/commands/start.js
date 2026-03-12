import { createHostService } from '@lensing/core';
const DEFAULT_PORT = 3100;
const DEFAULT_PLUGINS_DIR = './plugins';
const DEFAULT_DB_PATH = './data/lensing.db';
export async function startServer(options = {}) {
    const { port = DEFAULT_PORT, pluginsDir = DEFAULT_PLUGINS_DIR, dbPath = DEFAULT_DB_PATH, logger, authToken, bindAddress, } = options;
    const host = createHostService({ port, pluginsDir, dbPath, authToken, bindAddress });
    await host.ready;
    const boundPort = host.port;
    logger?.info(`Lensing listening on http://localhost:${boundPort}`);
    return { host, port: boundPort };
}
//# sourceMappingURL=start.js.map