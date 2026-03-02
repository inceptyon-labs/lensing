import { describe, it, expect, vi, afterEach } from 'vitest';
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

const mockPluginsWithUpdate: MarketplacePlugin[] = [
  ...mockPlugins,
  {
    id: 'plugin-3',
    name: 'Plugin Three',
    version: '2.0.0',
    author: 'Author Three',
    description: 'Third plugin with update',
    category: 'Weather',
    tags: ['weather'],
    downloadUrl: 'https://example.com/plugin3.zip',
    installed: true,
    updateAvailable: true,
    installedVersion: '1.0.0',
  },
];

afterEach(() => {
  vi.useRealTimers();
});

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

  describe('Search functionality', () => {
    it('should render search input', () => {
      render(MarketplacePluginBrowser, {
        props: { plugins: mockPlugins, loading: false },
      });
      expect(screen.getByPlaceholderText(/search/i)).toBeInTheDocument();
    });

    it('should filter plugins by name', async () => {
      vi.useFakeTimers();
      const user = userEvent.setup({ delay: null });
      render(MarketplacePluginBrowser, {
        props: { plugins: mockPlugins, loading: false },
      });
      const searchInput = screen.getByPlaceholderText(/search/i) as HTMLInputElement;
      await user.type(searchInput, 'Plugin One');
      await vi.advanceTimersByTimeAsync(300);
      expect(screen.getByText('Plugin One')).toBeInTheDocument();
      expect(screen.queryByText('Plugin Two')).not.toBeInTheDocument();
    });

    it('should filter plugins by description', async () => {
      vi.useFakeTimers();
      const user = userEvent.setup({ delay: null });
      render(MarketplacePluginBrowser, {
        props: { plugins: mockPlugins, loading: false },
      });
      const searchInput = screen.getByPlaceholderText(/search/i) as HTMLInputElement;
      await user.type(searchInput, 'First plugin');
      await vi.advanceTimersByTimeAsync(300);
      expect(screen.getByText('Plugin One')).toBeInTheDocument();
      expect(screen.queryByText('Plugin Two')).not.toBeInTheDocument();
    });

    it('should filter plugins by tags', async () => {
      vi.useFakeTimers();
      const user = userEvent.setup({ delay: null });
      render(MarketplacePluginBrowser, {
        props: { plugins: mockPlugins, loading: false },
      });
      const searchInput = screen.getByPlaceholderText(/search/i) as HTMLInputElement;
      await user.type(searchInput, 'news');
      await vi.advanceTimersByTimeAsync(300);
      expect(screen.getByText('Plugin Two')).toBeInTheDocument();
      expect(screen.queryByText('Plugin One')).not.toBeInTheDocument();
    });

    it('should debounce search with 300ms delay', async () => {
      vi.useFakeTimers();
      const user = userEvent.setup({ delay: null });
      render(MarketplacePluginBrowser, {
        props: { plugins: mockPlugins, loading: false },
      });
      const searchInput = screen.getByPlaceholderText(/search/i) as HTMLInputElement;
      await user.type(searchInput, 'Plugin One');
      expect(screen.getByText('Plugin One')).toBeInTheDocument();
      expect(screen.getByText('Plugin Two')).toBeInTheDocument();
      await vi.advanceTimersByTimeAsync(300);
      expect(screen.getByText('Plugin One')).toBeInTheDocument();
      expect(screen.queryByText('Plugin Two')).not.toBeInTheDocument();
    });
  });

  describe('Category filter functionality', () => {
    it('should render category filter', () => {
      render(MarketplacePluginBrowser, {
        props: { plugins: mockPlugins, loading: false },
      });
      expect(screen.getByRole('button', { name: /category|all/i })).toBeInTheDocument();
    });

    it('should filter plugins by category', async () => {
      const user = userEvent.setup();
      render(MarketplacePluginBrowser, {
        props: { plugins: mockPlugins, loading: false },
      });
      const categoryButtons = screen.getAllByRole('button');
      const weatherButton = categoryButtons.find((btn) => btn.textContent?.includes('Weather'));
      if (weatherButton) {
        await user.click(weatherButton);
        expect(screen.getByText('Plugin One')).toBeInTheDocument();
        expect(screen.queryByText('Plugin Two')).not.toBeInTheDocument();
      }
    });

    it('should show "All" category option', () => {
      render(MarketplacePluginBrowser, {
        props: { plugins: mockPlugins, loading: false },
      });
      const categoryButtons = screen.getAllByRole('button');
      const allButton = categoryButtons.find((btn) => btn.textContent?.includes('All'));
      expect(allButton).toBeInTheDocument();
    });
  });

  describe('Active filters and result count', () => {
    it('should show active filter chips', async () => {
      const user = userEvent.setup();
      render(MarketplacePluginBrowser, {
        props: { plugins: mockPlugins, loading: false },
      });
      const searchInput = screen.getByPlaceholderText(/search/i) as HTMLInputElement;
      await user.type(searchInput, 'Plugin One');
      expect(screen.getByRole('button', { name: /clear|×/i })).toBeInTheDocument();
    });

    it('should remove filter when chip is clicked', async () => {
      const user = userEvent.setup();
      render(MarketplacePluginBrowser, {
        props: { plugins: mockPlugins, loading: false },
      });
      const searchInput = screen.getByPlaceholderText(/search/i) as HTMLInputElement;
      await user.type(searchInput, 'Plugin One');
      const clearButton = screen.getByRole('button', { name: /clear|×/i });
      await user.click(clearButton);
      expect(screen.getByText('Plugin One')).toBeInTheDocument();
      expect(screen.getByText('Plugin Two')).toBeInTheDocument();
    });

    it('should display result count', () => {
      render(MarketplacePluginBrowser, {
        props: { plugins: mockPlugins, loading: false },
      });
      expect(screen.getByText(/2 plugins/i)).toBeInTheDocument();
    });

    it('should update result count when filtering', async () => {
      vi.useFakeTimers();
      const user = userEvent.setup({ delay: null });
      render(MarketplacePluginBrowser, {
        props: { plugins: mockPlugins, loading: false },
      });
      const searchInput = screen.getByPlaceholderText(/search/i) as HTMLInputElement;
      await user.type(searchInput, 'Plugin One');
      await vi.advanceTimersByTimeAsync(300);
      expect(screen.getByText(/1 plugin/i)).toBeInTheDocument();
    });
  });

  describe('Update badge', () => {
    it('should show update badge on cards with updateAvailable', () => {
      render(MarketplacePluginBrowser, {
        props: { plugins: mockPluginsWithUpdate, loading: false },
      });
      const badges = screen.getAllByText('Update');
      expect(badges.length).toBe(1);
    });

    it('should not show update badge on cards without updateAvailable', () => {
      render(MarketplacePluginBrowser, {
        props: { plugins: mockPlugins, loading: false },
      });
      expect(screen.queryByText('Update')).not.toBeInTheDocument();
    });
  });
});
