import { describe, it, expect } from 'vitest';
import { readFileSync } from 'fs';
import { join } from 'path';

describe('AdminTabBar: Settings tab', () => {
  const tabBarPath = join(__dirname, '../src/lib/AdminTabBar.svelte');

  it('should include settings in the tab type union', () => {
    const source = readFileSync(tabBarPath, 'utf-8');
    expect(source).toContain("'settings'");
  });

  it('should render a Settings tab button', () => {
    const source = readFileSync(tabBarPath, 'utf-8');
    expect(source).toMatch(/Settings/);
    expect(source).toContain("activeTab === 'settings'");
  });
});

describe('AdminSettingsPanel: Display controls', () => {
  const panelPath = join(__dirname, '../src/lib/AdminSettingsPanel.svelte');

  it('should fetch display capabilities and settings on mount', () => {
    const source = readFileSync(panelPath, 'utf-8');
    expect(source).toContain('/display/capabilities');
    expect(source).toContain('/display/settings');
  });

  it('should conditionally render brightness slider based on capabilities', () => {
    const source = readFileSync(panelPath, 'utf-8');
    expect(source).toContain('capabilities?.brightness.available');
    expect(source).toMatch(/type="range"/);
  });

  it('should conditionally render contrast slider based on capabilities', () => {
    const source = readFileSync(panelPath, 'utf-8');
    expect(source).toContain('capabilities?.contrast.available');
  });

  it('should conditionally render rotation select based on capabilities', () => {
    const source = readFileSync(panelPath, 'utf-8');
    expect(source).toContain('capabilities?.rotation.available');
    expect(source).toMatch(/<select/);
  });

  it('should show detection method as subtitle', () => {
    const source = readFileSync(panelPath, 'utf-8');
    expect(source).toContain('capabilities.brightness.method');
    expect(source).toContain('capabilities.contrast.method');
    expect(source).toContain('capabilities.rotation.method');
  });

  it('should include PIR plugin card in settings', () => {
    const source = readFileSync(panelPath, 'utf-8');
    expect(source).toContain("plugin_id === 'pir'");
    expect(source).toContain('AdminPluginCard');
  });

  it('should show controls as disabled with unavailable label when not detected', () => {
    const source = readFileSync(panelPath, 'utf-8');
    expect(source).toContain('control-row--disabled');
    expect(source).toContain('unavailable');
  });

  it('should include persist across reboot checkbox for rotation', () => {
    const source = readFileSync(panelPath, 'utf-8');
    expect(source).toContain('persistRotation');
    expect(source).toContain('Persist across reboot');
  });

  it('should PUT to display endpoints on change', () => {
    const source = readFileSync(panelPath, 'utf-8');
    expect(source).toContain('/display/brightness');
    expect(source).toContain('/display/contrast');
    expect(source).toContain('/display/rotation');
  });

  it('should show saved feedback after control change', () => {
    const source = readFileSync(panelPath, 'utf-8');
    expect(source).toContain('savedFeedback');
    expect(source).toContain('Saved');
  });
});

describe('AdminSettingsPanel: Marketplace settings', () => {
  const panelPath = join(__dirname, '../src/lib/AdminSettingsPanel.svelte');

  it('should include Marketplace section heading', () => {
    const source = readFileSync(panelPath, 'utf-8');
    expect(source).toContain('Marketplace');
  });

  it('should include GitHub token input field', () => {
    const source = readFileSync(panelPath, 'utf-8');
    expect(source).toContain('gitHubToken');
    expect(source).toMatch(/type="password"/);
  });

  it('should include marketplace repo URL input field', () => {
    const source = readFileSync(panelPath, 'utf-8');
    expect(source).toContain('marketplaceRepoUrl');
    expect(source).toContain('lensing-marketplace');
  });

  it('should include instructions for token creation', () => {
    const source = readFileSync(panelPath, 'utf-8');
    expect(source).toMatch(/github\.com.*token/i);
    expect(source).toMatch(/public_repo/i);
  });

  it('should fetch marketplace settings on mount', () => {
    const source = readFileSync(panelPath, 'utf-8');
    expect(source).toContain('/api/admin/marketplace');
  });

  it('should POST to marketplace endpoint on save', () => {
    const source = readFileSync(panelPath, 'utf-8');
    expect(source).toContain("method: 'POST'");
    expect(source).toContain('/api/admin/marketplace');
  });

  it('should show save button', () => {
    const source = readFileSync(panelPath, 'utf-8');
    expect(source).toMatch(/Save|submit/i);
  });

  it('should display success/error messages', () => {
    const source = readFileSync(panelPath, 'utf-8');
    expect(source).toMatch(/error|success/i);
  });
});

describe('AdminPluginList: Settings tab integration', () => {
  const listPath = join(__dirname, '../src/lib/AdminPluginList.svelte');

  it('should include settings in tab type', () => {
    const source = readFileSync(listPath, 'utf-8');
    expect(source).toContain("'settings'");
  });

  it('should import and render AdminSettingsPanel', () => {
    const source = readFileSync(listPath, 'utf-8');
    expect(source).toContain('AdminSettingsPanel');
    expect(source).toContain("activeTab === 'settings'");
  });
});
