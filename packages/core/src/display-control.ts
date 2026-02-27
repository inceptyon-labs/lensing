import { exec } from 'node:child_process';
import type { DataBusInstance, PresenceData, HostServiceLogger } from '@lensing/types';

export interface DisplayControlOptions {
  dataBus: DataBusInstance;
  display?: string;
  logger?: HostServiceLogger;
}

/**
 * Subscribes to PIR presence data on the data bus and controls the display
 * via DPMS (xset). Wakes the screen on motion, sleeps it after idle timeout.
 *
 * Requires X11 with DPMS support and `xset` available on PATH.
 */
export function createDisplayControl(options: DisplayControlOptions): { close(): void } {
  const { dataBus, display = ':0', logger } = options;
  let screenOn = true;

  function setDisplay(on: boolean): void {
    if (on === screenOn) return;
    screenOn = on;

    const mode = on ? 'on' : 'off';
    const cmd = `DISPLAY=${display} xset dpms force ${mode}`;

    exec(cmd, (err) => {
      if (err) {
        logger?.error(`Display control failed: ${cmd}`, err);
      } else {
        logger?.info(`Display ${mode}`);
      }
    });
  }

  // Enable DPMS so xset force on/off works
  exec(`DISPLAY=${display} xset +dpms`, (err) => {
    if (err) logger?.error('Failed to enable DPMS', err);
  });

  const unsubscribe = dataBus.onMessage((msg) => {
    if (msg.channel !== 'presence.pir') return;

    const data = msg.data as PresenceData;
    if (data.detected) {
      setDisplay(true);
    } else {
      setDisplay(false);
    }
  });

  // Check if PIR already published before we subscribed
  const cached = dataBus.getLatest<PresenceData>('presence.pir');
  if (cached && !cached.data.detected) {
    setDisplay(false);
  }

  return {
    close() {
      unsubscribe();
      // Ensure display is on when shutting down
      if (!screenOn) {
        setDisplay(true);
      }
    },
  };
}
