import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/svelte';
import AdminAiAssist from '../lib/AdminAiAssist.svelte';

describe('AdminAiAssist output escaping', () => {
  it('escapes model text in url and headers but still highlights {{secrets}}', async () => {
    const payload = {
      connector: {
        type: 'json_api',
        url: 'https://x.test/<img src=x onerror=alert(1)>?k={{API_KEY}}',
        method: 'GET',
        headers: { Authorization: '<script>alert(1)</script> {{TOKEN}}' },
        refreshInterval: 300,
      },
      html: '<div></div>',
      css: '',
      explanation: 'e',
    };
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue(new Response(JSON.stringify(payload))));

    const { container } = render(AdminAiAssist, { props: { pluginContext: { name: 'T' } } });
    await fireEvent.input(screen.getByLabelText(/documentation/i), { target: { value: 'docs' } });
    await fireEvent.click(screen.getByRole('button', { name: /generate/i }));

    await waitFor(() => expect(container.querySelector('.ai-assist__url')).toBeTruthy());
    expect(container.querySelector('.ai-assist__url img')).toBeNull();
    expect(container.querySelector('td script')).toBeNull();
    expect(container.querySelector('.ai-assist__url')!.textContent).toContain('<img src=x');
    expect(container.querySelectorAll('.ai-assist__secret-hl')).toHaveLength(2);
  });
});
