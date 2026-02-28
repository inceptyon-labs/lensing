import { execFileSync } from 'node:child_process';
import fs from 'node:fs';
import type {
  DisplayCapabilities,
  DisplayCapability,
  DisplayHardwareInstance,
  DisplayHardwareOptions,
  RotationValue,
} from '@lensing/types';

const BACKLIGHT_PATH = '/sys/class/backlight/rpi_backlight/brightness';
const BACKLIGHT_MAX_PATH = '/sys/class/backlight/rpi_backlight/max_brightness';

/** Map rotation degrees to xrandr direction names */
const ROTATION_MAP: Record<RotationValue, string> = {
  0: 'normal',
  90: 'left',
  180: 'inverted',
  270: 'right',
};

/** Reverse map: xrandr direction → degrees */
const ROTATION_REVERSE: Record<string, RotationValue> = {
  normal: 0,
  left: 90,
  inverted: 180,
  right: 270,
};

type ExecFn = (cmd: string, args: string[]) => { stdout: string; stderr: string; status: number };
type FsMethods = {
  existsSync(path: string): boolean;
  readFileSync(path: string, encoding: 'utf-8'): string;
  writeFileSync(path: string, data: string): void;
};

function defaultExec(
  cmd: string,
  args: string[]
): { stdout: string; stderr: string; status: number } {
  try {
    const stdout = execFileSync(cmd, args, { timeout: 3000, encoding: 'utf-8' });
    return { stdout, stderr: '', status: 0 };
  } catch (err: unknown) {
    const e = err as { stdout?: string; stderr?: string; status?: number };
    return {
      stdout: String(e.stdout ?? ''),
      stderr: String(e.stderr ?? ''),
      status: e.status ?? 1,
    };
  }
}

const defaultFs: FsMethods = {
  existsSync: (p) => fs.existsSync(p),
  readFileSync: (p, enc) => fs.readFileSync(p, enc),
  writeFileSync: (p, d) => fs.writeFileSync(p, d),
};

function probeBrightness(exec: ExecFn, fsMethods: FsMethods): DisplayCapability {
  // Check rpi_backlight sysfs
  if (fsMethods.existsSync(BACKLIGHT_PATH)) {
    return { available: true, method: 'rpi_backlight' };
  }

  // Check ddcutil
  const which = exec('which', ['ddcutil']);
  if (which.status === 0) {
    const detect = exec('ddcutil', ['detect']);
    if (detect.status === 0 && detect.stdout.includes('Display')) {
      return { available: true, method: 'ddcutil' };
    }
  }

  return { available: false, reason: 'No backlight sysfs or ddcutil display found' };
}

function probeContrast(exec: ExecFn): DisplayCapability {
  const which = exec('which', ['ddcutil']);
  if (which.status === 0) {
    const detect = exec('ddcutil', ['detect']);
    if (detect.status === 0 && detect.stdout.includes('Display')) {
      return { available: true, method: 'ddcutil' };
    }
  }

  return { available: false, reason: 'ddcutil not available or no display detected' };
}

function probeRotation(exec: ExecFn): DisplayCapability & { outputName?: string } {
  const which = exec('which', ['xrandr']);
  if (which.status !== 0) {
    return { available: false, reason: 'xrandr not found' };
  }

  const query = exec('xrandr', ['--query']);
  if (query.status !== 0) {
    return { available: false, reason: 'xrandr --query failed' };
  }

  // Parse primary output name from xrandr output
  // Lines look like: "HDMI-1 connected primary 1920x1080+0+0 (normal left inverted right x axis y axis) 530mm x 300mm"
  const lines = query.stdout.split('\n');
  for (const line of lines) {
    const match = line.match(/^(\S+)\s+connected\s+primary/);
    if (match) {
      return { available: true, method: 'xrandr', outputName: match[1] };
    }
  }

  // No primary, try first connected output
  for (const line of lines) {
    const match = line.match(/^(\S+)\s+connected/);
    if (match) {
      return { available: true, method: 'xrandr', outputName: match[1] };
    }
  }

  return { available: false, reason: 'No connected xrandr output found' };
}

/**
 * Create a display hardware service with capability detection.
 * Probes available hardware at construction time.
 */
