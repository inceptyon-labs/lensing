import { describe, it, expect } from 'vitest';
describe('@lensing/types', () => {
    it('exports PluginManifest type with required fields', () => {
        const manifest = {
            id: 'weather',
            name: 'Weather',
            version: '1.0.0',
        };
        expect(manifest.id).toBe('weather');
        expect(manifest.name).toBe('Weather');
        expect(manifest.version).toBe('1.0.0');
    });
    it('exports PluginManifest with optional fields', () => {
        const manifest = {
            id: 'weather',
            name: 'Weather',
            version: '1.0.0',
            ui_entry: './dist/widget.js',
            server_entry: './dist/server.js',
            permissions: {
                allowed_domains: ['api.openweathermap.org'],
                max_refresh_ms: 60000,
                secrets: ['WEATHER_API_KEY'],
            },
            widget_sizes: ['small', 'medium', 'large'],
            dependencies: ['calendar'],
        };
        expect(manifest.ui_entry).toBe('./dist/widget.js');
        expect(manifest.permissions?.allowed_domains).toContain('api.openweathermap.org');
        expect(manifest.dependencies).toContain('calendar');
    });
    it('exports ZoneName type with valid zone names', () => {
        const zones = ['top-bar', 'left-col', 'center', 'right-col', 'bottom-bar'];
        expect(zones).toHaveLength(5);
    });
    it('exports NotificationPriority type', () => {
        const priorities = ['info', 'warning', 'urgent'];
        expect(priorities).toHaveLength(3);
    });
    it('exports SceneName type', () => {
        const scenes = ['morning', 'evening', 'ambient', 'focus', 'alert'];
        expect(scenes).toHaveLength(5);
    });
    it('exports DataBusMessage with generic type', () => {
        const msg = {
            channel: 'weather.current',
            data: { temp: 72 },
            timestamp: new Date().toISOString(),
            plugin_id: 'weather',
        };
        expect(msg.channel).toBe('weather.current');
        expect(msg.data.temp).toBe(72);
    });
    it('exports PluginInstance with all fields', () => {
        const instance = {
            id: 'weather',
            manifest: { id: 'weather', name: 'Weather', version: '1.0.0' },
            status: 'active',
            last_refresh: new Date().toISOString(),
        };
        expect(instance.status).toBe('active');
    });
    it('exports WidgetSize type', () => {
        const sizes = ['small', 'medium', 'large'];
        expect(sizes).toHaveLength(3);
    });
    it('exports NotificationEntry with read/dismissed tracking', () => {
        const entry = {
            id: 'n1',
            source: 'weather',
            priority: 'info',
            title: 'Rain expected',
            created_at: new Date().toISOString(),
            read: false,
            dismissed: false,
        };
        expect(entry.read).toBe(false);
        expect(entry.dismissed).toBe(false);
    });
    it('exports QuietHours with start/end hours', () => {
        const hours = { start: 22, end: 7 };
        expect(hours.start).toBe(22);
        expect(hours.end).toBe(7);
    });
    it('exports NotificationFilter with optional criteria', () => {
        const filter = { priority: 'urgent', read: false };
        expect(filter.priority).toBe('urgent');
        expect(filter.source).toBeUndefined();
    });
    it('exports PluginHealthReport with all fields', () => {
        const report = {
            pluginId: 'weather',
            status: 'active',
            lastRefreshAt: new Date().toISOString(),
            nextRefreshAt: new Date(Date.now() + 60000).toISOString(),
            errorCount: 0,
            errors: [],
            refreshCount: 42,
            resourceUsage: { cpuMs: 123, memoryBytes: 2048000 },
        };
        expect(report.pluginId).toBe('weather');
        expect(report.status).toBe('active');
        expect(report.errorCount).toBe(0);
        expect(report.resourceUsage.memoryBytes).toBe(2048000);
    });
    it('exports SystemHealthSnapshot with system metrics', () => {
        const snapshot = {
            cpuPercent: 45.2,
            memoryUsedBytes: 512000000,
            memoryTotalBytes: 2000000000,
            diskUsedBytes: 10000000000,
            diskTotalBytes: 100000000000,
            chromiumMemoryBytes: 250000000,
            timestamp: new Date().toISOString(),
        };
        expect(snapshot.cpuPercent).toBe(45.2);
        expect(snapshot.memoryUsedBytes).toBeGreaterThan(0);
        expect(snapshot.diskTotalBytes).toBeGreaterThan(snapshot.diskUsedBytes);
    });
    it('exports ConnectivityStatus with online/latency tracking', () => {
        const status = {
            online: true,
            latencyMs: 25,
            lastCheckAt: new Date().toISOString(),
        };
        expect(status.online).toBe(true);
        expect(status.latencyMs).toBeGreaterThanOrEqual(0);
    });
    it('exports ResourceBudgetViolation with violation details', () => {
        const violation = {
            pluginId: 'weather',
            violationType: 'cpu_burst',
            limit: 500,
            actual: 750,
            timestamp: new Date().toISOString(),
        };
        expect(violation.pluginId).toBe('weather');
        expect(violation.actual).toBeGreaterThan(violation.limit);
    });
    it('exports HealthStoreState with aggregate data', () => {
        const state = {
            plugins: new Map([
                [
                    'weather',
                    {
                        pluginId: 'weather',
                        status: 'active',
                        lastRefreshAt: new Date().toISOString(),
                        nextRefreshAt: new Date().toISOString(),
                        errorCount: 0,
                        errors: [],
                        refreshCount: 10,
                        resourceUsage: { cpuMs: 100, memoryBytes: 1000000 },
                    },
                ],
            ]),
            system: {
                cpuPercent: 30,
                memoryUsedBytes: 500000000,
                memoryTotalBytes: 2000000000,
                diskUsedBytes: 10000000000,
                diskTotalBytes: 100000000000,
                chromiumMemoryBytes: 200000000,
                timestamp: new Date().toISOString(),
            },
            connectivity: { online: true, latencyMs: 15, lastCheckAt: new Date().toISOString() },
            violations: [],
        };
        expect(state.plugins.size).toBe(1);
        expect(state.connectivity.online).toBe(true);
        expect(state.violations).toHaveLength(0);
    });
    it('exports MarketplaceIndex with optional lastFetchTime field', () => {
        // MarketplaceIndex should support optional lastFetchTime field for offline caching
        const mockPlugin = {
            id: 'test',
            name: 'Test',
            description: 'Test plugin',
            version: '1.0.0',
            author: 'test-author',
            category: 'general',
            tags: ['test'],
            downloadUrl: 'http://example.com/test.zip',
            installed: false,
            updateAvailable: false,
        };
        // Should work without lastFetchTime (backward compatibility)
        const index1 = {
            version: '1.0.0',
            plugins: [mockPlugin],
        };
        expect(index1.version).toBe('1.0.0');
        expect(index1.plugins).toHaveLength(1);
        // Should also work with lastFetchTime for offline fallback
        const index2 = {
            version: '1.0.0',
            plugins: [mockPlugin],
            lastFetchTime: Date.now(),
        };
        expect(index2.lastFetchTime).toBeDefined();
        expect(typeof index2.lastFetchTime).toBe('number');
    });
});
//# sourceMappingURL=index.test.js.map