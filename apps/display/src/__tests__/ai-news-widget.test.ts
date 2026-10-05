import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render } from '@testing-library/svelte';
import { flushSync } from 'svelte';
import type { AiNewsSummary } from '@lensing/types';
import AiNewsWidget from '../lib/AiNewsWidget.svelte';

function summaries(n: number, prefix = 's'): AiNewsSummary[] {
  return Array.from({ length: n }, (_, i) => ({
    id: `${prefix}${i}`,
    title: `Story ${prefix}${i}`,
    summary: 'x',
    link: '',
    published: Date.now(),
    source: 'src',
    category: 'cat',
  }));
}

function pager(container: HTMLElement) {
  return container.querySelector('.ai-news__pager-info')?.textContent?.trim();
}

describe('AiNewsWidget', () => {
  beforeEach(() => vi.useFakeTimers());
  afterEach(() => vi.useRealTimers());

  it('keeps its page when the same stories are delivered again', async () => {
    const data = summaries(10);
    const { container, rerender } = render(AiNewsWidget, { summaries: data, rotateSeconds: 30 });
    vi.advanceTimersByTime(30_000);
    flushSync();
    expect(pager(container)).toBe('2 / 2');

    await rerender({ summaries: [...data] });
    expect(pager(container)).toBe('2 / 2');
  });

  it('returns to page 1 when new stories arrive', async () => {
    const { container, rerender } = render(AiNewsWidget, {
      summaries: summaries(10),
      rotateSeconds: 30,
    });
    vi.advanceTimersByTime(30_000);
    flushSync();

    await rerender({ summaries: summaries(10, 'n') });
    expect(pager(container)).toBe('1 / 2');
  });

  it('gives a manually selected page a full rotation interval', () => {
    const { container } = render(AiNewsWidget, { summaries: summaries(15), rotateSeconds: 30 });
    vi.advanceTimersByTime(29_000);
    (container.querySelector('[aria-label="Next page"]') as HTMLButtonElement).click();
    flushSync();
    expect(pager(container)).toBe('2 / 3');

    vi.advanceTimersByTime(29_000);
    flushSync();
    expect(pager(container)).toBe('2 / 3');
    vi.advanceTimersByTime(1_000);
    flushSync();
    expect(pager(container)).toBe('3 / 3');
  });

  it('stops rotating after unmount', () => {
    const { unmount } = render(AiNewsWidget, { summaries: summaries(10), rotateSeconds: 30 });
    unmount();
    expect(vi.getTimerCount()).toBe(0);
  });
});
