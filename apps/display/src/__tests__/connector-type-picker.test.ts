import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/svelte';
import ConnectorTypePicker from '../lib/ConnectorTypePicker.svelte';

describe('ConnectorTypePicker', () => {
  it('should render three connector type options', () => {
    render(ConnectorTypePicker);

    expect(screen.getByText('JSON API')).toBeInTheDocument();
    expect(screen.getByText('RSS Feed')).toBeInTheDocument();
    expect(screen.getByText('Static Data')).toBeInTheDocument();
  });

  it('should render options as buttons with tab role', () => {
    render(ConnectorTypePicker);

    const buttons = screen.getAllByRole('button');
    expect(buttons).toHaveLength(3);
  });

  it('should call onSelect with "json_api" when JSON API is clicked', async () => {
    const onSelect = vi.fn();
    render(ConnectorTypePicker, { props: { onSelect } });

    const option = screen.getByText('JSON API').closest('button')!;
    await fireEvent.click(option);

    expect(onSelect).toHaveBeenCalledWith('json_api');
  });

  it('should call onSelect with "rss_feed" when RSS Feed is clicked', async () => {
    const onSelect = vi.fn();
    render(ConnectorTypePicker, { props: { onSelect } });

    const option = screen.getByText('RSS Feed').closest('button')!;
    await fireEvent.click(option);

    expect(onSelect).toHaveBeenCalledWith('rss_feed');
  });

  it('should call onSelect with "static_data" when Static Data is clicked', async () => {
    const onSelect = vi.fn();
    render(ConnectorTypePicker, { props: { onSelect } });

    const option = screen.getByText('Static Data').closest('button')!;
    await fireEvent.click(option);

    expect(onSelect).toHaveBeenCalledWith('static_data');
  });

  it('should highlight selected option with aria-selected', () => {
    render(ConnectorTypePicker, { props: { selected: 'json_api' } });

    const jsonBtn = screen.getByText('JSON API').closest('button')!;
    const rssBtn = screen.getByText('RSS Feed').closest('button')!;
    const staticBtn = screen.getByText('Static Data').closest('button')!;

    expect(jsonBtn).toHaveAttribute('aria-selected', 'true');
    expect(rssBtn).toHaveAttribute('aria-selected', 'false');
    expect(staticBtn).toHaveAttribute('aria-selected', 'false');
  });

  it('should include description text for each connector type', () => {
    render(ConnectorTypePicker);

    expect(screen.getByText(/fetch data from/i)).toBeInTheDocument();
    expect(screen.getByText(/subscribe to/i)).toBeInTheDocument();
    expect(screen.getByText(/define fixed/i)).toBeInTheDocument();
  });
});
