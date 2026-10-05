export interface ReconnectingSocketOptions {
  url: string;
  onOpen?: () => void;
  onMessage?: (event: MessageEvent) => void;
  /** Injectable for tests */
  WebSocketImpl?: typeof WebSocket;
}

export interface ReconnectingSocket {
  close(): void;
}

const INITIAL_DELAY_MS = 1000;
const MAX_DELAY_MS = 30000;

/**
 * WebSocket that reconnects with capped exponential backoff (1 s doubling to
 * 30 s, reset after a successful open). At most one socket is live at a time.
 */
export function createReconnectingSocket(opts: ReconnectingSocketOptions): ReconnectingSocket {
  const Impl = opts.WebSocketImpl ?? WebSocket;
  let ws: WebSocket | null = null;
  let timer: ReturnType<typeof setTimeout> | null = null;
  let delay = INITIAL_DELAY_MS;
  let stopped = false;

  function scheduleReconnect(): void {
    if (stopped || timer !== null) return;
    timer = setTimeout(() => {
      timer = null;
      connect();
    }, delay);
    delay = Math.min(delay * 2, MAX_DELAY_MS);
  }

  function connect(): void {
    if (stopped) return;
    const sock = new Impl(opts.url);
    ws = sock;

    sock.addEventListener('open', () => {
      if (sock !== ws) return;
      delay = INITIAL_DELAY_MS;
      opts.onOpen?.();
    });
    sock.addEventListener('message', (event) => {
      if (sock !== ws) return;
      opts.onMessage?.(event as MessageEvent);
    });
    const handleDown = () => {
      if (sock !== ws) return;
      ws = null;
      try {
        sock.close();
      } catch {
        // already closed
      }
      scheduleReconnect();
    };
    sock.addEventListener('close', handleDown);
    sock.addEventListener('error', handleDown);
  }

  connect();

  return {
    close(): void {
      stopped = true;
      if (timer !== null) {
        clearTimeout(timer);
        timer = null;
      }
      const sock = ws;
      ws = null;
      sock?.close();
    },
  };
}
