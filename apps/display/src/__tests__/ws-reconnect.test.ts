import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { createReconnectingSocket } from '../lib/ws-reconnect';

class FakeSocket extends EventTarget {
  static instances: FakeSocket[] = [];
  closed = false;
  constructor(public url: string) {
    super();
    FakeSocket.instances.push(this);
  }
  close() {
    this.closed = true;
  }
  open() {
    this.dispatchEvent(new Event('open'));
  }
  drop() {
    this.dispatchEvent(new Event('close'));
  }
}

function setup() {
  const onOpen = vi.fn();
  const onMessage = vi.fn();
  const handle = createReconnectingSocket({
    url: 'ws://x/ws',
    onOpen,
    onMessage,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    WebSocketImpl: FakeSocket as any,
  });
  return { onOpen, onMessage, handle };
}

describe('createReconnectingSocket', () => {
  beforeEach(() => {
    FakeSocket.instances = [];
    vi.useFakeTimers();
  });
  afterEach(() => vi.useRealTimers());

  it('reconnects with doubling backoff capped at 30s', () => {
    setup();
    const delays = [1000, 2000, 4000, 8000, 16000, 30000, 30000];
    delays.forEach((d, i) => {
      expect(FakeSocket.instances).toHaveLength(i + 1);
      FakeSocket.instances[i].drop();
      vi.advanceTimersByTime(d - 1);
      expect(FakeSocket.instances).toHaveLength(i + 1);
      vi.advanceTimersByTime(1);
      expect(FakeSocket.instances).toHaveLength(i + 2);
    });
  });

  it('resets the backoff after a successful open and calls onOpen each time', () => {
    const { onOpen } = setup();
    FakeSocket.instances[0].drop();
    vi.advanceTimersByTime(1000);
    FakeSocket.instances[1].drop();
    vi.advanceTimersByTime(2000);
    FakeSocket.instances[2].open();
    expect(onOpen).toHaveBeenCalledTimes(1);
    FakeSocket.instances[2].drop();
    vi.advanceTimersByTime(1000);
    expect(FakeSocket.instances).toHaveLength(4);
    FakeSocket.instances[3].open();
    expect(onOpen).toHaveBeenCalledTimes(2);
  });

  it('never opens two sockets when both error and close fire', () => {
    setup();
    const s = FakeSocket.instances[0];
    s.dispatchEvent(new Event('error'));
    s.drop();
    vi.advanceTimersByTime(1000);
    expect(FakeSocket.instances).toHaveLength(2);
    expect(s.closed).toBe(true);
  });

  it('close() stops reconnecting and closes the socket', () => {
    const { handle } = setup();
    FakeSocket.instances[0].drop();
    handle.close();
    vi.advanceTimersByTime(60000);
    expect(FakeSocket.instances).toHaveLength(1);

    const { handle: h2 } = setup();
    const live = FakeSocket.instances[1];
    h2.close();
    expect(live.closed).toBe(true);
    live.drop();
    vi.advanceTimersByTime(60000);
    expect(FakeSocket.instances).toHaveLength(2);
  });

  it('forwards messages', () => {
    const { onMessage } = setup();
    const ev = new MessageEvent('message', { data: 'hi' });
    FakeSocket.instances[0].dispatchEvent(ev);
    expect(onMessage).toHaveBeenCalledWith(ev);
  });
});
