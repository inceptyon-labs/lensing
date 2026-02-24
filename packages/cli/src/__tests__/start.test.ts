import { describe, it, expect, vi, beforeEach } from 'vitest';

// Mock @lensing/core to avoid real server startup
vi.mock('@lensing/core', () => ({
  createHostService: vi.fn(),
}));

import { createHostService } from '@lensing/core';
import { startServer } from '../commands/start';
import type { StartServerOptions, StartServerResult } from '../commands/start';

const mockCreateHostService = vi.mocked(createHostService);

describe('startServer', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockCreateHostService.mockReturnValue({
      ready: Promise.resolve(),
      port: 3100,
      close: vi.fn(),
      db: {} as never,
      rest: {} as never,
      ws: {} as never,
      plugins: {} as never,
    });
  });

  it('should call createHostService with CLI defaults', async () => {
    await startServer();

    expect(mockCreateHostService).toHaveBeenCalledWith(
      expect.objectContaining({
        port: 3100,
        pluginsDir: './plugins',
        dbPath: './data/lensing.db',
      })
    );
  });

  it('should allow overriding port', async () => {
    await startServer({ port: 8080 });

    expect(mockCreateHostService).toHaveBeenCalledWith(expect.objectContaining({ port: 8080 }));
  });

  it('should allow overriding pluginsDir', async () => {
    await startServer({ pluginsDir: '/custom/plugins' });

    expect(mockCreateHostService).toHaveBeenCalledWith(
      expect.objectContaining({ pluginsDir: '/custom/plugins' })
    );
  });

  it('should allow overriding dbPath', async () => {
    await startServer({ dbPath: '/tmp/test.db' });

    expect(mockCreateHostService).toHaveBeenCalledWith(
      expect.objectContaining({ dbPath: '/tmp/test.db' })
    );
  });

  it('should await ready before returning', async () => {
    let resolveReady!: () => void;
    const readyPromise = new Promise<void>((resolve) => {
      resolveReady = resolve;
    });
    mockCreateHostService.mockReturnValue({
      ready: readyPromise,
      port: 3100,
      close: vi.fn(),
      db: {} as never,
      rest: {} as never,
      ws: {} as never,
      plugins: {} as never,
    });

    let resolved = false;
    const promise = startServer().then(() => {
      resolved = true;
    });

    // Should not resolve until ready resolves
    await new Promise((r) => setTimeout(r, 10));
    expect(resolved).toBe(false);

    resolveReady();
    await promise;
    expect(resolved).toBe(true);
  });

  it('should return the host service instance and port', async () => {
    const result = await startServer();

    expect(result).toHaveProperty('host');
    expect(result).toHaveProperty('port');
    expect(result.port).toBe(3100);
  });

  it('should log startup info via provided logger', async () => {
    const logger = {
      info: vi.fn(),
      error: vi.fn(),
    };

    await startServer({ logger });

    expect(logger.info).toHaveBeenCalled();
    // Should log something about the port/address
    const logMessages = logger.info.mock.calls.map((c: unknown[]) => c[0]);
    expect(
      logMessages.some((msg) => typeof msg === 'string' && (msg.includes('3100') || msg.includes('listening')))
    ).toBe(true);
  });

  it('should propagate errors from host service boot failure', async () => {
    mockCreateHostService.mockReturnValue({
      ready: Promise.reject(new Error('Boot failed')),
      port: 0,
      close: vi.fn(),
      db: {} as never,
      rest: {} as never,
      ws: {} as never,
      plugins: {} as never,
    });

    await expect(startServer()).rejects.toThrow('Boot failed');
  });
});
