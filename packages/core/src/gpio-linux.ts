import { spawn } from 'node:child_process';
import type { GpioWatcher, GpioWatcherFactory } from '@lensing/types';

/**
 * Create a GpioWatcherFactory backed by `gpiomon` from libgpiod-tools.
 * Works on modern Raspberry Pi OS (Bookworm/Trixie) using the character
 * device API — no sysfs or native Node.js dependencies required.
 *
 * Requires: `sudo apt install gpiod`
 */
export function createGpiomonFactory(chip = 'gpiochip0'): GpioWatcherFactory {
  return (pin: number): GpioWatcher => {
    let proc: ReturnType<typeof spawn> | null = null;
    let currentValue: 0 | 1 = 0;

    return {
      watch(callback: (value: 0 | 1) => void): void {
        // gpiomon v2 (libgpiod 2.x on Trixie):
        //   gpiomon -e both <chip> <pin>
        // Output: "TIMESTAMP  RISING|FALLING  <chip> <pin>"
        //
        // gpiomon v1 (libgpiod 1.x on Bookworm):
        //   gpiomon <chip> <pin>
        // Output: "event: RISING EDGE offset: <pin> ..."
        //
        // We match case-insensitively on "rising" / "falling" to cover both.
        proc = spawn('gpiomon', [chip, String(pin)], {
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

        proc.on('error', () => {
          // gpiomon not found — will be caught by PIR server as startup error
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
