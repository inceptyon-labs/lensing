import { execFile } from 'node:child_process';
const DISPLAY_RE = /^:\d+$/;
/**
 * Subscribes to PIR presence data on the data bus and controls the display
 * via DPMS (xset). Wakes the screen on motion, sleeps it after idle timeout.
 *
 * Requires X11 with DPMS support and `xset` available on PATH.
 */
export function createDisplayControl(options) {
    const { dataBus, display = ':0', logger } = options;
    if (!DISPLAY_RE.test(display)) {
        throw new Error(`Invalid display value: "${display}". Must match /^:\\d+$/ (e.g. ":0")`);
    }
    const env = { ...process.env, DISPLAY: display };
    let screenOn = true;
    function setDisplay(on) {
        if (on === screenOn)
            return;
        screenOn = on;
        const mode = on ? 'on' : 'off';
        execFile('xset', ['dpms', 'force', mode], { env }, (err) => {
            if (err) {
                logger?.error(`Display control failed`, err);
            }
            else {
                logger?.info(`Display ${mode}`);
            }
        });
    }
    // Enable DPMS but disable auto-timeout — only PIR controls the display.
    execFile('xset', ['+dpms', 'dpms', '0', '0', '0', 's', 'off'], { env }, (err) => {
        if (err)
            logger?.error('Failed to configure DPMS', err);
        else
            logger?.info('DPMS configured (auto-timeout disabled, PIR-only control)');
    });
    const unsubscribe = dataBus.onMessage((msg) => {
        if (msg.channel !== 'presence.pir')
            return;
        const data = msg.data;
        logger?.info(`PIR event: detected=${data.detected}`);
        if (data.detected) {
            setDisplay(true);
        }
        else {
            setDisplay(false);
        }
    });
    // Check if PIR already published before we subscribed
    const cached = dataBus.getLatest('presence.pir');
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
//# sourceMappingURL=display-control.js.map