import { describe, it, expect, vi, beforeEach } from 'vitest';
import { createDisplayControl } from '../display-control';
import * as childProcess from 'node:child_process';
import type { DataBusInstance, PresenceData } from '@lensing/types';

vi.mock('node:child_process');

function createMockDataBus(): DataBusInstance & { emit(channel: string, data: unknown): void } {
  const listeners: Array<(msg: any) => void> = [];

  return {
    onMessage(callback: (msg: any) => void) {
      listeners.push(callback);
      return () => {
        const idx = listeners.indexOf(callback);
        if (idx > -1) listeners.splice(idx, 1);
      };
    },
    getLatest<T>() {
      return undefined as T | undefined;
    },
    emit(channel: string, data: unknown) {
      listeners.forEach((cb) => cb({ channel, data }));
    },
  };
}

describe('createDisplayControl', () => {
  let mockDataBus: ReturnType<typeof createMockDataBus>;

  beforeEach(() => {
    mockDataBus = createMockDataBus();
    vi.clearAllMocks();

    // execFile must return a mock ChildProcess; call callback immediately
    vi.mocked(childProcess.execFile).mockImplementation(
      (_cmd: any, _args: any, _opts: any, callback?: any) => {
        if (typeof callback === 'function') callback(null);
        return {} as any;
      }
    );
  });

  describe('display parameter validation', () => {
    it('should accept valid display values like :0, :1, :99', () => {
      for (const display of [':0', ':1', ':99', ':999']) {
        vi.clearAllMocks();
        vi.mocked(childProcess.execFile).mockImplementation((_cmd: any, _args: any, _opts: any, cb?: any) => {
          if (typeof cb === 'function') cb(null);
          return {} as any;
        });

        const control = createDisplayControl({ dataBus: mockDataBus, display });
        expect(childProcess.execFile).toHaveBeenCalled();
        control.close();
      }
    });

    it('should reject display values with invalid format', () => {
      const invalidDisplays = [
        'display:0', // no leading colon
        ':', // no number
        ':-1', // negative
        ':0.5', // float
        ':0x0', // hex
        '../:0', // path traversal
        ':0; rm -rf /', // shell injection attempt
      ];

      for (const display of invalidDisplays) {
        expect(() => {
          createDisplayControl({ dataBus: mockDataBus, display });
        }).toThrow();
      }
    });

    it('should use default display :0 if not provided', () => {
      const control = createDisplayControl({ dataBus: mockDataBus });
      expect(childProcess.execFile).toHaveBeenCalled();
      control.close();
    });
  });

  describe('execFile usage (not exec)', () => {
    it('should use execFile with env DISPLAY set, not shell string interpolation', () => {
      const control = createDisplayControl({ dataBus: mockDataBus, display: ':1' });

      // First call is for DPMS config
      const firstCall = vi.mocked(childProcess.execFile).mock.calls[0];
      expect(firstCall[0]).toBe('xset');
      expect(Array.isArray(firstCall[1])).toBe(true);
      // Options should include env with DISPLAY
      const opts = firstCall[2] as any;
      expect(opts).toHaveProperty('env');
      expect(opts.env).toHaveProperty('DISPLAY', ':1');

      control.close();
    });

    it('should call execFile for dpms force on when motion detected after being off', () => {
      const control = createDisplayControl({ dataBus: mockDataBus, display: ':0' });
      // Turn screen off first
      mockDataBus.emit('presence.pir', { detected: false } as PresenceData);
      vi.clearAllMocks();
      vi.mocked(childProcess.execFile).mockImplementation((_cmd: any, _args: any, _opts: any, cb?: any) => {
        if (typeof cb === 'function') cb(null);
        return {} as any;
      });

      // Now motion detected — screen should turn on
      mockDataBus.emit('presence.pir', { detected: true } as PresenceData);

      expect(childProcess.execFile).toHaveBeenCalledWith(
        'xset',
        expect.arrayContaining(['force', 'on']),
        expect.objectContaining({ env: expect.objectContaining({ DISPLAY: ':0' }) }),
        expect.any(Function)
      );

      control.close();
    });
  });

  describe('PIR event handling', () => {
    it('should turn display on when motion detected after being off', () => {
      const control = createDisplayControl({ dataBus: mockDataBus, display: ':0' });
      // Start off
      mockDataBus.emit('presence.pir', { detected: false } as PresenceData);
      vi.clearAllMocks();
      vi.mocked(childProcess.execFile).mockImplementation((_cmd: any, _args: any, _opts: any, cb?: any) => {
        if (typeof cb === 'function') cb(null);
        return {} as any;
      });

      mockDataBus.emit('presence.pir', { detected: true } as PresenceData);

      expect(childProcess.execFile).toHaveBeenCalledWith(
        'xset',
        expect.arrayContaining(['force', 'on']),
        expect.any(Object),
        expect.any(Function)
      );

      control.close();
    });

    it('should turn display off when no motion', () => {
      // Start with screen already on (default)
      const control = createDisplayControl({ dataBus: mockDataBus, display: ':0' });
      // Trigger on first, so off can be toggled
      mockDataBus.emit('presence.pir', { detected: true } as PresenceData);
      vi.clearAllMocks();
      vi.mocked(childProcess.execFile).mockImplementation((_cmd: any, _args: any, _opts: any, cb?: any) => {
        if (typeof cb === 'function') cb(null);
        return {} as any;
      });

      mockDataBus.emit('presence.pir', { detected: false } as PresenceData);

      expect(childProcess.execFile).toHaveBeenCalledWith(
        'xset',
        expect.arrayContaining(['force', 'off']),
        expect.any(Object),
        expect.any(Function)
      );

      control.close();
    });
  });
});
