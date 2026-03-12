import type { DataBusInstance, HostServiceLogger } from '@lensing/types';
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
export declare function createDisplayControl(options: DisplayControlOptions): {
    close(): void;
};
//# sourceMappingURL=display-control.d.ts.map