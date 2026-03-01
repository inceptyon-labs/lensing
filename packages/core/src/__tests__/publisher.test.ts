import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { createPublisherPr } from '../publisher';

describe('createPublisherPr', () => {
  let mockFetch: ReturnType<typeof vi.fn>;
  let originalFetch: typeof global.fetch;

  const defaultConfig = {
    githubToken: 'test-token',
    marketplaceRepoUrl: 'https://github.com/marketplace/lensing-plugins',
    pluginId: 'test-plugin',
    pluginName: 'Test Plugin',
    pluginDescription: 'A test plugin',
    version: '1.0.0',
    zipContent: Buffer.from('zip-data'),
    thumbnailContent: Buffer.from('png-data'),
    indexUpdate: {
      test_plugin: { name: 'Test Plugin', description: 'A test plugin', version: '1.0.0' },
    },
  };

  beforeEach(() => {
    mockFetch = vi.fn();
    originalFetch = global.fetch;
    global.fetch = mockFetch as unknown as typeof fetch;
  });

  afterEach(() => {
    global.fetch = originalFetch;
  });

  /** Returns same successful response for all fetch calls */
  function mockAllSuccess(prUrl = 'https://github.com/marketplace/lensing-plugins/pull/42') {
    mockFetch.mockResolvedValue({
      ok: true,
      json: async () => ({ html_url: prUrl, id: 1 }),
    });
  }

  it('should create a PR with ZIP and thumbnail', async () => {
    const prUrl = 'https://github.com/marketplace/lensing-plugins/pull/42';
    mockAllSuccess(prUrl);

    const result = await createPublisherPr(defaultConfig);

    expect(result.url).toBe(prUrl);
  });

  it('should create branch with plugin-id-version naming', async () => {
    mockAllSuccess();

    await createPublisherPr({ ...defaultConfig, pluginId: 'my-plugin', version: '2.0.0' });

    const refsOptions = mockFetch.mock.calls.find((call) => call[0]?.includes('git/refs'))?.[1];
    const body = JSON.parse(refsOptions?.body ?? '{}');
    expect(body.ref).toContain('plugin/my-plugin-2.0.0');
  });

  it('should commit ZIP file to plugins/<id>/<id>-<version>.zip', async () => {
    mockAllSuccess();

    await createPublisherPr({ ...defaultConfig, pluginId: 'my-plugin', version: '1.5.0' });

    const zipCall = mockFetch.mock.calls.find((call) =>
      call[0]?.includes('plugins/my-plugin/my-plugin-1.5.0.zip')
    );
    expect(zipCall).toBeDefined();
  });

  it('should commit thumbnail to plugins/<id>/thumbnail.png', async () => {
    mockAllSuccess();

    await createPublisherPr({ ...defaultConfig, pluginId: 'my-plugin' });

    const thumbCall = mockFetch.mock.calls.find((call) =>
      call[0]?.includes('plugins/my-plugin/thumbnail.png')
    );
    expect(thumbCall).toBeDefined();
  });

  it('should update index.json with plugin metadata', async () => {
    mockAllSuccess();

    const indexUpdate = {
      my_plugin: { name: 'My Plugin', description: 'A plugin', version: '1.0.0', author: 'test' },
    };
    await createPublisherPr({ ...defaultConfig, indexUpdate });

    const indexOptions = mockFetch.mock.calls.find((call) =>
      call[0]?.includes('contents/index.json')
    )?.[1];
    const reqBody = JSON.parse(indexOptions?.body ?? '{}');
    const decoded = Buffer.from(reqBody.content ?? '', 'base64').toString();
    expect(decoded).toContain('my_plugin');
  });

  it('should create PR with descriptive title and body', async () => {
    mockAllSuccess();

    await createPublisherPr({ ...defaultConfig, pluginName: 'My Plugin', version: '1.0.0' });

    const prOptions = mockFetch.mock.calls.find(
      (call) => call[0]?.includes('/pulls') && !call[0]?.includes('/pulls/')
    )?.[1];
    const prBody = JSON.parse(prOptions?.body ?? '{}');
    expect(prBody.title ?? '').toContain('My Plugin');
    expect(prBody.title ?? '').toContain('1.0.0');
  });

  it('should handle GitHub auth failure (401)', async () => {
    mockFetch.mockResolvedValueOnce({
      ok: false,
      status: 401,
      json: async () => ({ message: 'Bad credentials' }),
    });

    await expect(createPublisherPr(defaultConfig)).rejects.toThrow(/auth|credentials/i);
  });

  it('should handle GitHub rate limit (403)', async () => {
    mockFetch.mockResolvedValueOnce({
      ok: false,
      status: 403,
      json: async () => ({ message: 'API rate limit exceeded' }),
    });

    await expect(createPublisherPr(defaultConfig)).rejects.toThrow(/rate limit/i);
  });

  it('should handle plugin ID already exists in index.json (conflict)', async () => {
    mockFetch.mockImplementation(async (url: string) => {
      if (url.includes('index.json')) {
        return {
          ok: false,
          status: 422,
          json: async () => ({
            message: 'Validation Failed',
            errors: [{ message: 'Path already exists' }],
          }),
        };
      }
      return { ok: true, json: async () => ({ html_url: 'x', id: 1 }) };
    });

    await expect(createPublisherPr(defaultConfig)).rejects.toThrow(/already exists|conflict/i);
  });

  it('should validate required config fields', async () => {
    await expect(createPublisherPr({ ...defaultConfig, githubToken: '' })).rejects.toThrow(
      /required|missing|token/i
    );
  });

  it('should return PR URL on success', async () => {
    const prUrl = 'https://github.com/org/repo/pull/99';
    mockAllSuccess(prUrl);

    const result = await createPublisherPr(defaultConfig);
    expect(result.url).toBe(prUrl);
  });
});
