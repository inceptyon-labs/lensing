import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, fireEvent } from '@testing-library/svelte';
import AdminPluginSecrets from '../lib/AdminPluginSecrets.svelte';
import type { PluginAdminEntry } from '@lensing/types';

function stubPlugin(overrides: Partial<PluginAdminEntry> = {}): PluginAdminEntry {
  return {
    plugin_id: 'test-plugin',
    manifest: {
      id: 'test-plugin',
      name: 'Test Plugin',
      version: '1.0.0',
      permissions: { secrets: ['API_KEY', 'TOKEN'] },
    },
    status: 'active',
    enabled: true,
    config: {},
    ...overrides,
  };
}

describe('AdminPluginSecrets', () => {
  let onSave: ReturnType<typeof vi.fn>;
  let onClose: ReturnType<typeof vi.fn>;

  beforeEach(() => {
    onSave = vi.fn();
    onClose = vi.fn();
  });

  it('renders declared secrets from plugin manifest', () => {
    const { getByText } = render(AdminPluginSecrets, {
      props: {
        plugin: stubPlugin(),
        secretNames: ['API_KEY', 'TOKEN'],
        onSave,
        onClose,
      },
    });

    expect(getByText('API_KEY')).toBeTruthy();
    expect(getByText('TOKEN')).toBeTruthy();
  });

  it('shows input for setting secret value', () => {
    const { container } = render(AdminPluginSecrets, {
      props: {
        plugin: stubPlugin(),
        secretNames: ['API_KEY'],
        onSave,
        onClose,
      },
    });

    const inputs = container.querySelectorAll('input[type="password"]');
    expect(inputs.length).toBeGreaterThan(0);
  });

  it('calls onSave with secret values when Save button clicked', async () => {
    const { container, getByRole } = render(AdminPluginSecrets, {
      props: {
        plugin: stubPlugin(),
        secretNames: ['API_KEY', 'TOKEN'],
        onSave,
        onClose,
      },
    });

    const inputs = container.querySelectorAll('input[type="password"]');
    await fireEvent.change(inputs[0], { target: { value: 'my-api-key' } });
    await fireEvent.change(inputs[1], { target: { value: 'my-token' } });

    const saveBtn = getByRole('button', { name: /save/i });
    await fireEvent.click(saveBtn);

    expect(onSave).toHaveBeenCalledWith({
      API_KEY: 'my-api-key',
      TOKEN: 'my-token',
    });
  });

  it('calls onClose after successful save', async () => {
    vi.useFakeTimers();

    const { container, getByRole } = render(AdminPluginSecrets, {
      props: {
        plugin: stubPlugin(),
        secretNames: ['API_KEY'],
        onSave,
        onClose,
      },
    });

    const input = container.querySelector('input[type="password"]')!;
    await fireEvent.change(input, { target: { value: 'key' } });

    const saveBtn = getByRole('button', { name: /save/i });
    await fireEvent.click(saveBtn);

    vi.advanceTimersByTime(1200);

    expect(onClose).toHaveBeenCalled();

    vi.useRealTimers();
  });

  it('renders Cancel button that calls onClose', async () => {
    const { getByRole } = render(AdminPluginSecrets, {
      props: {
        plugin: stubPlugin(),
        secretNames: ['API_KEY'],
        onSave,
        onClose,
      },
    });

    const cancelBtn = getByRole('button', { name: /cancel/i });
    await fireEvent.click(cancelBtn);

    expect(onClose).toHaveBeenCalled();
  });

  it('shows no secrets message when secretNames is empty', () => {
    const { getByText } = render(AdminPluginSecrets, {
      props: {
        plugin: stubPlugin(),
        secretNames: [],
        onSave,
        onClose,
      },
    });

    expect(getByText(/no secrets/i)).toBeTruthy();
  });
});
