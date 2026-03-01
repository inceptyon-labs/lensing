import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/svelte';
import ShadowWidget from '../lib/ShadowWidget.svelte';

const sampleHtml = '<div class="temp">{{temperature}}°F</div>';
const sampleCss = '.temp { color: white; font-size: 24px; }';

describe('ShadowWidget', () => {
  it('creates a shadow root on the host element', () => {
    const { container } = render(ShadowWidget, {
      props: { html: sampleHtml, css: sampleCss, data: null },
    });
    const host = container.querySelector('[data-testid="shadow-widget"]');
    expect(host).toBeTruthy();
    expect(host!.shadowRoot).toBeTruthy();
  });

  it('injects CSS as <style> inside shadow root', () => {
    const { container } = render(ShadowWidget, {
      props: { html: sampleHtml, css: sampleCss, data: null },
    });
    const host = container.querySelector('[data-testid="shadow-widget"]')!;
    const style = host.shadowRoot!.querySelector('style');
    expect(style).toBeTruthy();
    expect(style!.textContent).toContain('.temp');
    expect(style!.textContent).toContain('font-size: 24px');
  });

  it('injects HTML content inside shadow root', () => {
    const { container } = render(ShadowWidget, {
      props: { html: '<p class="greeting">Hello</p>', css: '', data: null },
    });
    const host = container.querySelector('[data-testid="shadow-widget"]')!;
    const p = host.shadowRoot!.querySelector('.greeting');
    expect(p).toBeTruthy();
    expect(p!.textContent).toBe('Hello');
  });

  it('interpolates simple {{field}} placeholders with data', () => {
    const { container } = render(ShadowWidget, {
      props: {
        html: '<span>{{temperature}}°F</span>',
        css: '',
        data: { temperature: 72 },
      },
    });
    const host = container.querySelector('[data-testid="shadow-widget"]')!;
    const span = host.shadowRoot!.querySelector('span');
    expect(span!.textContent).toBe('72°F');
  });

  it('interpolates nested {{path.field}} dot-path placeholders', () => {
    const { container } = render(ShadowWidget, {
      props: {
        html: '<span>{{weather.current.temp}}</span>',
        css: '',
        data: { weather: { current: { temp: 68 } } },
      },
    });
    const host = container.querySelector('[data-testid="shadow-widget"]')!;
    const span = host.shadowRoot!.querySelector('span');
    expect(span!.textContent).toBe('68');
  });

  it('shows raw template markers when data is null', () => {
    const { container } = render(ShadowWidget, {
      props: { html: '<span>{{temperature}}°F</span>', css: '', data: null },
    });
    const host = container.querySelector('[data-testid="shadow-widget"]')!;
    const span = host.shadowRoot!.querySelector('span');
    expect(span!.textContent).toBe('{{temperature}}°F');
  });

  it('replaces missing fields with empty string', () => {
    const { container } = render(ShadowWidget, {
      props: {
        html: '<span>{{missing}}</span>',
        css: '',
        data: { other: 'value' },
      },
    });
    const host = container.querySelector('[data-testid="shadow-widget"]')!;
    const span = host.shadowRoot!.querySelector('span');
    expect(span!.textContent).toBe('');
  });

  it('host element has data-testid for querying', () => {
    const { container } = render(ShadowWidget, {
      props: { html: '', css: '', data: null },
    });
    const host = container.querySelector('[data-testid="shadow-widget"]');
    expect(host).toBeTruthy();
    expect(host!.tagName.toLowerCase()).toBe('div');
  });

  it('CSS stays inside shadow root, not in light DOM', () => {
    const uniqueClass = 'shadow-test-unique-class';
    const { container } = render(ShadowWidget, {
      props: {
        html: `<div class="${uniqueClass}">test</div>`,
        css: `.${uniqueClass} { color: red; }`,
        data: null,
      },
    });
    // CSS should NOT leak to light DOM
    const lightStyle = container.querySelector('style');
    expect(lightStyle).toBeNull();

    // CSS should be inside shadow root
    const host = container.querySelector('[data-testid="shadow-widget"]')!;
    const shadowStyle = host.shadowRoot!.querySelector('style');
    expect(shadowStyle!.textContent).toContain(uniqueClass);
  });
});
