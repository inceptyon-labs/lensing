import { fileURLToPath } from 'node:url';
import { resolve, dirname } from 'node:path';
import { mkdirSync } from 'node:fs';
import { createHostService } from '@lensing/core';

// Resolve paths relative to monorepo root (../../.. from packages/cli/src/bin/)
const root = resolve(dirname(fileURLToPath(import.meta.url)), '../../../..');
const dataDir = resolve(root, 'data');
mkdirSync(dataDir, { recursive: true });

const host = createHostService({
  port: 3100,
  pluginsDir: resolve(root, 'plugins'),
  dbPath: resolve(dataDir, 'lensing.db'),
});

await host.ready;
console.log(`Host service listening on http://localhost:${host.port}`);

process.on('SIGINT', async () => {
  await host.close();
  process.exit(0);
});
