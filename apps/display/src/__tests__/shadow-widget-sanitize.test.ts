import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/svelte';
import ShadowWidget from '../lib/ShadowWidget.svelte';

function shadow(container: HTMLElement): ShadowRoot {
  return container.querySelector('[data-testid="shadow-widget"]')!.shadowRoot!;
}

describe('ShadowWidget sanitizing', () => {
  it('strips event handler attributes from template html', () => {
    const { container } = render(ShadowWidget, {
      props: {
        html: '<p class="ok">hi</p><img src="x" onerror="window.__pwned = 1">',
        css: '',
        data: null,
      },
    });
    const root = shadow(container);
    expect(root.querySelector('.ok')).toBeTruthy();
    expect(root.querySelector('img')?.hasAttribute('onerror') ?? false).toBe(false);
    expect(root.innerHTML).not.toContain('onerror');
  });

  it('keeps css inside a single style element even when it contains </style>', () => {
    const css = '.a{color:red}</style><img src=x onerror="window.__pwned = 1"><style>';
    const { container } = render(ShadowWidget, { props: { html: '<b>x</b>', css, data: null } });
    const root = shadow(container);
    expect(root.querySelectorAll('img')).toHaveLength(0);
    expect(root.querySelector('style')!.textContent).toBe(css);
  });

  it('does not rewrite the shadow root when rendered output is unchanged', async () => {
    const { container, rerender } = render(ShadowWidget, {
      props: { html: '<p id="p">{{a}}</p>', css: '.x{}', data: { a: 1, b: 1 } },
    });
    const root = shadow(container);
    const p = root.querySelector('#p');
    await rerender({ data: { a: 1, b: 2 } });
    expect(root.querySelector('#p')).toBe(p);
    await rerender({ data: { a: 2, b: 2 } });
    expect(root.querySelector('#p')!.textContent).toBe('2');
  });
});
