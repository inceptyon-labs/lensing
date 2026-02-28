import { describe, it, expect, vi } from 'vitest';
import { createDisplayHardware } from '../display-hardware';
import type { RotationValue } from '@lensing/types';

// Helpers for injecting fake exec + fs
function makeExec(responses: Record<string, { stdout: string; stderr: string; status: number }>) {
  return (cmd: string, args: string[]) => {
    const key = `${cmd} ${args.join(' ')}`;
    // Check for exact match first, then prefix match
    if (responses[key]) return responses[key];
    for (const [pattern, resp] of Object.entries(responses)) {
      if (key.startsWith(pattern) || key.includes(pattern.split(' ')[0]!)) return resp;
    }
    return { stdout: '', stderr: 'not found', status: 1 };
  };
}

function makeFs(files: Record<string, string> = {}) {
  const store = { ...files };
  return {
    existsSync: (path: string) => path in store,
    readFileSync: (path: string, _enc: 'utf-8') => {
      if (!(path in store)) throw new Error(`ENOENT: ${path}`);
      return store[path]!;
    },
    writeFileSync: (path: string, data: string) => {
      store[path] = data;
    },
    _store: store,
  };
}

describe('createDisplayHardware', () => {
  describe('capability detection', () => {
    it('detects rpi_backlight when sysfs exists', () => {
      const hw = createDisplayHardware({
        execFn: makeExec({}),
        fsMethods: makeFs({
          '/sys/class/backlight/rpi_backlight/brightness': '128',
          '/sys/class/backlight/rpi_backlight/max_brightness': '255',
        }),
      });

      expect(hw.capabilities.brightness).toEqual({
        available: true,
        method: 'rpi_backlight',
      });
    });

    it('detects ddcutil brightness when sysfs absent but ddcutil works', () => {
      const hw = createDisplayHardware({
        execFn: makeExec({
          'which ddcutil': { stdout: '/usr/bin/ddcutil', stderr: '', status: 0 },
          'ddcutil detect': { stdout: 'Display 1\n  Model: Test Monitor', stderr: '', status: 0 },
        }),
        fsMethods: makeFs(),
      });

      expect(hw.capabilities.brightness).toEqual({
        available: true,
        method: 'ddcutil',
      });
    });

    it('reports brightness unavailable when nothing found', () => {
      const hw = createDisplayHardware({
        execFn: makeExec({}),
        fsMethods: makeFs(),
      });

      expect(hw.capabilities.brightness.available).toBe(false);
      expect(hw.capabilities.brightness.reason).toBeDefined();
    });

    it('detects xrandr rotation with primary output', () => {
      const hw = createDisplayHardware({
        execFn: makeExec({
          'which xrandr': { stdout: '/usr/bin/xrandr', stderr: '', status: 0 },
          'xrandr --query': {
            stdout:
              'Screen 0: minimum 320 x 200\n' +
              'HDMI-1 connected primary 1920x1080+0+0 (normal left inverted right) 530mm x 300mm\n',
            stderr: '',
            status: 0,
          },
          'which ddcutil': { stdout: '', stderr: '', status: 1 },
        }),
        fsMethods: makeFs(),
      });

      expect(hw.capabilities.rotation).toEqual({
        available: true,
        method: 'xrandr',
      });
    });

    it('detects xrandr rotation with non-primary connected output', () => {
      const hw = createDisplayHardware({
        execFn: makeExec({
          'which xrandr': { stdout: '/usr/bin/xrandr', stderr: '', status: 0 },
          'xrandr --query': {
            stdout:
              'Screen 0: minimum 320 x 200\n' +
              'DSI-1 connected 800x480+0+0 (normal left inverted right)\n',
            stderr: '',
            status: 0,
          },
          'which ddcutil': { stdout: '', stderr: '', status: 1 },
        }),
        fsMethods: makeFs(),
      });

      expect(hw.capabilities.rotation.available).toBe(true);
    });

    it('reports rotation unavailable when xrandr missing', () => {
      const hw = createDisplayHardware({
        execFn: makeExec({}),
        fsMethods: makeFs(),
      });

      expect(hw.capabilities.rotation.available).toBe(false);
    });

    it('detects ddcutil contrast', () => {
      const hw = createDisplayHardware({
        execFn: makeExec({
          'which ddcutil': { stdout: '/usr/bin/ddcutil', stderr: '', status: 0 },
          'ddcutil detect': { stdout: 'Display 1\n  Model: Test', stderr: '', status: 0 },
          'which xrandr': { stdout: '', stderr: '', status: 1 },
        }),
        fsMethods: makeFs(),
      });

      expect(hw.capabilities.contrast).toEqual({
        available: true,
        method: 'ddcutil',
      });
    });

    it('reports contrast unavailable when ddcutil missing', () => {
      const hw = createDisplayHardware({
        execFn: makeExec({}),
        fsMethods: makeFs(),
      });

      expect(hw.capabilities.contrast.available).toBe(false);
    });

    it('logs detected capabilities', () => {
      const logger = { info: vi.fn(), error: vi.fn() };
      createDisplayHardware({
        logger,
        execFn: makeExec({}),
        fsMethods: makeFs(),
      });

      expect(logger.info).toHaveBeenCalledWith(
        'Display hardware capabilities detected',
        expect.objectContaining({
          brightness: expect.objectContaining({ available: false }),
          contrast: expect.objectContaining({ available: false }),
          rotation: expect.objectContaining({ available: false }),
        })
      );
    });
  });

  describe('brightness via rpi_backlight', () => {
    function makeRpiHw(brightness = '128', max = '255') {
      const fsMethods = makeFs({
        '/sys/class/backlight/rpi_backlight/brightness': brightness,
        '/sys/class/backlight/rpi_backlight/max_brightness': max,
      });
      const hw = createDisplayHardware({
        execFn: makeExec({
          'which ddcutil': { stdout: '', stderr: '', status: 1 },
          'which xrandr': { stdout: '', stderr: '', status: 1 },
        }),
        fsMethods,
      });
      return { hw, fsMethods };
    }

    it('reads brightness as percentage', () => {
      const { hw } = makeRpiHw('128', '255');
      expect(hw.getBrightness()).toBe(50);
    });

    it('reads 0 brightness', () => {
      const { hw } = makeRpiHw('0', '255');
      expect(hw.getBrightness()).toBe(0);
    });

    it('reads max brightness', () => {
      const { hw } = makeRpiHw('255', '255');
      expect(hw.getBrightness()).toBe(100);
    });

    it('sets brightness — scales 0–100 to 0–255', () => {
      const { hw, fsMethods } = makeRpiHw('128', '255');
      hw.setBrightness(50);
      expect(fsMethods._store['/sys/class/backlight/rpi_backlight/brightness']).toBe('128');

      hw.setBrightness(100);
      expect(fsMethods._store['/sys/class/backlight/rpi_backlight/brightness']).toBe('255');

      hw.setBrightness(0);
      expect(fsMethods._store['/sys/class/backlight/rpi_backlight/brightness']).toBe('0');
    });

    it('rejects out-of-range brightness', () => {
      const { hw } = makeRpiHw();
      expect(() => hw.setBrightness(-1)).toThrow('Brightness must be 0–100');
      expect(() => hw.setBrightness(101)).toThrow('Brightness must be 0–100');
    });
  });

  describe('brightness via ddcutil', () => {
    function makeDdcHw() {
      const execFn = vi.fn().mockImplementation((cmd: string, args: string[]) => {
        const key = `${cmd} ${args.join(' ')}`;
        if (key === 'which ddcutil') return { stdout: '/usr/bin/ddcutil', stderr: '', status: 0 };
        if (key === 'ddcutil detect')
          return { stdout: 'Display 1\n  Model: Test', stderr: '', status: 0 };
        if (key === 'ddcutil getvcp 10 --brief')
          return { stdout: 'VCP 10 C 75 100\n', stderr: '', status: 0 };
        if (key.startsWith('ddcutil setvcp 10')) return { stdout: '', stderr: '', status: 0 };
        if (key === 'which xrandr') return { stdout: '', stderr: '', status: 1 };
        return { stdout: '', stderr: 'not found', status: 1 };
      });
      const hw = createDisplayHardware({ execFn, fsMethods: makeFs() });
      return { hw, execFn };
    }

    it('reads brightness from ddcutil getvcp', () => {
      const { hw } = makeDdcHw();
      expect(hw.getBrightness()).toBe(75);
    });

    it('sets brightness via ddcutil setvcp', () => {
      const { hw, execFn } = makeDdcHw();
      hw.setBrightness(60);
      expect(execFn).toHaveBeenCalledWith('ddcutil', ['setvcp', '10', '60']);
    });
  });

  describe('contrast via ddcutil', () => {
    function makeContrastHw() {
      const execFn = vi.fn().mockImplementation((cmd: string, args: string[]) => {
        const key = `${cmd} ${args.join(' ')}`;
        if (key === 'which ddcutil') return { stdout: '/usr/bin/ddcutil', stderr: '', status: 0 };
        if (key === 'ddcutil detect')
          return { stdout: 'Display 1\n  Model: Test', stderr: '', status: 0 };
        if (key === 'ddcutil getvcp 12 --brief')
          return { stdout: 'VCP 12 C 50 100\n', stderr: '', status: 0 };
        if (key.startsWith('ddcutil setvcp 12')) return { stdout: '', stderr: '', status: 0 };
        if (key === 'which xrandr') return { stdout: '', stderr: '', status: 1 };
        return { stdout: '', stderr: 'not found', status: 1 };
      });
      const hw = createDisplayHardware({ execFn, fsMethods: makeFs() });
      return { hw, execFn };
    }

    it('reads contrast from ddcutil getvcp', () => {
      const { hw } = makeContrastHw();
      expect(hw.getContrast()).toBe(50);
    });

    it('sets contrast via ddcutil setvcp', () => {
      const { hw, execFn } = makeContrastHw();
      hw.setContrast(80);
      expect(execFn).toHaveBeenCalledWith('ddcutil', ['setvcp', '12', '80']);
    });

    it('rejects out-of-range contrast', () => {
      const { hw } = makeContrastHw();
      expect(() => hw.setContrast(-1)).toThrow('Contrast must be 0–100');
      expect(() => hw.setContrast(101)).toThrow('Contrast must be 0–100');
    });
  });

  describe('rotation via xrandr', () => {
    function makeRotationHw(currentRotation = 'normal') {
      const rotationLine =
        currentRotation === 'normal'
          ? 'HDMI-1 connected primary 1920x1080+0+0 (normal left inverted right) 530mm x 300mm'
          : `HDMI-1 connected primary 1080x1920+0+0 ${currentRotation} (normal left inverted right) 530mm x 300mm`;

      const execFn = vi.fn().mockImplementation((cmd: string, args: string[]) => {
        const key = `${cmd} ${args.join(' ')}`;
        if (key === 'which xrandr') return { stdout: '/usr/bin/xrandr', stderr: '', status: 0 };
        if (key === 'xrandr --query')
          return {
            stdout: `Screen 0: minimum 320 x 200\n${rotationLine}\n`,
            stderr: '',
            status: 0,
          };
        if (key.startsWith('xrandr --output')) return { stdout: '', stderr: '', status: 0 };
        if (key === 'which ddcutil') return { stdout: '', stderr: '', status: 1 };
        return { stdout: '', stderr: 'not found', status: 1 };
      });
      const fsMethods = makeFs();
      const hw = createDisplayHardware({ execFn, fsMethods });
      return { hw, execFn, fsMethods };
    }

    it('reads normal rotation', () => {
      const { hw } = makeRotationHw('normal');
      expect(hw.getRotation()).toBe(0);
    });

    it('reads left rotation as 90', () => {
      const { hw } = makeRotationHw('left');
      expect(hw.getRotation()).toBe(90);
    });

    it('reads inverted rotation as 180', () => {
      const { hw } = makeRotationHw('inverted');
      expect(hw.getRotation()).toBe(180);
    });

    it('reads right rotation as 270', () => {
      const { hw } = makeRotationHw('right');
      expect(hw.getRotation()).toBe(270);
    });

    it('sets rotation via xrandr --output --rotate', () => {
      const { hw, execFn } = makeRotationHw();
      hw.setRotation(90);
      expect(execFn).toHaveBeenCalledWith('xrandr', ['--output', 'HDMI-1', '--rotate', 'left']);
    });

    it('rejects invalid rotation value', () => {
      const { hw } = makeRotationHw();
      expect(() => hw.setRotation(45 as RotationValue)).toThrow(
        'Rotation must be 0, 90, 180, or 270'
      );
    });
  });

  describe('persistent rotation', () => {
    it('writes display_rotate to /boot/config.txt', () => {
      const fsMethods = makeFs({
        '/boot/config.txt': '[all]\ndtoverlay=vc4-fkms-v3d\n',
      });
      const execFn = vi.fn().mockImplementation((cmd: string, args: string[]) => {
        const key = `${cmd} ${args.join(' ')}`;
        if (key === 'which xrandr') return { stdout: '/usr/bin/xrandr', stderr: '', status: 0 };
        if (key === 'xrandr --query')
          return {
            stdout: 'HDMI-1 connected primary 1920x1080+0+0 (normal left inverted right)\n',
            stderr: '',
            status: 0,
          };
        if (key.startsWith('xrandr --output')) return { stdout: '', stderr: '', status: 0 };
        if (key === 'which ddcutil') return { stdout: '', stderr: '', status: 1 };
        return { stdout: '', stderr: 'not found', status: 1 };
      });
      const hw = createDisplayHardware({ execFn, fsMethods });
      hw.setRotation(90, true);

      const config = fsMethods._store['/boot/config.txt']!;
      expect(config).toContain('display_rotate=1');
    });

    it('replaces existing display_rotate in /boot/config.txt', () => {
      const fsMethods = makeFs({
        '/boot/config.txt': '[all]\ndisplay_rotate=0\ndtoverlay=vc4\n',
      });
      const execFn = vi.fn().mockImplementation((cmd: string, args: string[]) => {
        const key = `${cmd} ${args.join(' ')}`;
        if (key === 'which xrandr') return { stdout: '/usr/bin/xrandr', stderr: '', status: 0 };
        if (key === 'xrandr --query')
          return {
            stdout: 'HDMI-1 connected primary 1920x1080+0+0 (normal left inverted right)\n',
            stderr: '',
            status: 0,
          };
        if (key.startsWith('xrandr --output')) return { stdout: '', stderr: '', status: 0 };
        if (key === 'which ddcutil') return { stdout: '', stderr: '', status: 1 };
        return { stdout: '', stderr: 'not found', status: 1 };
      });
      const hw = createDisplayHardware({ execFn, fsMethods });
      hw.setRotation(180, true);

      const config = fsMethods._store['/boot/config.txt']!;
      expect(config).toContain('display_rotate=2');
      expect(config.match(/display_rotate/g)?.length).toBe(1);
    });

    it('surfaces error when /boot/config.txt write fails', () => {
      const fsMethods = makeFs();
      // Make writeFileSync throw for /boot/config.txt
      fsMethods.writeFileSync = (path: string) => {
        if (path === '/boot/config.txt') throw new Error('Permission denied');
      };
      const execFn = vi.fn().mockImplementation((cmd: string, args: string[]) => {
        const key = `${cmd} ${args.join(' ')}`;
        if (key === 'which xrandr') return { stdout: '/usr/bin/xrandr', stderr: '', status: 0 };
        if (key === 'xrandr --query')
          return {
            stdout: 'HDMI-1 connected primary 1920x1080+0+0 (normal left inverted right)\n',
            stderr: '',
            status: 0,
          };
        if (key.startsWith('xrandr --output')) return { stdout: '', stderr: '', status: 0 };
        if (key === 'which ddcutil') return { stdout: '', stderr: '', status: 1 };
        return { stdout: '', stderr: 'not found', status: 1 };
      });
      const hw = createDisplayHardware({ execFn, fsMethods });

      expect(() => hw.setRotation(90, true)).toThrow('failed to persist');
    });
  });

  describe('error handling', () => {
    it('getBrightness returns null when unavailable', () => {
      const hw = createDisplayHardware({
        execFn: makeExec({}),
        fsMethods: makeFs(),
      });
      expect(hw.getBrightness()).toBeNull();
    });

    it('getContrast returns null when unavailable', () => {
      const hw = createDisplayHardware({
        execFn: makeExec({}),
        fsMethods: makeFs(),
      });
      expect(hw.getContrast()).toBeNull();
    });

    it('getRotation returns null when unavailable', () => {
      const hw = createDisplayHardware({
        execFn: makeExec({}),
        fsMethods: makeFs(),
      });
      expect(hw.getRotation()).toBeNull();
    });

    it('setBrightness throws when unavailable', () => {
      const hw = createDisplayHardware({
        execFn: makeExec({}),
        fsMethods: makeFs(),
      });
      expect(() => hw.setBrightness(50)).toThrow('Brightness control not available');
    });

    it('setContrast throws when unavailable', () => {
      const hw = createDisplayHardware({
        execFn: makeExec({}),
        fsMethods: makeFs(),
      });
      expect(() => hw.setContrast(50)).toThrow('Contrast control not available');
    });

    it('setRotation throws when unavailable', () => {
      const hw = createDisplayHardware({
        execFn: makeExec({}),
        fsMethods: makeFs(),
      });
      expect(() => hw.setRotation(90)).toThrow('Rotation control not available');
    });

    it('throws descriptive error when ddcutil getvcp fails', () => {
      const execFn = vi.fn().mockImplementation((cmd: string, args: string[]) => {
        const key = `${cmd} ${args.join(' ')}`;
        if (key === 'which ddcutil') return { stdout: '/usr/bin/ddcutil', stderr: '', status: 0 };
        if (key === 'ddcutil detect')
          return { stdout: 'Display 1\n  Model: Test', stderr: '', status: 0 };
        if (key.startsWith('ddcutil getvcp'))
          return { stdout: '', stderr: 'Display not found', status: 1 };
        if (key === 'which xrandr') return { stdout: '', stderr: '', status: 1 };
        return { stdout: '', stderr: 'not found', status: 1 };
      });
      const hw = createDisplayHardware({ execFn, fsMethods: makeFs() });
      expect(() => hw.getBrightness()).toThrow('ddcutil getvcp failed');
    });
  });
});
