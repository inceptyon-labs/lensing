import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { createAllergiesServer } from '../allergies-server';
// ── Mock helpers ───────────────────────────────────────────────────────────
function createMockDataBus() {
    return {
        publish: vi.fn(),
        subscribe: vi.fn(() => () => { }),
        getLatest: vi.fn(),
        getChannels: vi.fn(() => []),
        onMessage: vi.fn(() => () => { }),
        clear: vi.fn(),
        close: vi.fn(),
    };
}
function createMockNotifications() {
    return {
        emit: vi.fn(() => 'notification-1'),
        list: vi.fn(() => []),
        markRead: vi.fn(),
        dismiss: vi.fn(),
        clear: vi.fn(),
        emitSystemEvent: vi.fn(() => 'system-event-1'),
        onNotification: vi.fn(() => () => { }),
        close: vi.fn(),
    };
}
function createMockFetch(response) {
    return vi.fn().mockResolvedValue({
        ok: true,
        status: 200,
        json: async () => response,
    });
}
function createMockPollenResponse(todayIndex = 5.5) {
    return {
        Type: 'pollen',
        ForecastDate: '2026-03-05T00:00:00-05:00',
        Location: {
            ZIP: '90210',
            City: 'BEVERLY HILLS',
            State: 'CA',
            DisplayLocation: 'Beverly Hills, CA',
            periods: [
                {
                    Triggers: [{ LGID: 22, Name: 'Alder', Genus: 'Alnus', PlantType: 'Tree' }],
                    Period: '0001-01-01T00:00:00',
                    Type: 'Yesterday',
                    Index: 4.2,
                },
                {
                    Triggers: [
                        { LGID: 22, Name: 'Alder', Genus: 'Alnus', PlantType: 'Tree' },
                        { LGID: 272, Name: 'Juniper', Genus: 'Juniperus', PlantType: 'Tree' },
                    ],
                    Period: '0001-01-01T00:00:00',
                    Type: 'Today',
                    Index: todayIndex,
                },
                {
                    Triggers: [{ LGID: 103, Name: 'Ash', Genus: 'Fraxinus', PlantType: 'Tree' }],
                    Period: '0001-01-01T00:00:00',
                    Type: 'Tomorrow',
                    Index: 6.1,
                },
            ],
        },
    };
}
// ── Tests ──────────────────────────────────────────────────────────────────
describe('Allergies Server (pollen.com)', () => {
    let dataBus;
    let notifications;
    let server;
    beforeEach(() => {
        dataBus = createMockDataBus();
        notifications = createMockNotifications();
        vi.useFakeTimers();
    });
    afterEach(() => {
        server?.close();
        vi.useRealTimers();
    });
    function createServer(overrides = {}) {
        server = createAllergiesServer({
            zipCode: '90210',
            dataBus,
            notifications,
            fetchFn: createMockFetch(createMockPollenResponse()),
            ...overrides,
        });
        return server;
    }
    describe('Configuration', () => {
        it('should require zipCode', () => {
            expect(() => {
                createAllergiesServer({
                    zipCode: '',
                    dataBus,
                    notifications,
                });
            }).toThrow('zipCode is required');
        });
        it('should reject non-5-digit zip codes', () => {
            expect(() => {
                createAllergiesServer({
                    zipCode: '1234',
                    dataBus,
                    notifications,
                });
            }).toThrow('zipCode is required');
        });
        it('should accept valid 5-digit zip code', () => {
            expect(() => {
                createServer({ zipCode: '10001' });
            }).not.toThrow();
        });
        it('should accept alertThreshold option', () => {
            const s = createServer({ alertThreshold: 9.7 });
            expect(s).toBeDefined();
            s.close();
        });
    });
    describe('Data Fetching', () => {
        it('should fetch and transform pollen data', async () => {
            const server = createServer();
            await server.refresh();
            const data = server.getAllergyData();
            expect(data).not.toBeNull();
            expect(data?.index).toBe(5.5);
            expect(data?.level).toBe('Medium');
            expect(data?.color).toBe('#ffeb3b');
            expect(data?.location).toBe('Beverly Hills, CA');
            expect(data?.triggers).toHaveLength(2);
            expect(data?.triggers[0].name).toBe('Alder');
            expect(data?.triggers[0].plantType).toBe('Tree');
        });
        it('should include all three periods', async () => {
            const server = createServer();
            await server.refresh();
            const data = server.getAllergyData();
            expect(data?.periods).toHaveLength(3);
            expect(data?.periods[0].type).toBe('Yesterday');
            expect(data?.periods[1].type).toBe('Today');
            expect(data?.periods[2].type).toBe('Tomorrow');
        });
        it('should fetch from correct API endpoint with headers', async () => {
            const fetchFn = createMockFetch(createMockPollenResponse());
            const server = createServer({ fetchFn });
            await server.refresh();
            expect(fetchFn).toHaveBeenCalled();
            const url = fetchFn.mock.calls[0][0];
            expect(url).toBe('https://www.pollen.com/api/forecast/current/pollen/90210');
            const init = fetchFn.mock.calls[0][1];
            expect(init.headers.Referer).toContain('pollen.com');
            expect(init.headers['User-Agent']).toBeDefined();
        });
        it('should handle fetch errors gracefully', async () => {
            const fetchFn = vi.fn().mockRejectedValue(new Error('Network error'));
            const onError = vi.fn();
            const server = createServer({ fetchFn });
            server.onError(onError);
            await server.refresh();
            expect(onError).toHaveBeenCalled();
            expect(onError.mock.calls[0][0]).toContain('Network error');
        });
        it('should handle HTTP error responses', async () => {
            const fetchFn = vi.fn().mockResolvedValue({
                ok: false,
                status: 403,
                statusText: 'Forbidden',
            });
            const onError = vi.fn();
            const server = createServer({ fetchFn });
            server.onError(onError);
            await server.refresh();
            expect(onError).toHaveBeenCalled();
            expect(onError.mock.calls[0][0]).toContain('403');
        });
        it('should handle malformed JSON responses', async () => {
            const fetchFn = vi.fn().mockResolvedValue({
                ok: true,
                json: async () => {
                    throw new Error('Invalid JSON');
                },
            });
            const onError = vi.fn();
            const server = createServer({ fetchFn });
            server.onError(onError);
            await server.refresh();
            expect(onError).toHaveBeenCalled();
        });
        it('should handle missing Location in response', async () => {
            const fetchFn = createMockFetch({ Type: 'pollen' });
            const onError = vi.fn();
            const server = createServer({ fetchFn });
            server.onError(onError);
            await server.refresh();
            expect(onError).toHaveBeenCalled();
            expect(onError.mock.calls[0][0]).toContain('Location');
        });
    });
    describe('Severity Levels', () => {
        it('should classify Low (0-2.4)', async () => {
            const server = createServer({
                fetchFn: createMockFetch(createMockPollenResponse(1.5)),
            });
            await server.refresh();
            expect(server.getAllergyData()?.level).toBe('Low');
            expect(server.getAllergyData()?.color).toBe('#4caf50');
        });
        it('should classify Low-Medium (2.5-4.8)', async () => {
            const server = createServer({
                fetchFn: createMockFetch(createMockPollenResponse(3.5)),
            });
            await server.refresh();
            expect(server.getAllergyData()?.level).toBe('Low-Medium');
        });
        it('should classify Medium (4.9-7.2)', async () => {
            const server = createServer({
                fetchFn: createMockFetch(createMockPollenResponse(6.0)),
            });
            await server.refresh();
            expect(server.getAllergyData()?.level).toBe('Medium');
        });
        it('should classify Medium-High (7.3-9.6)', async () => {
            const server = createServer({
                fetchFn: createMockFetch(createMockPollenResponse(8.5)),
            });
            await server.refresh();
            expect(server.getAllergyData()?.level).toBe('Medium-High');
        });
        it('should classify High (9.7-12)', async () => {
            const server = createServer({
                fetchFn: createMockFetch(createMockPollenResponse(10.5)),
            });
            await server.refresh();
            expect(server.getAllergyData()?.level).toBe('High');
            expect(server.getAllergyData()?.color).toBe('#f44336');
        });
    });
    describe('Data Bus Publishing', () => {
        it('should publish pollen data to data bus', async () => {
            const server = createServer();
            await server.refresh();
            expect(dataBus.publish.mock.calls.length).toBeGreaterThan(0);
            const publishCall = dataBus.publish.mock.calls[0];
            expect(publishCall[0]).toBe('allergies.current');
        });
        it('should include pollen data in publication', async () => {
            const server = createServer();
            await server.refresh();
            const publishCall = dataBus.publish.mock.calls[0];
            const data = publishCall[2];
            expect(data.index).toBe(5.5);
            expect(data.triggers).toBeDefined();
            expect(data.periods).toBeDefined();
        });
    });
    describe('Alert Notifications', () => {
        it('should emit alert when index exceeds threshold', async () => {
            const server = createServer({
                fetchFn: createMockFetch(createMockPollenResponse(9.0)),
                alertThreshold: 7.3,
            });
            await server.refresh();
            expect(notifications.emit.mock.calls.length).toBeGreaterThan(0);
        });
        it('should not emit alert when index below threshold', async () => {
            const server = createServer({
                fetchFn: createMockFetch(createMockPollenResponse(3.0)),
                alertThreshold: 7.3,
            });
            await server.refresh();
            expect(notifications.emit.mock.calls.length).toBe(0);
        });
        it('should use default alert threshold of 7.3', async () => {
            const server = createServer({
                fetchFn: createMockFetch(createMockPollenResponse(8.0)),
            }); // no alertThreshold
            await server.refresh();
            expect(notifications.emit.mock.calls.length).toBeGreaterThan(0);
        });
        it('should set urgent priority for High level', async () => {
            const server = createServer({
                fetchFn: createMockFetch(createMockPollenResponse(10.5)),
                alertThreshold: 7.3,
            });
            await server.refresh();
            const emitCall = notifications.emit.mock.calls[0][0];
            expect(emitCall.priority).toBe('urgent');
        });
    });
    describe('Callbacks', () => {
        it('should call onUpdate when data arrives', async () => {
            const onUpdate = vi.fn();
            const server = createServer();
            server.onUpdate(onUpdate);
            await server.refresh();
            expect(onUpdate).toHaveBeenCalled();
            const data = onUpdate.mock.calls[0][0];
            expect(data.index).toBe(5.5);
        });
        it('should isolate callback errors', async () => {
            const errorCallback = vi.fn(() => {
                throw new Error('Callback error');
            });
            const server = createServer();
            server.onUpdate(errorCallback);
            expect(() => server.refresh()).not.toThrow();
        });
        it('should return unsubscribe function from onUpdate', async () => {
            const onUpdate = vi.fn();
            const server = createServer();
            const unsubscribe = server.onUpdate(onUpdate);
            unsubscribe();
            await server.refresh();
            expect(onUpdate).not.toHaveBeenCalled();
        });
    });
    describe('Caching', () => {
        it('should not refetch if cache is fresh', async () => {
            const fetchFn = createMockFetch(createMockPollenResponse());
            const server = createServer({ fetchFn, maxStale_ms: 3600000 });
            await server.refresh();
            expect(fetchFn).toHaveBeenCalledTimes(1);
            await server.refresh();
            expect(fetchFn).toHaveBeenCalledTimes(1); // no second call
        });
        it('should refetch if cache is stale', async () => {
            const fetchFn = createMockFetch(createMockPollenResponse());
            const server = createServer({ fetchFn, maxStale_ms: 1000 });
            await server.refresh();
            expect(fetchFn).toHaveBeenCalledTimes(1);
            vi.advanceTimersByTime(2000);
            await server.refresh();
            expect(fetchFn).toHaveBeenCalledTimes(2);
        });
        it('should return null until first fetch', () => {
            const server = createServer();
            expect(server.getAllergyData()).toBeNull();
        });
    });
    describe('Lifecycle', () => {
        it('should close cleanly', () => {
            const server = createServer();
            expect(() => server.close()).not.toThrow();
        });
        it('should ignore refresh after close', async () => {
            const fetchFn = createMockFetch(createMockPollenResponse());
            const server = createServer({ fetchFn });
            server.close();
            await server.refresh();
            expect(fetchFn).not.toHaveBeenCalled();
        });
    });
    describe('Data isolation', () => {
        it('should not corrupt internal cache when published data is mutated', async () => {
            let publishedData;
            const mockDataBus = createMockDataBus();
            mockDataBus.publish.mockImplementation((_channel, _source, data) => {
                publishedData = data;
            });
            const server = createAllergiesServer({
                zipCode: '90210',
                dataBus: mockDataBus,
                notifications,
                fetchFn: createMockFetch(createMockPollenResponse()),
            });
            await server.refresh();
            // Mutate published data
            publishedData.index = 99;
            publishedData.triggers[0].name = 'MUTATED';
            // Internal cache should be unaffected
            const cached = server.getAllergyData();
            expect(cached?.index).toBe(5.5);
            expect(cached?.triggers[0].name).toBe('Alder');
        });
    });
});
//# sourceMappingURL=allergies-server.test.js.map