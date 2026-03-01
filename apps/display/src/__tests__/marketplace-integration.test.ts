import { describe, it, expect } from 'vitest';
import { readFileSync } from 'fs';
import { join } from 'path';

describe('AdminPluginList: Marketplace browser integration', () => {
  const listPath = join(__dirname, '../lib/AdminPluginList.svelte');

  it('imports MarketplacePluginBrowser component', () => {
    const source = readFileSync(listPath, 'utf-8');
    expect(source).toContain('MarketplacePluginBrowser');
  });

  it('renders MarketplacePluginBrowser when marketplace tab is active', () => {
    const source = readFileSync(listPath, 'utf-8');
    expect(source).toContain("activeTab === 'marketplace'");
    expect(source).toContain('<MarketplacePluginBrowser');
  });

  it('does not show placeholder text after integration', () => {
    const source = readFileSync(listPath, 'utf-8');
    expect(source).not.toContain('Marketplace coming soon');
  });
});
