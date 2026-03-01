import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/svelte';
import userEvent from '@testing-library/user-event';
import MarketplacePluginDetailView from '../lib/MarketplacePluginDetailView.svelte';
import type { MarketplacePlugin } from '@lensing/types';

const mockPlugin: MarketplacePlugin = {
  id: 'test-plugin',
  name: 'Test Plugin',
  version: '1.0.0',
  author: 'Test Author',
  description: 'A test marketplace plugin',
  thumbnail: 'https://example.com/thumb.png',
  category: 'Weather',
  connectorType: 'json-api',
  tags: [],
  downloadUrl: 'https://example.com/plugin.zip',
  installed: false,
  updateAvailable: false,
};

describe('MarketplacePluginDetailView', () => {
  it('displays plugin name', () => {
    render(MarketplacePluginDetailView, {
      props: { plugin: mockPlugin, onBack: () => {} },
    });
    expect(screen.getByText('Test Plugin')).toBeInTheDocument();
  });

  it('displays plugin description', () => {
    render(MarketplacePluginDetailView, {
      props: { plugin: mockPlugin, onBack: () => {} },
    });
    expect(screen.getByText('A test marketplace plugin')).toBeInTheDocument();
  });

  it('displays author name', () => {
    render(MarketplacePluginDetailView, {
      props: { plugin: mockPlugin, onBack: () => {} },
    });
    expect(screen.getByText('Test Author')).toBeInTheDocument();
  });

  it('displays version', () => {
    render(MarketplacePluginDetailView, {
      props: { plugin: mockPlugin, onBack: () => {} },
    });
    expect(screen.getByText('1.0.0')).toBeInTheDocument();
  });

  it('displays category badge', () => {
    render(MarketplacePluginDetailView, {
      props: { plugin: mockPlugin, onBack: () => {} },
    });
    expect(screen.getByText('Weather')).toBeInTheDocument();
  });

  it('displays connector type indicator', () => {
    render(MarketplacePluginDetailView, {
      props: { plugin: mockPlugin, onBack: () => {} },
    });
    expect(screen.getByText('JSON API')).toBeInTheDocument();
  });

  it('displays thumbnail image', () => {
    render(MarketplacePluginDetailView, {
      props: { plugin: mockPlugin, onBack: () => {} },
    });
    const img = screen.getByRole('img');
    expect(img).toHaveAttribute('src', 'https://example.com/thumb.png');
  });

  it('shows Install button when not installed', () => {
    render(MarketplacePluginDetailView, {
      props: { plugin: mockPlugin, onBack: () => {} },
    });
    expect(screen.getByRole('button', { name: /install/i })).toBeInTheDocument();
  });

  it('shows Installed badge when already installed', () => {
    const installedPlugin = { ...mockPlugin, installed: true };
    render(MarketplacePluginDetailView, {
      props: { plugin: installedPlugin, onBack: () => {} },
    });
    expect(screen.getByText('Installed')).toBeInTheDocument();
  });

  it('shows Update button when update available', () => {
    const updateAvailablePlugin = { ...mockPlugin, installed: true, updateAvailable: true };
    render(MarketplacePluginDetailView, {
      props: { plugin: updateAvailablePlugin, onBack: () => {} },
    });
    expect(screen.getByRole('button', { name: /update/i })).toBeInTheDocument();
  });

  it('calls onBack when back button clicked', async () => {
    const user = userEvent.setup();
    const onBackMock = vi.fn();
    render(MarketplacePluginDetailView, {
      props: { plugin: mockPlugin, onBack: onBackMock },
    });
    const backBtn = screen.getByRole('button', { name: /back/i });
    await user.click(backBtn);
    expect(onBackMock).toHaveBeenCalled();
  });

  it('renders detail view with proper styling classes', () => {
    const { container } = render(MarketplacePluginDetailView, {
      props: { plugin: mockPlugin, onBack: () => {} },
    });
    expect(container.querySelector('.detail-view')).toBeInTheDocument();
  });
});
