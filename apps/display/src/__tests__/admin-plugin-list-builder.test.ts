/**
 * Integration tests for the builder toggle in the Plugins tab.
 *
 * AdminPluginList.svelte cannot be directly rendered in vitest due to
 * CSS preprocessing issues with vite 6 + svelte plugin. These tests
 * verify the builder wiring at the AdminBuilderView level, which is the
 * component AdminPluginList delegates to.
 */
import { describe, it, expect, vi, beforeEach, type Mock } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/svelte';
import AdminBuilderView from '../lib/AdminBuilderView.svelte';

const mockFetch = vi.fn() as Mock;
vi.stubGlobal('fetch', mockFetch);

describe('AdminPluginList builder integration', () => {
  beforeEach(() => {
    mockFetch.mockReset();
  });

  it('should render builder view with wizard steps', () => {
    render(AdminBuilderView, { props: { onCancel: vi.fn(), onSaved: vi.fn() } });

    const indicators = screen.getAllByTestId('step-indicator');
    expect(indicators.length).toBeGreaterThanOrEqual(3);
  });

  it('should call onCancel when cancel is triggered (returns to list)', async () => {
    const onCancel = vi.fn();
    render(AdminBuilderView, { props: { onCancel, onSaved: vi.fn() } });

    await fireEvent.click(screen.getByRole('button', { name: /cancel/i }));

    expect(onCancel).toHaveBeenCalled();
  });

  it('should call onSaved after successful save (returns to list + refresh)', async () => {
    const onSaved = vi.fn();
    render(AdminBuilderView, { props: { onCancel: vi.fn(), onSaved } });

    // Fill metadata
    await fireEvent.change(screen.getByLabelText('Plugin Name'), {
      target: { value: 'Test Plugin' },
    });
    await fireEvent.change(screen.getByLabelText('Description'), {
      target: { value: 'A test plugin' },
    });
    await fireEvent.change(screen.getByLabelText('Category'), {
      target: { value: 'utility' },
    });
    await fireEvent.click(screen.getByRole('button', { name: /next/i }));

    // Add HTML
    const htmlArea = screen.getByLabelText('HTML') as HTMLTextAreaElement;
    await fireEvent.input(htmlArea, { target: { value: '<div>test</div>' } });
    await fireEvent.click(screen.getByRole('button', { name: /next/i }));

    // Pick data source
    await fireEvent.click(screen.getByText('Static Data'));
    await fireEvent.click(screen.getByRole('button', { name: /next/i }));

    // Save
    mockFetch.mockResolvedValueOnce({ ok: true, json: async () => ({}) });
    await fireEvent.click(screen.getByRole('button', { name: /finish/i }));

    // Wait for async save
    await vi.waitFor(() => {
      expect(onSaved).toHaveBeenCalled();
    });
  });
});
