import { describe, it, expect } from 'vitest';
import { compareSemver, checkForUpdates } from '../marketplace-updates';
describe('compareSemver', () => {
    it('should return 0 when versions are equal', () => {
        expect(compareSemver('1.0.0', '1.0.0')).toBe(0);
        expect(compareSemver('2.3.4', '2.3.4')).toBe(0);
    });
    it('should return 1 when first version is greater', () => {
        expect(compareSemver('2.0.0', '1.0.0')).toBe(1);
        expect(compareSemver('1.1.0', '1.0.0')).toBe(1);
        expect(compareSemver('1.0.1', '1.0.0')).toBe(1);
    });
    it('should return -1 when first version is less', () => {
        expect(compareSemver('1.0.0', '2.0.0')).toBe(-1);
        expect(compareSemver('1.0.0', '1.1.0')).toBe(-1);
        expect(compareSemver('1.0.0', '1.0.1')).toBe(-1);
    });
    it('should handle multi-digit version numbers', () => {
        expect(compareSemver('10.0.0', '9.0.0')).toBe(1);
        expect(compareSemver('1.10.0', '1.9.0')).toBe(1);
        expect(compareSemver('1.0.10', '1.0.9')).toBe(1);
    });
    it('should handle versions with prerelease/metadata', () => {
        // Simple comparison ignores prerelease — just compare numeric parts
        expect(compareSemver('1.0.0', '1.0.0-alpha')).toBe(0);
        expect(compareSemver('1.0.0+build', '1.0.0')).toBe(0);
    });
});
describe('checkForUpdates', () => {
    const createInstalledPlugin = (pluginId, name, version) => ({
        plugin_id: pluginId,
        manifest: { id: pluginId, name, version },
        status: 'active',
        enabled: true,
        config: {},
    });
    const createMarketplacePlugin = (id, name, version, downloadUrl = `https://example.com/${id}.zip`) => ({
        id,
        name,
        version,
        description: 'Test plugin',
        author: 'Test Author',
        category: 'test',
        tags: [],
        downloadUrl,
        installed: false,
        updateAvailable: false,
    });
    it('should detect when updates are available', () => {
        const installed = [createInstalledPlugin('weather', 'Weather', '1.0.0')];
        const marketplace = [
            createMarketplacePlugin('weather', 'Weather', '2.0.0'),
            createMarketplacePlugin('news', 'News', '1.0.0'),
        ];
        const updates = checkForUpdates(installed, marketplace);
        expect(updates).toHaveLength(1);
        expect(updates[0]).toMatchObject({
            pluginId: 'weather',
            currentVersion: '1.0.0',
            newVersion: '2.0.0',
        });
    });
    it('should not list plugins with same or lower version in marketplace', () => {
        const installed = [createInstalledPlugin('weather', 'Weather', '2.0.0')];
        const marketplace = [
            createMarketplacePlugin('weather', 'Weather', '2.0.0'),
            createMarketplacePlugin('news', 'News', '1.5.0'),
        ];
        const updates = checkForUpdates(installed, marketplace);
        expect(updates).toHaveLength(0);
    });
    it('should skip plugins not in marketplace', () => {
        const installed = [createInstalledPlugin('custom', 'Custom', '1.0.0')];
        const marketplace = [createMarketplacePlugin('weather', 'Weather', '1.0.0')];
        const updates = checkForUpdates(installed, marketplace);
        expect(updates).toHaveLength(0);
    });
    it('should handle empty installed plugins', () => {
        const installed = [];
        const marketplace = [createMarketplacePlugin('weather', 'Weather', '1.0.0')];
        const updates = checkForUpdates(installed, marketplace);
        expect(updates).toHaveLength(0);
    });
    it('should handle empty marketplace', () => {
        const installed = [createInstalledPlugin('weather', 'Weather', '1.0.0')];
        const marketplace = [];
        const updates = checkForUpdates(installed, marketplace);
        expect(updates).toHaveLength(0);
    });
    it('should detect multiple updates', () => {
        const installed = [
            createInstalledPlugin('weather', 'Weather', '1.0.0'),
            createInstalledPlugin('news', 'News', '1.5.0'),
            createInstalledPlugin('sports', 'Sports', '1.0.0'),
        ];
        const marketplace = [
            createMarketplacePlugin('weather', 'Weather', '2.0.0'),
            createMarketplacePlugin('news', 'News', '2.0.0'),
            createMarketplacePlugin('sports', 'Sports', '1.0.0'),
        ];
        const updates = checkForUpdates(installed, marketplace);
        expect(updates).toHaveLength(2);
        expect(updates.map((u) => u.pluginId).sort()).toEqual(['news', 'weather']);
    });
});
//# sourceMappingURL=marketplace-updates.test.js.map