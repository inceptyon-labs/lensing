import { describe, it, expect } from 'vitest';
import { createStaticConnector } from '../static-connector';
describe('Static Connector', () => {
    const config = {
        type: 'static',
        data: {
            title: 'Welcome',
            message: 'Hello from Lensing!',
            version: '1.0.0',
        },
    };
    it('should return data as-is from config', async () => {
        const connector = createStaticConnector(config);
        const result = await connector.fetch();
        expect(result).toEqual({
            title: 'Welcome',
            message: 'Hello from Lensing!',
            version: '1.0.0',
        });
    });
    it('should expose fetch, getCachedResponse, and clearCache methods', () => {
        const connector = createStaticConnector(config);
        expect(connector).toHaveProperty('fetch');
        expect(connector).toHaveProperty('getCachedResponse');
        expect(connector).toHaveProperty('clearCache');
    });
    it('should always return the same data on repeated fetch calls', async () => {
        const connector = createStaticConnector(config);
        const result1 = await connector.fetch();
        const result2 = await connector.fetch();
        expect(result1).toEqual(result2);
    });
    it('should return data from getCachedResponse after fetch', async () => {
        const connector = createStaticConnector(config);
        await connector.fetch();
        const cached = connector.getCachedResponse();
        expect(cached).toEqual(config.data);
    });
    it('should return data from getCachedResponse even without fetch (static data is always available)', () => {
        const connector = createStaticConnector(config);
        const cached = connector.getCachedResponse();
        expect(cached).toEqual(config.data);
    });
    it('should handle clearCache as a no-op (data remains available)', () => {
        const connector = createStaticConnector(config);
        connector.clearCache();
        const cached = connector.getCachedResponse();
        expect(cached).toEqual(config.data);
    });
    it('should handle empty data object', async () => {
        const emptyConfig = {
            type: 'static',
            data: {},
        };
        const connector = createStaticConnector(emptyConfig);
        const result = await connector.fetch();
        expect(result).toEqual({});
    });
    it('should handle nested data structures', async () => {
        const nestedConfig = {
            type: 'static',
            data: {
                user: { name: 'Jason', role: 'admin' },
                items: [1, 2, 3],
            },
        };
        const connector = createStaticConnector(nestedConfig);
        const result = await connector.fetch();
        expect(result).toEqual({
            user: { name: 'Jason', role: 'admin' },
            items: [1, 2, 3],
        });
    });
});
//# sourceMappingURL=static-connector.test.js.map