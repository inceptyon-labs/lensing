import { fileURLToPath } from 'node:url';
import { resolve, dirname } from 'node:path';
import { config } from 'dotenv';
// Resolve paths relative to monorepo root (../../.. from packages/cli/src/bin/)
const root = resolve(dirname(fileURLToPath(import.meta.url)), '../../../..');
// Load .env from monorepo root
config({ path: resolve(root, '.env') });
import { mkdirSync, existsSync, readFileSync, writeFileSync } from 'node:fs';
import { randomBytes } from 'node:crypto';
import { platform } from 'node:os';
import { createHostService, createGpiomonFactory } from '@lensing/core';
const dataDir = resolve(root, 'data');
mkdirSync(dataDir, { recursive: true });
const logger = {
    debug: (msg, data) => console.log(`[debug] ${msg}`, data ?? ''),
    info: (msg, data) => console.log(`[info]  ${msg}`, data ?? ''),
    error: (msg, err) => console.error(`[error] ${msg}`, err ?? ''),
};
// Admin token: env var, else <dataDir>/admin-token (generated on first run)
const tokenPath = resolve(dataDir, 'admin-token');
let authToken = process.env.LENSING_ADMIN_TOKEN?.trim();
if (!authToken && existsSync(tokenPath)) {
    authToken = readFileSync(tokenPath, 'utf8').trim();
}
if (!authToken) {
    authToken = randomBytes(32).toString('hex');
    writeFileSync(tokenPath, authToken + '\n', { mode: 0o600 });
}
logger.info(`Admin token file: ${tokenPath} (or LENSING_ADMIN_TOKEN)`);
const allowedHosts = (process.env.LENSING_ALLOWED_HOSTS ?? '')
    .split(',')
    .map((h) => h.trim())
    .filter(Boolean);
// Auto-detect GPIO on Linux (Raspberry Pi)
let gpioFactory;
const isLinux = platform() === 'linux';
if (isLinux && existsSync('/dev/gpiochip0')) {
    gpioFactory = createGpiomonFactory();
    logger.info('GPIO detected (/dev/gpiochip0) — PIR sensor enabled');
}
const host = createHostService({
    port: 3100,
    bindAddress: '0.0.0.0',
    pluginsDir: resolve(root, 'plugins'),
    dbPath: resolve(dataDir, 'lensing.db'),
    staticDir: resolve(root, 'apps/display/build'),
    gpioFactory,
    displayControl: isLinux,
    authToken,
    allowedHosts,
    logger,
});
await host.ready;
console.log(`Host service listening on http://localhost:${host.port}`);
process.on('SIGINT', async () => {
    await host.close();
    process.exit(0);
});
//# sourceMappingURL=dev-host.js.map