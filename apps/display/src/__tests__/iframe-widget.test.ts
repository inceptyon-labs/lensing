import { describe, it, expect, vi, afterEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/svelte';
import IframeWidget from '../lib/IframeWidget.svelte';
import { SANDBOX_MSG } from '../lib/iframe-sandbox';

const sampleHtml = '<div class="widget">{{value}}</div>';
const sampleCss = '.widget { color: white; }';
const pluginId = 'test-plugin';

describe('IframeWidget', () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe('rendering', () => {
    it('renders an iframe element with data-testid="iframe-widget"', () => {
      render(IframeWidget, {
        props: { pluginId, html: sampleHtml, css: sampleCss, data: null },
      });
      const iframe = screen.getByTestId('iframe-widget');
      expect(iframe.tagName).toBe('IFRAME');
    });

    it('sets sandbox="allow-scripts"', () => {
      render(IframeWidget, {
        props: { pluginId, html: sampleHtml, css: sampleCss, data: null },
      });
      const iframe = screen.getByTestId('iframe-widget');
      expect(iframe.getAttribute('sandbox')).toBe('allow-scripts');
    });

    it('does not include allow-same-origin in sandbox attribute', () => {
      render(IframeWidget, {
        props: { pluginId, html: sampleHtml, css: sampleCss, data: null },
      });
      const iframe = screen.getByTestId('iframe-widget');
      expect(iframe.getAttribute('sandbox')).not.toContain('allow-same-origin');
    });

    it('sets srcdoc attribute built from buildSandboxSrcdoc', () => {
      render(IframeWidget, {
        props: { pluginId, html: sampleHtml, css: sampleCss, data: null },
      });
      const iframe = screen.getByTestId('iframe-widget');
      const srcdoc = iframe.getAttribute('srcdoc') ?? '';
      expect(srcdoc).toContain('<!DOCTYPE html>');
      expect(srcdoc).toContain(sampleCss);
      expect(srcdoc).toContain(sampleHtml);
    });

    it('includes bootstrap postMessage handler in srcdoc', () => {
      render(IframeWidget, {
        props: { pluginId, html: sampleHtml, css: sampleCss, data: null },
      });
      const iframe = screen.getByTestId('iframe-widget');
      const srcdoc = iframe.getAttribute('srcdoc') ?? '';
      expect(srcdoc).toContain(SANDBOX_MSG.DATA);
      expect(srcdoc).toContain('postMessage');
    });

    it('includes custom JS in srcdoc when js prop is provided', () => {
      const js = 'console.log("custom")';
      render(IframeWidget, {
        props: { pluginId, html: sampleHtml, css: sampleCss, js, data: null },
      });
      const iframe = screen.getByTestId('iframe-widget');
      const srcdoc = iframe.getAttribute('srcdoc') ?? '';
      expect(srcdoc).toContain('console.log("custom")');
    });

    it('renders without custom JS when js prop is omitted', () => {
      expect(() =>
        render(IframeWidget, {
          props: { pluginId, html: sampleHtml, css: sampleCss, data: null },
        })
      ).not.toThrow();
    });
  });

  describe('data injection via postMessage', () => {
    it('sends widget-data postMessage to iframe contentWindow when data changes', async () => {
      const mockPostMessage = vi.fn();
      const { rerender } = render(IframeWidget, {
        props: { pluginId, html: sampleHtml, css: sampleCss, data: null },
      });

      const iframe = screen.getByTestId('iframe-widget') as HTMLIFrameElement;
      Object.defineProperty(iframe, 'contentWindow', {
        value: { postMessage: mockPostMessage },
        writable: true,
        configurable: true,
      });

      await rerender({ data: { value: 42 } });

      await waitFor(() => {
        expect(mockPostMessage).toHaveBeenCalledWith(
          { type: SANDBOX_MSG.DATA, pluginId, data: { value: 42 } },
          '*'
        );
      });
    });

    it('does not throw when data is null', () => {
      expect(() =>
        render(IframeWidget, {
          props: { pluginId, html: sampleHtml, css: sampleCss, data: null },
        })
      ).not.toThrow();
    });

    it('does not call postMessage when data is null', async () => {
      const mockPostMessage = vi.fn();
      render(IframeWidget, {
        props: { pluginId, html: sampleHtml, css: sampleCss, data: null },
      });

      const iframe = screen.getByTestId('iframe-widget') as HTMLIFrameElement;
      Object.defineProperty(iframe, 'contentWindow', {
        value: { postMessage: mockPostMessage },
        writable: true,
        configurable: true,
      });

      // No data provided — postMessage should not be called
      expect(mockPostMessage).not.toHaveBeenCalled();
    });
  });

  describe('resize message handling', () => {
    it('updates iframe height when widget-resize message received from correct iframe source', async () => {
      const { container } = render(IframeWidget, {
        props: { pluginId, html: sampleHtml, css: sampleCss, data: null },
      });

      const iframe = container.querySelector('[data-testid="iframe-widget"]') as HTMLIFrameElement;
      const mockContentWindow = iframe.contentWindow;

      window.dispatchEvent(
        new MessageEvent('message', {
          data: { type: SANDBOX_MSG.RESIZE, pluginId, height: 350 },
          source: mockContentWindow,
        })
      );

      await waitFor(() => {
        const iframeEl = container.querySelector('[data-testid="iframe-widget"]') as HTMLElement;
        expect(iframeEl.style.height).toBe('350px');
      });
    });

    it('ignores widget-resize messages from non-iframe sources', async () => {
      const { container } = render(IframeWidget, {
        props: { pluginId, html: sampleHtml, css: sampleCss, data: null },
      });

      // Send message with wrong source (not the iframe)
      const maliciousWindow = { example: 'not an iframe' } as unknown as Window;
      window.dispatchEvent(
        new MessageEvent('message', {
          data: { type: SANDBOX_MSG.RESIZE, pluginId, height: 999 },
          source: maliciousWindow,
        })
      );

      await new Promise((r) => setTimeout(r, 50));
      const iframe = container.querySelector('[data-testid="iframe-widget"]') as HTMLElement;
      expect(iframe.style.height).not.toBe('999px');
    });

    it('ignores widget-resize messages for a different pluginId', async () => {
      const { container } = render(IframeWidget, {
        props: { pluginId, html: sampleHtml, css: sampleCss, data: null },
      });

      const iframe = container.querySelector('[data-testid="iframe-widget"]') as HTMLIFrameElement;
      const mockContentWindow = iframe.contentWindow;

      window.dispatchEvent(
        new MessageEvent('message', {
          data: { type: SANDBOX_MSG.RESIZE, pluginId: 'other-plugin', height: 999 },
          source: mockContentWindow,
        })
      );

      await new Promise((r) => setTimeout(r, 50));
      const iframeEl = container.querySelector('[data-testid="iframe-widget"]') as HTMLElement;
      expect(iframeEl.style.height).not.toBe('999px');
    });

    it('ignores messages with wrong type', async () => {
      const { container } = render(IframeWidget, {
        props: { pluginId, html: sampleHtml, css: sampleCss, data: null },
      });

      const iframe = container.querySelector('[data-testid="iframe-widget"]') as HTMLIFrameElement;
      const mockContentWindow = iframe.contentWindow;

      window.dispatchEvent(
        new MessageEvent('message', {
          data: { type: 'unknown-type', pluginId, height: 888 },
          source: mockContentWindow,
        })
      );

      await new Promise((r) => setTimeout(r, 50));
      const iframeEl = container.querySelector('[data-testid="iframe-widget"]') as HTMLElement;
      expect(iframeEl.style.height).not.toBe('888px');
    });

    it('ignores messages with no data', async () => {
      expect(() => {
        render(IframeWidget, {
          props: { pluginId, html: sampleHtml, css: sampleCss, data: null },
        });
        window.dispatchEvent(new MessageEvent('message', { data: null }));
      }).not.toThrow();
    });
  });
});