export function createDisplayHardware(
  options: DisplayHardwareOptions = {}
): DisplayHardwareInstance {
  const { logger } = options;
  const exec = options.execFn ?? defaultExec;
  const fsMethods = options.fsMethods ?? defaultFs;

  // Probe capabilities once at construction
  const brightnessCap = probeBrightness(exec, fsMethods);
  const contrastCap = probeContrast(exec);
  const rotationProbe = probeRotation(exec);
  const rotationCap: DisplayCapability = {
    available: rotationProbe.available,
    method: rotationProbe.method,
    reason: rotationProbe.reason,
  };
  const xrandrOutput = rotationProbe.outputName;

  const capabilities: DisplayCapabilities = {
    brightness: brightnessCap,
    contrast: contrastCap,
    rotation: rotationCap,
  };

  logger?.info('Display hardware capabilities detected', capabilities);

  // Read the max brightness for rpi_backlight (usually 255)
  let maxBrightness = 255;
  if (brightnessCap.method === 'rpi_backlight') {
    try {
      const raw = fsMethods.readFileSync(BACKLIGHT_MAX_PATH, 'utf-8').trim();
      const parsed = parseInt(raw, 10);
      if (Number.isFinite(parsed) && parsed > 0) maxBrightness = parsed;
    } catch {
      // Fall back to 255
    }
  }

  return {
    get capabilities() {
      return capabilities;
    },

    getBrightness(): number | null {
      if (!brightnessCap.available) return null;

      if (brightnessCap.method === 'rpi_backlight') {
        const raw = fsMethods.readFileSync(BACKLIGHT_PATH, 'utf-8').trim();
        const value = parseInt(raw, 10);
        return Math.round((value / maxBrightness) * 100);
      }

      if (brightnessCap.method === 'ddcutil') {
        const result = exec('ddcutil', ['getvcp', '10', '--brief']);
        if (result.status !== 0) throw new Error(`ddcutil getvcp failed: ${result.stderr}`);
        // Brief output: "VCP 10 C 75 100" (feature code, type, current, max)
        const match = result.stdout.match(/VCP\s+10\s+C\s+(\d+)\s+(\d+)/);
        if (!match) throw new Error(`Unexpected ddcutil output: ${result.stdout}`);
        return parseInt(match[1]!, 10);
      }

      return null;
    },

    setBrightness(value: number): void {
      if (!brightnessCap.available) throw new Error('Brightness control not available');
      if (value < 0 || value > 100) throw new Error('Brightness must be 0–100');

      if (brightnessCap.method === 'rpi_backlight') {
        const raw = Math.round((value / 100) * maxBrightness);
        fsMethods.writeFileSync(BACKLIGHT_PATH, String(raw));
        return;
      }

      if (brightnessCap.method === 'ddcutil') {
        const result = exec('ddcutil', ['setvcp', '10', String(value)]);
        if (result.status !== 0) throw new Error(`ddcutil setvcp failed: ${result.stderr}`);
      }
    },

    getContrast(): number | null {
      if (!contrastCap.available) return null;

      const result = exec('ddcutil', ['getvcp', '12', '--brief']);
      if (result.status !== 0) throw new Error(`ddcutil getvcp failed: ${result.stderr}`);
      const match = result.stdout.match(/VCP\s+12\s+C\s+(\d+)\s+(\d+)/);
      if (!match) throw new Error(`Unexpected ddcutil output: ${result.stdout}`);
      return parseInt(match[1]!, 10);
    },

    setContrast(value: number): void {
      if (!contrastCap.available) throw new Error('Contrast control not available');
      if (value < 0 || value > 100) throw new Error('Contrast must be 0–100');

      const result = exec('ddcutil', ['setvcp', '12', String(value)]);
      if (result.status !== 0) throw new Error(`ddcutil setvcp failed: ${result.stderr}`);
    },

    getRotation(): RotationValue | null {
      if (!rotationCap.available || !xrandrOutput) return null;

      const result = exec('xrandr', ['--query']);
      if (result.status !== 0) throw new Error(`xrandr query failed: ${result.stderr}`);

      // Find the output line and parse rotation
      // xrandr format: "HDMI-1 connected primary 1920x1080+0+0 (normal left inverted right) ..."
      // Rotated:       "HDMI-1 connected primary 1080x1920+0+0 left (normal left inverted right) ..."
      // The current rotation appears between the resolution and the '(' of supported rotations.
      const lines = result.stdout.split('\n');
      for (const line of lines) {
        if (!line.startsWith(xrandrOutput)) continue;
        if (!line.includes('connected')) continue;

        // Extract text between resolution (NNNxNNN+N+N) and opening paren
        const match = line.match(/\d+x\d+\+\d+\+\d+\s+(.*?)\s*\(/);
        if (match) {
          const segment = match[1]!.trim();
          if (segment in ROTATION_REVERSE) return ROTATION_REVERSE[segment]!;
        }
        // No rotation keyword before parens → normal
        return 0;
      }

      return 0;
    },

    setRotation(value: RotationValue, persistent?: boolean): void {
      if (!rotationCap.available || !xrandrOutput) {
        throw new Error('Rotation control not available');
      }

      const validRotations: RotationValue[] = [0, 90, 180, 270];
      if (!validRotations.includes(value)) {
        throw new Error('Rotation must be 0, 90, 180, or 270');
      }

      const direction = ROTATION_MAP[value];
      const result = exec('xrandr', ['--output', xrandrOutput, '--rotate', direction]);
      if (result.status !== 0) throw new Error(`xrandr rotate failed: ${result.stderr}`);

      if (persistent) {
        try {
          const configPath = '/boot/config.txt';
          let config = '';
          try {
            config = fsMethods.readFileSync(configPath, 'utf-8');
          } catch {
            // File may not exist
          }

          // Map degrees to /boot/config.txt display_rotate values
          const rotateMap: Record<RotationValue, string> = {
            0: '0',
            90: '1',
            180: '2',
            270: '3',
          };

          const rotateValue = rotateMap[value];
          if (config.includes('display_rotate=')) {
            config = config.replace(/display_rotate=\d+/, `display_rotate=${rotateValue}`);
          } else {
            config = config.trimEnd() + `\ndisplay_rotate=${rotateValue}\n`;
          }
          fsMethods.writeFileSync(configPath, config);
        } catch (err) {
          const msg = err instanceof Error ? err.message : String(err);
          logger?.error(`Failed to persist rotation to /boot/config.txt: ${msg}`);
          throw new Error(`Rotation applied but failed to persist: ${msg}`);
        }
      }
    },
  };
}
