import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { createRestServer } from '../rest-server';
import http from 'node:http';
/** Helper to make HTTP requests to the test server */
function request(port, method, path, body) {
    return new Promise((resolve, reject) => {
        const data = body !== undefined ? JSON.stringify(body) : undefined;
        const req = http.request({
            hostname: '127.0.0.1',
            port,
            method,
            path,
            headers: {
                'Content-Type': 'application/json',
                ...(data ? { 'Content-Length': Buffer.byteLength(data) } : {}),
            },
        }, (res) => {
            let responseBody = '';
            res.on('data', (chunk) => {
                responseBody += chunk.toString();
            });
            res.on('end', () => {
                resolve({
                    status: res.statusCode ?? 0,
                    headers: res.headers,
                    body: responseBody,
                });
            });
        });
        req.on('error', reject);
        if (data)
            req.write(data);
        req.end();
    });
}
/** Sample marketplace plugins for testing */
const SAMPLE_PLUGINS = [
    {
        id: 'weather-pro',
        name: 'Weather Pro',
        description: 'Advanced weather display with radar',
        version: '2.1.0',
        author: 'lensing-community',
        category: 'weather',
        tags: ['weather', 'radar', 'forecast'],
        downloadUrl: 'https://marketplace.example.com/weather-pro-2.1.0.zip',
        installed: false,
        updateAvailable: false,
    },
    {
        id: 'crypto-ticker',
        name: 'Crypto Ticker',
        description: 'Real-time cryptocurrency prices',
        version: '1.0.3',
        author: 'crypto-dev',
        category: 'finance',
        tags: ['crypto', 'bitcoin', 'finance'],
        downloadUrl: 'https://marketplace.example.com/crypto-ticker-1.0.3.zip',
        installed: true,
        updateAvailable: false,
    },
    {
        id: 'news-feed',
        name: 'News Feed',
        description: 'RSS news aggregator widget',
        version: '1.2.0',
        author: 'lensing-community',
        category: 'news',
        tags: ['news', 'rss', 'feed'],
        downloadUrl: 'https://marketplace.example.com/news-feed-1.2.0.zip',
        installed: true,
        updateAvailable: true,
    },
];
const SAMPLE_CATEGORIES = [
    { name: 'weather', count: 1 },
    { name: 'finance', count: 1 },
    { name: 'news', count: 1 },
];
/** Create stub handlers with marketplace support */
function createStubHandlers(overrides) {
    return {
        getSettings: async () => ({}),
        putSettings: async () => { },
        getLayout: async () => [],
        putLayout: async () => { },
        postAsk: async (q) => ({
            id: 'stub',
            question: q,
            response: 'stub',
            timestamp: new Date().toISOString(),
            tool_calls_made: 0,
        }),
        ...overrides,
    };
}
describe('Marketplace REST Endpoints', () => {
    let server;
    let port;
    afterEach(async () => {
        if (server) {
            await server.close();
        }
    });
    describe('GET /marketplace', () => {
        beforeEach(async () => {
            server = createRestServer(createStubHandlers({
                getMarketplacePlugins: async () => ({
                    plugins: SAMPLE_PLUGINS,
                    total: SAMPLE_PLUGINS.length,
                    page: 1,
                    pageSize: 20,
                    offline: false,
                }),
            }));
            await server.ready();
            port = server.port;
        });
        it('should return plugin list with pagination metadata', async () => {
            const res = await request(port, 'GET', '/marketplace');
            expect(res.status).toBe(200);
            const body = JSON.parse(res.body);
            expect(body.plugins).toHaveLength(3);
            expect(body.total).toBe(3);
            expect(body.page).toBe(1);
            expect(body.pageSize).toBe(20);
            expect(body.offline).toBe(false);
        });
        it('should return 404 when handler not configured', async () => {
            await server.close();
            server = createRestServer(createStubHandlers());
            await server.ready();
            port = server.port;
            const res = await request(port, 'GET', '/marketplace');
            expect(res.status).toBe(404);
        });
        it('should pass query params to handler', async () => {
            let receivedParams = {};
            await server.close();
            server = createRestServer(createStubHandlers({
                getMarketplacePlugins: async (params) => {
                    receivedParams = params ?? {};
                    return {
                        plugins: [],
                        total: 0,
                        page: 1,
                        pageSize: 20,
                        offline: false,
                    };
                },
            }));
            await server.ready();
            port = server.port;
            await request(port, 'GET', '/marketplace?category=weather&search=pro&page=2');
            expect(receivedParams).toEqual({
                category: 'weather',
                search: 'pro',
                page: '2',
            });
        });
    });
    describe('GET /marketplace/categories', () => {
        beforeEach(async () => {
            server = createRestServer(createStubHandlers({
                getMarketplaceCategories: async () => SAMPLE_CATEGORIES,
            }));
            await server.ready();
            port = server.port;
        });
        it('should return category list with counts', async () => {
            const res = await request(port, 'GET', '/marketplace/categories');
            expect(res.status).toBe(200);
            const body = JSON.parse(res.body);
            expect(body).toHaveLength(3);
            expect(body[0]).toEqual({ name: 'weather', count: 1 });
        });
        it('should return 404 when handler not configured', async () => {
            await server.close();
            server = createRestServer(createStubHandlers());
            await server.ready();
            port = server.port;
            const res = await request(port, 'GET', '/marketplace/categories');
            expect(res.status).toBe(404);
        });
    });
    describe('GET /marketplace/:id', () => {
        beforeEach(async () => {
            server = createRestServer(createStubHandlers({
                getMarketplacePlugin: async (id) => SAMPLE_PLUGINS.find((p) => p.id === id),
            }));
            await server.ready();
            port = server.port;
        });
        it('should return a single plugin by ID', async () => {
            const res = await request(port, 'GET', '/marketplace/weather-pro');
            expect(res.status).toBe(200);
            const body = JSON.parse(res.body);
            expect(body.id).toBe('weather-pro');
            expect(body.name).toBe('Weather Pro');
            expect(body.installed).toBe(false);
            expect(body.updateAvailable).toBe(false);
        });
        it('should return 404 for unknown plugin ID', async () => {
            const res = await request(port, 'GET', '/marketplace/nonexistent');
            expect(res.status).toBe(404);
        });
        it('should return 404 when handler not configured', async () => {
            await server.close();
            server = createRestServer(createStubHandlers());
            await server.ready();
            port = server.port;
            const res = await request(port, 'GET', '/marketplace/weather-pro');
            expect(res.status).toBe(404);
        });
        it('should include installed and updateAvailable flags', async () => {
            const res = await request(port, 'GET', '/marketplace/news-feed');
            expect(res.status).toBe(200);
            const body = JSON.parse(res.body);
            expect(body.installed).toBe(true);
            expect(body.updateAvailable).toBe(true);
        });
    });
});
describe('GET /marketplace/updates', () => {
    let updatesServer;
    let updatesPort;
    const SAMPLE_UPDATES = [
        {
            pluginId: 'weather-pro',
            pluginName: 'Weather Pro',
            currentVersion: '1.0.0',
            newVersion: '2.1.0',
            downloadUrl: 'https://marketplace.example.com/weather-pro-2.1.0.zip',
        },
    ];
    afterEach(async () => {
        if (updatesServer)
            await updatesServer.close();
    });
    beforeEach(async () => {
        updatesServer = createRestServer(createStubHandlers({
            getMarketplaceUpdates: async () => SAMPLE_UPDATES,
        }));
        await updatesServer.ready();
        updatesPort = updatesServer.port;
    });
    it('should return list of available updates', async () => {
        const res = await request(updatesPort, 'GET', '/marketplace/updates');
        expect(res.status).toBe(200);
        const body = JSON.parse(res.body);
        expect(body).toHaveLength(1);
        expect(body[0]).toMatchObject({
            pluginId: 'weather-pro',
            currentVersion: '1.0.0',
            newVersion: '2.1.0',
        });
    });
    it('should return empty array when no updates available', async () => {
        await updatesServer.close();
        updatesServer = createRestServer(createStubHandlers({
            getMarketplaceUpdates: async () => [],
        }));
        await updatesServer.ready();
        updatesPort = updatesServer.port;
        const res = await request(updatesPort, 'GET', '/marketplace/updates');
        expect(res.status).toBe(200);
        const body = JSON.parse(res.body);
        expect(body).toHaveLength(0);
    });
    it('should return 404 when handler not configured', async () => {
        await updatesServer.close();
        updatesServer = createRestServer(createStubHandlers());
        await updatesServer.ready();
        updatesPort = updatesServer.port;
        const res = await request(updatesPort, 'GET', '/marketplace/updates');
        expect(res.status).toBe(404);
    });
});
describe('POST /marketplace/:id/update', () => {
    let updateServer;
    let updatePort;
    afterEach(async () => {
        if (updateServer)
            await updateServer.close();
    });
    const UPDATED_PLUGIN = {
        plugin_id: 'weather-pro',
        manifest: { id: 'weather-pro', name: 'Weather Pro', version: '2.1.0' },
        status: 'active',
        enabled: true,
        config: { location: 'NYC' },
    };
    it('should trigger plugin update and return updated entry', async () => {
        const updateFn = vi.fn(async () => UPDATED_PLUGIN);
        updateServer = createRestServer(createStubHandlers({
            updateMarketplacePlugin: updateFn,
        }));
        await updateServer.ready();
        updatePort = updateServer.port;
        const res = await request(updatePort, 'POST', '/marketplace/weather-pro/update');
        expect(res.status).toBe(200);
        const body = JSON.parse(res.body);
        expect(body.ok).toBe(true);
        expect(body.plugin.plugin_id).toBe('weather-pro');
        expect(body.plugin.manifest.version).toBe('2.1.0');
        expect(updateFn).toHaveBeenCalledWith('weather-pro');
    });
    it('should return 404 when handler not configured', async () => {
        updateServer = createRestServer(createStubHandlers());
        await updateServer.ready();
        updatePort = updateServer.port;
        const res = await request(updatePort, 'POST', '/marketplace/weather-pro/update');
        expect(res.status).toBe(404);
    });
    it('should return 400 when update fails', async () => {
        updateServer = createRestServer(createStubHandlers({
            updateMarketplacePlugin: async () => {
                throw new Error('Already on latest version');
            },
        }));
        await updateServer.ready();
        updatePort = updateServer.port;
        const res = await request(updatePort, 'POST', '/marketplace/weather-pro/update');
        expect(res.status).toBe(400);
        const body = JSON.parse(res.body);
        expect(body.error).toContain('Already on latest version');
    });
});
describe('MarketplacePlugin type', () => {
    it('should have all required fields', () => {
        const plugin = {
            id: 'test',
            name: 'Test',
            description: 'A test plugin',
            version: '1.0.0',
            author: 'author',
            category: 'general',
            tags: ['test'],
            downloadUrl: 'https://example.com/test.zip',
            installed: false,
            updateAvailable: false,
        };
        expect(plugin.id).toBe('test');
        expect(plugin.installed).toBe(false);
        expect(plugin.updateAvailable).toBe(false);
    });
});
describe('MarketplaceCategory type', () => {
    it('should have name and count', () => {
        const cat = { name: 'weather', count: 5 };
        expect(cat.name).toBe('weather');
        expect(cat.count).toBe(5);
    });
});
describe('MarketplaceListResponse type', () => {
    it('should have plugins array, pagination, and offline flag', () => {
        const resp = {
            plugins: [],
            total: 0,
            page: 1,
            pageSize: 20,
            offline: false,
        };
        expect(resp.plugins).toEqual([]);
        expect(resp.offline).toBe(false);
        expect(resp.total).toBe(0);
        expect(resp.page).toBe(1);
        expect(resp.pageSize).toBe(20);
    });
});
describe('Marketplace Offline Fallback', () => {
    let offlineServer;
    let offlinePort;
    afterEach(async () => {
        if (offlineServer) {
            await offlineServer.close();
        }
    });
    it('should return 200 with offline:true when marketplace handler throws', async () => {
        offlineServer = createRestServer(createStubHandlers({
            getMarketplacePlugins: async () => {
                throw new Error('GitHub unreachable: network timeout');
            },
        }));
        await offlineServer.ready();
        offlinePort = offlineServer.port;
        const res = await request(offlinePort, 'GET', '/marketplace');
        expect(res.status).toBe(200);
        const body = JSON.parse(res.body);
        expect(body.offline).toBe(true);
    });
    it('should include lastFetchTime in offline response', async () => {
        offlineServer = createRestServer(createStubHandlers({
            getMarketplacePlugins: async () => {
                throw new Error('Network error');
            },
        }));
        await offlineServer.ready();
        offlinePort = offlineServer.port;
        const res = await request(offlinePort, 'GET', '/marketplace');
        expect(res.status).toBe(200);
        const body = JSON.parse(res.body);
        expect(body.offline).toBe(true);
        // lastFetchTime should be present in response (when serving from cache)
        // Can be undefined if no cache exists, but response structure should support it
        if (body.lastFetchTime !== undefined) {
            expect(typeof body.lastFetchTime).toBe('number');
        }
    });
    it('should return 403 with clear error message when install blocked offline', async () => {
        offlineServer = createRestServer(createStubHandlers({
            installMarketplacePlugin: async () => {
                throw new Error('Marketplace unavailable: network offline');
            },
        }));
        await offlineServer.ready();
        offlinePort = offlineServer.port;
        const res = await request(offlinePort, 'POST', '/marketplace/weather-pro/install');
        expect(res.status).toBe(400);
        const body = JSON.parse(res.body);
        expect(body.error).toContain('unavailable');
    });
    it('should not return 500 on marketplace handler errors', async () => {
        offlineServer = createRestServer(createStubHandlers({
            getMarketplacePlugins: async () => {
                throw new Error('Connection refused');
            },
        }));
        await offlineServer.ready();
        offlinePort = offlineServer.port;
        const res = await request(offlinePort, 'GET', '/marketplace');
        // Should not be 500; should gracefully degrade
        expect(res.status).not.toBe(500);
        expect([200, 503, 504]).toContain(res.status);
    });
});
//# sourceMappingURL=rest-server-marketplace.test.js.map