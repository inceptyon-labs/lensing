import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { get } from 'svelte/store';
import {
  installAuthFetch,
  tokenPromptOpen,
  submitToken,
  cancelToken,
  TOKEN_KEY,
} from '../lib/admin-auth';

const unauthorized = () =>
  new Response(JSON.stringify({ error: 'Unauthorized' }), {
    status: 401,
    headers: { 'Content-Type': 'application/json' },
  });
const ok = () => new Response('{}', { status: 200 });

describe('installAuthFetch', () => {
  let base: ReturnType<typeof vi.fn>;
  let uninstall: () => void;
  const realFetch = globalThis.fetch;

  function headerOf(call: number, name: string): string | null {
    const req = base.mock.calls[call][0] as Request;
    return req.headers.get(name);
  }

  beforeEach(() => {
    localStorage.clear();
    base = vi.fn();
    globalThis.fetch = base as unknown as typeof fetch;
    uninstall = installAuthFetch();
  });
  afterEach(() => {
    uninstall();
    globalThis.fetch = realFetch;
    cancelToken();
  });

  it('adds the bearer header to same-origin requests when a token is stored', async () => {
    localStorage.setItem(TOKEN_KEY, 'abc');
    base.mockResolvedValue(ok());
    await fetch('/settings', { method: 'POST', body: '{}' });
    expect(headerOf(0, 'Authorization')).toBe('Bearer abc');
  });

  it('sends no header without a token', async () => {
    base.mockResolvedValue(ok());
    await fetch('/plugins');
    expect(headerOf(0, 'Authorization')).toBeNull();
  });

  it('never sends the token to other origins', async () => {
    localStorage.setItem(TOKEN_KEY, 'abc');
    base.mockResolvedValue(ok());
    await fetch('https://example.com/api', { headers: { 'X-A': '1' } });
    const [input, init] = base.mock.calls[0];
    const h = new Headers(init?.headers ?? (input as Request).headers);
    expect(h.get('Authorization')).toBeNull();
  });

  it('prompts on 401, retries once with the saved token', async () => {
    base.mockResolvedValueOnce(unauthorized()).mockResolvedValueOnce(ok());
    const p = fetch('/settings', { method: 'PUT', body: '{"a":1}' });
    await vi.waitFor(() => expect(get(tokenPromptOpen)).toBe(true));
    submitToken('tok');
    const res = await p;
    expect(res.status).toBe(200);
    expect(localStorage.getItem(TOKEN_KEY)).toBe('tok');
    expect(base).toHaveBeenCalledTimes(2);
    expect(headerOf(1, 'Authorization')).toBe('Bearer tok');
    expect(await (base.mock.calls[1][0] as Request).text()).toBe('{"a":1}');
    expect(get(tokenPromptOpen)).toBe(false);
  });

  it('returns the original 401 on cancel', async () => {
    base.mockResolvedValue(unauthorized());
    const p = fetch('/settings', { method: 'PUT', body: '{}' });
    await vi.waitFor(() => expect(get(tokenPromptOpen)).toBe(true));
    cancelToken();
    const res = await p;
    expect(res.status).toBe(401);
    expect(base).toHaveBeenCalledTimes(1);
  });

  it('shares one prompt between concurrent 401s', async () => {
    base.mockImplementation(async (req: Request) =>
      req.headers.get('Authorization') === 'Bearer tok' ? ok() : unauthorized()
    );
    const a = fetch('/settings', { method: 'POST', body: '1' });
    const b = fetch('/plugins/x', { method: 'POST', body: '2' });
    await vi.waitFor(() => expect(get(tokenPromptOpen)).toBe(true));
    submitToken('tok');
    expect((await a).status).toBe(200);
    expect((await b).status).toBe(200);
    expect(base).toHaveBeenCalledTimes(4);
  });

  it('does not prompt for non-auth 401 bodies', async () => {
    base.mockResolvedValue(new Response('{"error":"Bad key"}', { status: 401 }));
    const res = await fetch('/ask', { method: 'POST', body: '{}' });
    expect(res.status).toBe(401);
    expect(get(tokenPromptOpen)).toBe(false);
  });
});
