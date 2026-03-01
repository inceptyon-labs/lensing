import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/svelte';
import userEvent from '@testing-library/user-event';
import MarketplacePluginBrowser from '../lib/MarketplacePluginBrowser.svelte';
import type { MarketplacePlugin } from '@lensing/types';

const mockPlugins: MarketplacePlugin[] = [
  {
    id: 'plugin-1',
    name: 'Plugin One',
    version: '1.0.0',
    author: 'Author One',
    description: 'First plugin description',
    category: 'Weather',
    tags: ['weather'],
    downloadUrl: 'https://example.com/plugin1.zip',
    installed: false,
    updateAvailable: false,
  },
  {
    id: 'plugin-2',
    name: 'Plugin Two',
    version: '2.0.0',
    author: 'Author Two',
    description: 'Second plugin description',
    category: 'News',
    tags: ['news'],
    downloadUrl: 'https://example.com/plugin2.zip',
    installed: true,
    updateAvailable: false,
  },
];

describe('MarketplacePluginBrowser', () => {
  it('shows loading state when fetching', () => {
    render(MarketplacePluginBrowser, {
      props: { plugins: null, loading: true },
    });
    expect(screen.getByText(/loading/i)).toBeInTheDocument();
  });

  it('shows plugin cards when loaded', () => {
    render(MarketplacePluginBrowser, {
      props: { plugins: mockPlugins, loading: false },
    });
    expect(screen.getByText('Plugin One')).toBeInTheDocument();
    expect(screen.getByText('Plugin Two')).toBeInTheDocument();
  });

  it('shows empty state when no plugins', () => {
    render(MarketplacePluginBrowser, {
      props: { plugins: [], loading: false },
    });
    expect(screen.getByText(/no plugins found/i)).toBeInTheDocument();
  });

  it('opens detail view when card clicked', async () => {
    const user = userEvent.setup();
    render(MarketplacePluginBrowser, {
      props: { plugins: mockPlugins, loading: false },
    });
    await user.click(screen.getByText('Plugin One'));
    expect(screen.getByText('First plugin description')).toBeInTheDocument();
  });

  it('returns to grid when back button clicked in detail view', async () => {
    const user = userEvent.setup();
    render(MarketplacePluginBrowser, {
      props: { plugins: mockPlugins, loading: false },
    });
    await user.click(screen.getByText('Plugin One'));
    await user.click(screen.getByRole('button', { name: /back/i }));
    expect(screen.getByText('Plugin One')).toBeInTheDocument();
    expect(screen.getByText('Plugin Two')).toBeInTheDocument();
  });

  it('renders browser container with proper class', () => {
    const { container } = render(MarketplacePluginBrowser, {
      props: { plugins: mockPlugins, loading: false },
    });
    expect(container.querySelector('.marketplace-browser')).toBeInTheDocument();
  });
});
