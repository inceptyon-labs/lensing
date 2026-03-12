import type { GpioWatcherFactory } from '@lensing/types';
/**
 * Create a GpioWatcherFactory backed by `gpiomon` from libgpiod-tools.
 * Works on Raspberry Pi OS Bookworm (v1) and Trixie (v2) using the
 * character device API — no sysfs or native Node.js dependencies.
 *
 * Requires: `sudo apt install gpiod`
 */
export declare function createGpiomonFactory(chip?: string): GpioWatcherFactory;
//# sourceMappingURL=gpio-linux.d.ts.map