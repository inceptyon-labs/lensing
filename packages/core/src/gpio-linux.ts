import { spawn, execSync } from 'node:child_process';
import type { GpioWatcher, GpioWatcherFactory } from '@lensing/types';

/**
 * Detect whether the installed gpiomon is v2 (libgpiod 2.x).
 * v2 uses `-c <chip> <offset>` syntax; v1 uses `<chip> <offset>`.
 */
function isGpiomonV2(): boolean {
  try {
    const out = execSync('gpiomon --version 2>&1', { encoding: 'utf-8' });
    // v2 prints "gpiomon (libgpiod) v2.x.x", v1 prints "gpiomon (libgpiod) v1.x.x"
    return /v?2\./.test(out);
  } catch {
    return false; // can't determine — assume v1
  }
}

/**
 * Create a GpioWatcherFactory backed by `gpiomon` from libgpiod-tools.
 * Works on Raspberry Pi OS Bookworm (v1) and Trixie (v2) using the
 * character device API — no sysfs or native Node.js dependencies.
 *
 * Requires: `sudo apt install gpiod`
 */
export function createGpiomonFactory(chip = 'gpiochip0'): GpioWatcherFactory {
  const v2 = isGpiomonV2();

  return (pin: number): GpioWatcher => {
    let proc: ReturnType<typeof spawn> | null = null;
    let currentValue: 0 | 1 = 0;

    return {
      watch(callback: (value: 0 | 1) => void): void {
        // v2 (Trixie):  gpiomon -c gpiochip0 17
        // v1 (Bookworm): gpiomon --falling-edge --rising-edge gpiochip0 17
        const args = v2
          ? ['-c', chip, String(pin)]
          : ['--falling-edge', '--rising-edge', chip, String(pin)];

        proc = spawn('gpiomon', args, {
          stdio: ['ignore', 'pipe', 'pipe'],
        });

        let buffer = '';
        proc.stdout?.on('data', (data: Buffer) => {
          buffer += data.toString();
          const lines = buffer.split('\n');
          buffer = lines.pop() ?? '';

          for (const line of lines) {
            const lower = line.toLowerCase();
            if (lower.includes('rising')) {
              currentValue = 1;
              callback(1);
            } else if (lower.includes('falling')) {
              currentValue = 0;
              callback(0);
            }
          }
        });

        proc.stderr?.on('data', (data: Buffer) => {
          const msg = data.toString().trim();
          if (msg) console.error(`[gpiomon] ${msg}`);
        });

        proc.on('exit', (code) => {
          if (code !== null && code !== 0) {
            console.error(`[gpiomon] exited with code ${code}`);
          }
        });

        proc.on('error', (err) => {
          console.error(`[gpiomon] spawn error: ${err.message}`);
        });
      },

      async read(): Promise<0 | 1> {
        return currentValue;
      },

      close(): void {
        if (proc) {
          proc.kill();
          proc = null;
        }
      },
    };
  };
}
