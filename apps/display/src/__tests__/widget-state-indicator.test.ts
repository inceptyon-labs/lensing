import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/svelte';
import WidgetStateIndicator from '../lib/WidgetStateIndicator.svelte';

describe('WidgetStateIndicator', () => {
  it('renders shimmer overlay for loading state', () => {
    const { container } = render(WidgetStateIndicator, {
      props: { state: 'loading' },
    });
    const shimmer = container.querySelector('.widget-indicator__shimmer');
    expect(shimmer).toBeInTheDocument();
  });

  it('renders clock icon for stale state', () => {
    const { container } = render(WidgetStateIndicator, {
      props: { state: 'stale' },
    });
    const staleIcon = container.querySelector('.widget-indicator__stale-icon');
    expect(staleIcon).toBeInTheDocument();
    expect(staleIcon?.textContent).toBe('🕐');
  });

  it('renders "Waiting for data..." message for waiting state', () => {
    render(WidgetStateIndicator, {
      props: { state: 'waiting' },
    });
    expect(screen.getByText(/waiting for data/i)).toBeInTheDocument();
  });

  it('renders nothing for ready state', () => {
    const { container } = render(WidgetStateIndicator, {
      props: { state: 'ready' },
    });
    const indicator = container.querySelector('.widget-indicator');
    expect(indicator?.children.length).toBe(0);
  });

  it('applies loading shimmer animation styles', () => {
    const { container } = render(WidgetStateIndicator, {
      props: { state: 'loading' },
    });
    const shimmer = container.querySelector('.widget-indicator__shimmer');
    const styles = window.getComputedStyle(shimmer!);
    expect(styles.animation).toContain('shimmer');
  });

  it('applies dark theme color tokens to stale icon', () => {
    const { container } = render(WidgetStateIndicator, {
      props: { state: 'stale' },
    });
    const staleIcon = container.querySelector('.widget-indicator__stale-icon');
    const styles = window.getComputedStyle(staleIcon!);
    expect(styles.color).toBeTruthy();
    expect(parseFloat(styles.opacity)).toBeLessThan(1);
  });

  it('respects width and height props for responsive sizing', () => {
    const { container } = render(WidgetStateIndicator, {
      props: { state: 'loading', width: 256, height: 320 },
    });
    const indicator = container.querySelector('.widget-indicator');
    expect(indicator).toHaveStyle({ width: '256px', height: '320px' });
  });

  it('applies smooth transition timing on state changes', () => {
    const { container } = render(WidgetStateIndicator, {
      props: { state: 'loading' },
    });
    const indicator = container.querySelector('.widget-indicator');
    const styles = window.getComputedStyle(indicator!);
    expect(styles.transition).toContain('ms');
  });
});
