import { describe, it, expect } from 'vitest';
import fs from 'fs';
import path from 'path';

const DEPLOY_DIR = path.resolve(__dirname, '..');

function readUnit(filename: string): string {
  return fs.readFileSync(path.join(DEPLOY_DIR, filename), 'utf-8');
}

function parseUnit(content: string): Record<string, Record<string, string>> {
  const sections: Record<string, Record<string, string>> = {};
  let currentSection = '';
  for (const line of content.split('\n')) {
    const trimmed = line.trim();
    if (trimmed.startsWith('[') && trimmed.endsWith(']')) {
      currentSection = trimmed.slice(1, -1);
      sections[currentSection] = {};
    } else if (trimmed.includes('=') && currentSection) {
      const eqIndex = trimmed.indexOf('=');
      const key = trimmed.slice(0, eqIndex).trim();
      const value = trimmed.slice(eqIndex + 1).trim();
      sections[currentSection][key] = value;
    }
  }
  return sections;
}

describe('lensing-host.service', () => {
  let content: string;
  let unit: Record<string, Record<string, string>>;

  it('should exist as a file', () => {
    content = readUnit('lensing-host.service');
    expect(content).toBeTruthy();
    unit = parseUnit(content);
  });

  it('should have [Unit] section with description', () => {
    unit = parseUnit(readUnit('lensing-host.service'));
    expect(unit['Unit']).toBeDefined();
    expect(unit['Unit']['Description']).toBeTruthy();
  });

  it('should start after network is available', () => {
    unit = parseUnit(readUnit('lensing-host.service'));
    expect(unit['Unit']['After']).toContain('network.target');
  });

  it('should have [Service] section with ExecStart', () => {
    unit = parseUnit(readUnit('lensing-host.service'));
    expect(unit['Service']).toBeDefined();
    expect(unit['Service']['ExecStart']).toBeTruthy();
  });

  it('should use node to start the host', () => {
    unit = parseUnit(readUnit('lensing-host.service'));
    expect(unit['Service']['ExecStart']).toMatch(/node/i);
  });

  it('should restart on failure', () => {
    unit = parseUnit(readUnit('lensing-host.service'));
    expect(unit['Service']['Restart']).toBe('on-failure');
  });

  it('should have restart delay', () => {
    unit = parseUnit(readUnit('lensing-host.service'));
    expect(unit['Service']['RestartSec']).toBeTruthy();
  });

  it('should have [Install] section for auto-start', () => {
    unit = parseUnit(readUnit('lensing-host.service'));
    expect(unit['Install']).toBeDefined();
    expect(unit['Install']['WantedBy']).toBe('multi-user.target');
  });
});

describe('lensing-kiosk.service', () => {
  let unit: Record<string, Record<string, string>>;

  it('should exist as a file', () => {
    const content = readUnit('lensing-kiosk.service');
    expect(content).toBeTruthy();
    unit = parseUnit(content);
  });

  it('should have [Unit] section with description', () => {
    unit = parseUnit(readUnit('lensing-kiosk.service'));
    expect(unit['Unit']).toBeDefined();
    expect(unit['Unit']['Description']).toBeTruthy();
  });

  it('should depend on lensing-host.service', () => {
    unit = parseUnit(readUnit('lensing-kiosk.service'));
    expect(unit['Unit']['After']).toContain('lensing-host.service');
    expect(unit['Unit']['Requires']).toContain('lensing-host.service');
  });

  it('should start Chromium in kiosk mode', () => {
    unit = parseUnit(readUnit('lensing-kiosk.service'));
    expect(unit['Service']['ExecStart']).toContain('--kiosk');
  });

  it('should disable GPU', () => {
    unit = parseUnit(readUnit('lensing-kiosk.service'));
    expect(unit['Service']['ExecStart']).toContain('--disable-gpu');
  });

  it('should set memory-pressure-off', () => {
    unit = parseUnit(readUnit('lensing-kiosk.service'));
    expect(unit['Service']['ExecStart']).toContain('--memory-pressure-off');
  });

  it('should suppress error dialogs', () => {
    unit = parseUnit(readUnit('lensing-kiosk.service'));
    expect(unit['Service']['ExecStart']).toContain('--noerrdialogs');
  });

  it('should restart on failure', () => {
    unit = parseUnit(readUnit('lensing-kiosk.service'));
    expect(unit['Service']['Restart']).toBe('on-failure');
  });

  it('should have [Install] section for auto-start', () => {
    unit = parseUnit(readUnit('lensing-kiosk.service'));
    expect(unit['Install']).toBeDefined();
    expect(unit['Install']['WantedBy']).toMatch(/graphical\.target|multi-user\.target/);
  });
});

describe('install.sh', () => {
  let content: string;

  it('should exist as a file', () => {
    content = fs.readFileSync(path.join(DEPLOY_DIR, 'install.sh'), 'utf-8');
    expect(content).toBeTruthy();
  });

  it('should have a shebang line', () => {
    content = fs.readFileSync(path.join(DEPLOY_DIR, 'install.sh'), 'utf-8');
    expect(content.startsWith('#!/')).toBe(true);
  });

  it('should check for root/sudo access', () => {
    content = fs.readFileSync(path.join(DEPLOY_DIR, 'install.sh'), 'utf-8');
    expect(content).toContain('EUID');
  });

  it('should copy service files to systemd directory', () => {
    content = fs.readFileSync(path.join(DEPLOY_DIR, 'install.sh'), 'utf-8');
    expect(content).toContain('/etc/systemd/system/');
    expect(content).toContain('lensing-host.service');
    expect(content).toContain('lensing-kiosk.service');
  });

  it('should reload systemd daemon', () => {
    content = fs.readFileSync(path.join(DEPLOY_DIR, 'install.sh'), 'utf-8');
    expect(content).toContain('daemon-reload');
  });

  it('should enable services for auto-start', () => {
    content = fs.readFileSync(path.join(DEPLOY_DIR, 'install.sh'), 'utf-8');
    expect(content).toContain('enable');
    expect(content).toContain('lensing-host');
    expect(content).toContain('lensing-kiosk');
  });

  it('should be executable', () => {
    const stats = fs.statSync(path.join(DEPLOY_DIR, 'install.sh'));
    const isExecutable = (stats.mode & 0o111) !== 0;
    expect(isExecutable).toBe(true);
  });
});
