import { writable } from 'svelte/store';

export const TOKEN_KEY = 'lensing.adminToken';

/** True while the token prompt modal should be visible. */
export const tokenPromptOpen = writable(false);

export function getToken(): string | null {
  try {
    return localStorage.getItem(TOKEN_KEY) || null;
  } catch {
    return null;
  }
}

function storeToken(token: string): void {
  try {
    localStorage.setItem(TOKEN_KEY, token);
  } catch {
    // storage unavailable — token only lasts for the retry
  }
}

let pending: Promise<string | null> | null = null;
let settle: ((token: string | null) => void) | null = null;

/** Open the prompt (or join the one already open). Resolves null on cancel. */
function requestToken(): Promise<string | null> {
  if (!pending) {
    pending = new Promise<string | null>((resolve) => {
      settle = resolve;
    });
    tokenPromptOpen.set(true);
  }
  return pending;
}

function finish(token: string | null): void {
  const resolve = settle;
  pending = null;
  settle = null;
  tokenPromptOpen.set(false);
  resolve?.(token);
}

export function submitToken(token: string): void {
  const trimmed = token.trim();
  if (!trimmed) return;
  storeToken(trimmed);
  finish(trimmed);
}

export function cancelToken(): void {
  finish(null);
}

async function isAuthFailure(res: Response): Promise<boolean> {
  if (res.status !== 401) return false;
  try {
    const body = (await res.clone().json()) as { error?: string };
    return body.error === 'Unauthorized';
  } catch {
    return false;
  }
}

function withToken(req: Request, token: string | null): Request {
  if (!token) return req;
  const headers = new Headers(req.headers);
  headers.set('Authorization', `Bearer ${token}`);
  return new Request(req, { headers });
}

/**
 * Wrap window.fetch so same-origin requests carry the admin bearer token and a
 * 401 prompts for it once, then retries. Returns a function that restores the
 * previous fetch.
 */
export function installAuthFetch(): () => void {
  const original = globalThis.fetch;

  const wrapped = async (input: RequestInfo | URL, init?: RequestInit): Promise<Response> => {
    let req: Request;
    try {
      const target =
        typeof input === 'string' || input instanceof URL
          ? new URL(input, location.href).href
          : input;
      req = new Request(target, init);
    } catch {
      return original(input, init);
    }
    if (new URL(req.url, location.href).origin !== location.origin) {
      return original(input, init);
    }

    const retryReq = req.clone();
    const sentToken = getToken();
    const res = await original(withToken(req, sentToken));
    if (!(await isAuthFailure(res))) return res;

    // A token saved while this request was in flight: retry without prompting
    let token = getToken();
    if (!token || token === sentToken) token = await requestToken();
    if (!token) return res;
    return original(withToken(retryReq, token));
  };

  globalThis.fetch = wrapped as typeof fetch;
  return () => {
    globalThis.fetch = original;
  };
}
