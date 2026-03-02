import { describe, it, expect, vi, afterEach } from 'vitest';
import { render, screen } from '@testing-library/svelte';
import userEvent from '@testing-library/user-event';
import MarketplacePublishPanel from '../lib/MarketplacePublishPanel.svelte';

afterEach(() => {
  vi.useRealTimers();
});

describe('MarketplacePublishPanel', () => {
  it('renders "Publish to Marketplace" button', () => {
    render(MarketplacePublishPanel, {
      props: { githubToken: 'ghp_test123' },
    });
    expect(screen.getByRole('button', { name: /publish to marketplace/i })).toBeInTheDocument();
  });

  it('disables button and shows settings message when no GitHub token', () => {
    render(MarketplacePublishPanel, {
      props: { githubToken: null },
    });
    const btn = screen.getByRole('button', { name: /publish to marketplace/i });
    expect(btn).toBeDisabled();
    expect(screen.getByText(/configure.*github.*token/i)).toBeInTheDocument();
  });

  it('shows validation errors when validation fails', async () => {
    const user = userEvent.setup();
    const onValidate = vi.fn(() => ({
      valid: false,
      errors: [
        { field: 'name', message: 'Name is required' },
        { field: 'html', message: 'Template is empty' },
      ],
    }));
    render(MarketplacePublishPanel, {
      props: { githubToken: 'ghp_test123', onValidate },
    });
    await user.click(screen.getByRole('button', { name: /publish to marketplace/i }));
    expect(onValidate).toHaveBeenCalled();
    expect(screen.getByText('Name is required')).toBeInTheDocument();
    expect(screen.getByText('Template is empty')).toBeInTheDocument();
  });

  it('shows "Packaging..." progress state when publishing starts', async () => {
    vi.useFakeTimers();
    const user = userEvent.setup({ delay: null });
    const onValidate = vi.fn(() => ({ valid: true, errors: [] }));
    const onPublish = vi.fn(() => new Promise<{ url: string }>(() => {})); // never resolves
    render(MarketplacePublishPanel, {
      props: { githubToken: 'ghp_test123', onValidate, onPublish },
    });
    await user.click(screen.getByRole('button', { name: /publish to marketplace/i }));
    expect(screen.getByText(/packaging/i)).toBeInTheDocument();
  });

  it('cycles through progress stages', async () => {
    vi.useFakeTimers();
    const user = userEvent.setup({ delay: null });
    const onValidate = vi.fn(() => ({ valid: true, errors: [] }));
    const onPublish = vi.fn(() => new Promise<{ url: string }>(() => {})); // never resolves
    render(MarketplacePublishPanel, {
      props: { githubToken: 'ghp_test123', onValidate, onPublish },
    });
    await user.click(screen.getByRole('button', { name: /publish to marketplace/i }));
    expect(screen.getByText(/packaging/i)).toBeInTheDocument();
    await vi.advanceTimersByTimeAsync(1500);
    expect(screen.getByText(/uploading/i)).toBeInTheDocument();
    await vi.advanceTimersByTimeAsync(1500);
    expect(screen.getByText(/creating pr/i)).toBeInTheDocument();
  });

  it('shows success state with clickable PR link', async () => {
    const user = userEvent.setup();
    const onValidate = vi.fn(() => ({ valid: true, errors: [] }));
    const onPublish = vi.fn(() => Promise.resolve({ url: 'https://github.com/org/repo/pull/42' }));
    render(MarketplacePublishPanel, {
      props: { githubToken: 'ghp_test123', onValidate, onPublish },
    });
    await user.click(screen.getByRole('button', { name: /publish to marketplace/i }));
    expect(await screen.findByText(/published.*awaiting review/i)).toBeInTheDocument();
    const link = screen.getByRole('link', { name: /pull request/i });
    expect(link).toHaveAttribute('href', 'https://github.com/org/repo/pull/42');
  });

  it('shows error state with retry button', async () => {
    const user = userEvent.setup();
    const onValidate = vi.fn(() => ({ valid: true, errors: [] }));
    const onPublish = vi.fn(() => Promise.reject(new Error('Rate limit exceeded')));
    render(MarketplacePublishPanel, {
      props: { githubToken: 'ghp_test123', onValidate, onPublish },
    });
    await user.click(screen.getByRole('button', { name: /publish to marketplace/i }));
    expect(await screen.findByText(/rate limit exceeded/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /retry/i })).toBeInTheDocument();
  });

  it('retry button restarts publish flow', async () => {
    const user = userEvent.setup();
    const onValidate = vi.fn(() => ({ valid: true, errors: [] }));
    const onPublish = vi
      .fn()
      .mockRejectedValueOnce(new Error('Network error'))
      .mockResolvedValueOnce({ url: 'https://github.com/org/repo/pull/99' });
    render(MarketplacePublishPanel, {
      props: { githubToken: 'ghp_test123', onValidate, onPublish },
    });
    await user.click(screen.getByRole('button', { name: /publish to marketplace/i }));
    expect(await screen.findByText(/network error/i)).toBeInTheDocument();
    await user.click(screen.getByRole('button', { name: /retry/i }));
    expect(await screen.findByText(/published.*awaiting review/i)).toBeInTheDocument();
    expect(onPublish).toHaveBeenCalledTimes(2);
  });
});
