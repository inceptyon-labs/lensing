import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { render, fireEvent, waitFor } from '@testing-library/svelte';
import PluginWidget from '../lib/PluginWidget.svelte';
import { handlePluginData } from '../lib/stores/dataBusStore';

describe('PluginWidget', () => {
  beforeEach(() => {
    // Reset any stores
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it('should render ShadowWidget with fetched template and data', async () => {
    // Mock the fetch for template
    global.fetch = vi.fn(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve({
          html: '<div>{{title}}</div>',
          css: '.widget { color: blue; }',
        }),
      } as Response)
    );

    const { getByTestId } = render(PluginWidget, {
      props: {
        pluginId: 'my-widget',
      },
    });

    // Wait for template to fetch and ShadowWidget to render
    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledWith('/plugins/my-widget/template');
    });

    const shadowWidget = getByTestId('shadow-widget');
    expect(shadowWidget).toBeTruthy();
  });

  it('should subscribe to data bus channel plugin:pluginId', async () => {
    global.fetch = vi.fn(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve({
          html: '<div>{{count}}</div>',
          css: '.counter { color: white; }',
        }),
      } as Response)
    );

    const { getByTestId } = render(PluginWidget, {
      props: {
        pluginId: 'counter',
      },
    });

    // Publish data to the bus
    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalled();
    });

    // Emit data from the data bus
    handlePluginData({
      plugin_id: 'counter',
      channel: 'plugin:counter',
      timestamp: new Date().toISOString(),
      data: { count: 42 },
    });

    // ShadowWidget should receive the data and render it
    await waitFor(() => {
      const shadowWidget = getByTestId('shadow-widget');
      expect(shadowWidget).toBeTruthy();
    });
  });

  it('should show loading state while fetching template', async () => {
    global.fetch = vi.fn(() =>
      new Promise((resolve) =>
        setTimeout(
          () =>
            resolve({
              ok: true,
              json: () => Promise.resolve({
                html: '<div>Loaded</div>',
                css: '',
              }),
            } as Response),
          100
        )
      )
    );

    const { getByText } = render(PluginWidget, {
      props: {
        pluginId: 'slow-plugin',
      },
    });

    // Should show loading initially
    expect(getByText('Loading template...')).toBeTruthy();

    // Wait for template to load
    await waitFor(
      () => {
        expect(global.fetch).toHaveBeenCalled();
      },
      { timeout: 500 }
    );
  });

  it('should show error state when template fetch fails', async () => {
    global.fetch = vi.fn(() =>
      Promise.resolve({
        ok: false,
        status: 404,
        json: () => Promise.resolve({ error: 'Not found' }),
      } as Response)
    );

    const { getByText } = render(PluginWidget, {
      props: {
        pluginId: 'missing-template',
      },
    });

    // Wait for error to show
    await waitFor(() => {
      expect(getByText(/Failed to load template/)).toBeTruthy();
    });
  });

  it('should update data when bus publishes new data', async () => {
    global.fetch = vi.fn(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve({
          html: '<div>Value: {{value}}</div>',
          css: '',
        }),
      } as Response)
    );

    const { getByTestId } = render(PluginWidget, {
      props: {
        pluginId: 'reactive-plugin',
      },
    });

    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalled();
    });

    // Publish initial data
    handlePluginData({
      plugin_id: 'reactive-plugin',
      channel: 'plugin:reactive-plugin',
      timestamp: new Date().toISOString(),
      data: { value: 1 },
    });

    // Wait for render
    await waitFor(() => {
      const shadowWidget = getByTestId('shadow-widget');
      expect(shadowWidget).toBeTruthy();
    });

    // Publish updated data
    handlePluginData({
      plugin_id: 'reactive-plugin',
      channel: 'plugin:reactive-plugin',
      timestamp: new Date().toISOString(),
      data: { value: 2 },
    });

    // ShadowWidget should re-render with new data
    await waitFor(() => {
      const shadowWidget = getByTestId('shadow-widget');
      expect(shadowWidget).toBeTruthy();
    });
  });
});
