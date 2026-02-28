/** Detection method for a display capability */
export type DisplayMethod = 'rpi_backlight' | 'ddcutil' | 'xrandr';

/** Whether a specific display capability is available */
export interface DisplayCapability {
  available: boolean;
  method?: DisplayMethod;
  /** Reason the capability is unavailable (for diagnostics) */
  reason?: string;
}

/** Detected display capabilities */
export interface DisplayCapabilities {
  brightness: DisplayCapability;
  contrast: DisplayCapability;
  rotation: DisplayCapability;
}

/** Current display settings values */
export interface DisplaySettings {
  /** Brightness percentage (0–100), undefined if unavailable */
  brightness?: number;
  /** Contrast percentage (0–100), undefined if unavailable */
  contrast?: number;
  /** Rotation in degrees (0, 90, 180, 270), undefined if unavailable */
  rotation?: 0 | 90 | 180 | 270;
}

/** Valid rotation values */
export type RotationValue = 0 | 90 | 180 | 270;

/** Options for the display hardware factory */
export interface DisplayHardwareOptions {
  /** Logger for diagnostics */
  logger?: {
    info(msg: string, data?: unknown): void;
    error(msg: string, error?: unknown): void;
  };
  /** Injectable exec function for testing */
  execFn?: (cmd: string, args: string[]) => { stdout: string; stderr: string; status: number };
  /** Injectable filesystem methods for testing */
  fsMethods?: {
    existsSync(path: string): boolean;
    readFileSync(path: string, encoding: 'utf-8'): string;
    writeFileSync(path: string, data: string): void;
  };
}

/** Instance returned by createDisplayHardware */
export interface DisplayHardwareInstance {
  /** Detected display capabilities (probed at construction) */
  readonly capabilities: DisplayCapabilities;

  /** Get current brightness (0–100), null if unavailable */
  getBrightness(): number | null;
  /** Set brightness (0–100) */
  setBrightness(value: number): void;

  /** Get current contrast (0–100), null if unavailable */
  getContrast(): number | null;
  /** Set contrast (0–100) */
  setContrast(value: number): void;

  /** Get current rotation (0/90/180/270), null if unavailable */
  getRotation(): RotationValue | null;
  /** Set rotation; optionally persist to /boot/config.txt */
  setRotation(value: RotationValue, persistent?: boolean): void;
}
