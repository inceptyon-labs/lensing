import { describe, it, expect } from 'vitest';
import { createConfigTransfer, CURRENT_CONFIG_VERSION } from '@lensing/core';
describe('Config Transfer Integration', () => {
    it('should export createConfigTransfer from @lensing/core', () => {
        expect(typeof createConfigTransfer).toBe('function');
    });
    it('should export CURRENT_CONFIG_VERSION from @lensing/core', () => {
        expect(CURRENT_CONFIG_VERSION).toBe(1);
    });
    it('should export ConfigTransferInstance type (type-only check)', () => {
        const instance = {
            exportConfig: async () => ({}),
            importConfig: async () => ({ success: true, migrationsApplied: 0 }),
            resetConfig: async () => { },
        };
        expect(typeof instance.exportConfig).toBe('function');
        expect(typeof instance.importConfig).toBe('function');
        expect(typeof instance.resetConfig).toBe('function');
    });
});
//# sourceMappingURL=config-transfer-integration.test.js.map