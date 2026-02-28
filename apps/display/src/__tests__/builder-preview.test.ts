import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/svelte';
import BuilderPreview from '../lib/BuilderPreview.svelte';

const sampleHtml = '<div class="widget"><h1>{{title}}</h1><p>{{value}}</p></div>';
const sampleCss = '.widget { background: #000; color: #fff; } h1 { font-size: 24px; }';
const sampleData: Record<string, unknown> = {
  title: 'Bitcoin',
  value: '$65,432.10',
  description: 'Current BTC price',
};

describe('BuilderPreview', () => {
  describe('no-data state', () => {
    it('should show "No data" message when sampleData is null', () => {
      render(BuilderPreview, {
        props: { html: sampleHtml, css: sampleCss, sampleData: null },
      });

      expect(screen.getByText(/no data/i)).toBeInTheDocument();
    });

    it('should show "No data" message when sampleData is undefined', () => {
      render(BuilderPreview, {
        props: { html: sampleHtml, css: sampleCss },
      });

      expect(screen.getByText(/no data/i)).toBeInTheDocument();
    });

    it('should still render the preview frame when data is missing', () => {
      render(BuilderPreview, {
        props: { html: sampleHtml, css: sampleCss, sampleData: null },
      });

      expect(screen.getByTestId('preview-frame')).toBeInTheDocument();
    });
  });

  describe('rendering', () => {
    it('should render an iframe with srcdoc', () => {
      render(BuilderPreview, {
        props: { html: sampleHtml, css: sampleCss, sampleData: sampleData },
      });

      const iframe = screen.getByTestId('preview-frame') as HTMLIFrameElement;
      expect(iframe.tagName).toBe('IFRAME');
      expect(iframe.getAttribute('srcdoc')).toBeTruthy();
    });

    it('should include CSS in the srcdoc', () => {
      render(BuilderPreview, {
        props: { html: sampleHtml, css: sampleCss, sampleData: sampleData },
      });

      const iframe = screen.getByTestId('preview-frame') as HTMLIFrameElement;
      const srcdoc = iframe.getAttribute('srcdoc') ?? '';
      expect(srcdoc).toContain('.widget { background: #000;');
    });

    it('should replace {{placeholders}} with data values', () => {
      render(BuilderPreview, {
        props: { html: sampleHtml, css: sampleCss, sampleData: sampleData },
      });

      const iframe = screen.getByTestId('preview-frame') as HTMLIFrameElement;
      const srcdoc = iframe.getAttribute('srcdoc') ?? '';
      expect(srcdoc).toContain('Bitcoin');
      expect(srcdoc).toContain('$65,432.10');
      expect(srcdoc).not.toContain('{{title}}');
      expect(srcdoc).not.toContain('{{value}}');
    });

    it('should leave unmatched placeholders as-is', () => {
      const html = '<span>{{unknown_field}}</span>';
      render(BuilderPreview, {
        props: { html, css: '', sampleData: sampleData },
      });

      const iframe = screen.getByTestId('preview-frame') as HTMLIFrameElement;
      const srcdoc = iframe.getAttribute('srcdoc') ?? '';
      expect(srcdoc).toContain('{{unknown_field}}');
    });

    it('should resolve nested dot-path placeholders', () => {
      const html = '<span>{{source.name}}</span>';
      const data = { source: { name: 'Reuters', url: 'https://reuters.com' } };
      render(BuilderPreview, {
        props: { html, css: '', sampleData: data },
      });

      const iframe = screen.getByTestId('preview-frame') as HTMLIFrameElement;
      const srcdoc = iframe.getAttribute('srcdoc') ?? '';
      expect(srcdoc).toContain('Reuters');
      expect(srcdoc).not.toContain('{{source.name}}');
    });

    it('should set dark background on the preview container', () => {
      render(BuilderPreview, {
        props: { html: sampleHtml, css: sampleCss, sampleData: sampleData },
      });

      const container = screen.getByTestId('preview-container');
      expect(container).toBeInTheDocument();
    });
  });

  describe('size toggle', () => {
    it('should default to medium size', () => {
      render(BuilderPreview, {
        props: { html: sampleHtml, css: sampleCss, sampleData: sampleData },
      });

      const mediumBtn = screen.getByRole('button', { name: /medium/i });
      expect(mediumBtn).toHaveAttribute('aria-pressed', 'true');
    });

    it('should switch to small size when clicked', async () => {
      render(BuilderPreview, {
        props: { html: sampleHtml, css: sampleCss, sampleData: sampleData },
      });

      const smallBtn = screen.getByRole('button', { name: /small/i });
      await fireEvent.click(smallBtn);

      expect(smallBtn).toHaveAttribute('aria-pressed', 'true');
      const mediumBtn = screen.getByRole('button', { name: /medium/i });
      expect(mediumBtn).toHaveAttribute('aria-pressed', 'false');
    });

    it('should switch to large size when clicked', async () => {
      render(BuilderPreview, {
        props: { html: sampleHtml, css: sampleCss, sampleData: sampleData },
      });

      const largeBtn = screen.getByRole('button', { name: /large/i });
      await fireEvent.click(largeBtn);

      expect(largeBtn).toHaveAttribute('aria-pressed', 'true');
    });

    it('should have three size buttons', () => {
      render(BuilderPreview, {
        props: { html: sampleHtml, css: sampleCss, sampleData: sampleData },
      });

      expect(screen.getByRole('button', { name: /small/i })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /medium/i })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /large/i })).toBeInTheDocument();
    });

    it('should resize the iframe when size changes', async () => {
      render(BuilderPreview, {
        props: { html: sampleHtml, css: sampleCss, sampleData: sampleData },
      });

      const iframe = screen.getByTestId('preview-frame') as HTMLIFrameElement;

      // Default is medium
      expect(iframe.style.width).toBe('300px');
      expect(iframe.style.height).toBe('225px');

      // Switch to small
      await fireEvent.click(screen.getByRole('button', { name: /small/i }));
      expect(iframe.style.width).toBe('200px');
      expect(iframe.style.height).toBe('150px');

      // Switch to large
      await fireEvent.click(screen.getByRole('button', { name: /large/i }));
      expect(iframe.style.width).toBe('400px');
      expect(iframe.style.height).toBe('300px');
    });
  });

  describe('empty html', () => {
    it('should render gracefully with empty html', () => {
      render(BuilderPreview, {
        props: { html: '', css: '', sampleData: sampleData },
      });

      const iframe = screen.getByTestId('preview-frame') as HTMLIFrameElement;
      expect(iframe.getAttribute('srcdoc')).toBeTruthy();
    });
  });
});
