import { fileURLToPath } from 'node:url';
import { resolve, dirname } from 'node:path';
import { mkdirSync, existsSync } from 'node:fs';
import { platform } from 'node:os';
import { createHostService, createGpiomonFactory } from '@lensing/core';
import type { GpioWatcherFactory, HostServiceLogger } from '@lensing/types';

// Resolve paths relative to monorepo root (../../.. from packages/cli/src/bin/)
const root = resolve(dirname(fileURLToPath(import.meta.url)), '../../../..');
const dataDir = resolve(root, 'data');
mkdirSync(dataDir, { recursive: true });

const logger: HostServiceLogger = {
  debug: (msg, data) => console.log(`[debug] ${msg}`, data ?? ''),
  info: (msg, data) => console.log(`[info]  ${msg}`, data ?? ''),
  error: (msg, err) => console.error(`[error] ${msg}`, err ?? ''),
};

// Auto-detect GPIO on Linux (Raspberry Pi)
let gpioFactory: GpioWatcherFactory | undefined;
const isLinux = platform() === 'linux';
if (isLinux && existsSync('/dev/gpiochip0')) {
  gpioFactory = createGpiomonFactory();
  logger.info('GPIO detected (/dev/gpiochip0) — PIR sensor enabled');
}

const host = createHostService({
  port: 3100,
  pluginsDir: resolve(root, 'plugins'),
  dbPath: resolve(dataDir, 'lensing.db'),
  staticDir: resolve(root, 'apps/display/build'),
  gpioFactory,
  displayControl: isLinux,
  logger,
});

await host.ready;
console.log(`Host service listening on http://localhost:${host.port}`);

process.on('SIGINT', async () => {
  await host.close();
  process.exit(0);
});
