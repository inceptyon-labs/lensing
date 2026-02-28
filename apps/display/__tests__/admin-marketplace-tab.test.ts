import { describe, it, expect } from 'vitest';
import { readFileSync } from 'fs';
import { join } from 'path';

describe('AdminTabBar: Marketplace tab', () => {
  const tabBarPath = join(__dirname, '../src/lib/AdminTabBar.svelte');

  it('should include marketplace in the tab type union', () => {
    const source = readFileSync(tabBarPath, 'utf-8');
    expect(source).toContain("'marketplace'");
  });

  it('should render a Marketplace tab button', () => {
    const source = readFileSync(tabBarPath, 'utf-8');
    expect(source).toMatch(/Marketplace/);
    expect(source).toContain("activeTab === 'marketplace'");
  });

  it('should place Marketplace tab after Plugins and before Settings', () => {
    const source = readFileSync(tabBarPath, 'utf-8');
    const pluginsIdx = source.indexOf('Plugins');
    const marketplaceIdx = source.indexOf('Marketplace');
    const settingsIdx = source.lastIndexOf('Settings');
    expect(pluginsIdx).toBeGreaterThan(-1);
    expect(marketplaceIdx).toBeGreaterThan(pluginsIdx);
    expect(settingsIdx).toBeGreaterThan(marketplaceIdx);
  });

  it('should accept a marketplaceCount prop for badge', () => {
    const source = readFileSync(tabBarPath, 'utf-8');
    expect(source).toContain('marketplaceCount');
  });

  it('should render a badge with plugin count', () => {
    const source = readFileSync(tabBarPath, 'utf-8');
    expect(source).toContain('badge');
    expect(source).toContain('marketplaceCount');
  });
});

describe('AdminPluginList: Marketplace tab integration', () => {
  const listPath = join(__dirname, '../src/lib/AdminPluginList.svelte');

  it('should include marketplace in tab type', () => {
    const source = readFileSync(listPath, 'utf-8');
    expect(source).toContain("'marketplace'");
  });

  it('should render marketplace content when tab is active', () => {
    const source = readFileSync(listPath, 'utf-8');
    expect(source).toContain("activeTab === 'marketplace'");
  });

  it('should pass marketplaceCount prop to AdminTabBar', () => {
    const source = readFileSync(listPath, 'utf-8');
    expect(source).toContain('marketplaceCount');
  });
});
