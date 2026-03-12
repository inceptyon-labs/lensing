import type { PluginManifest, PluginPermissions } from '@lensing/types';
/** Permission violation record for audit trail */
export interface PermissionViolation {
    plugin_id: string;
    type: 'network' | 'refresh_rate' | 'secret_access';
    timestamp: string;
    details: string;
}
/** Options for permission enforcer */
export interface EnforcerOptions {
    onViolation?: (violation: PermissionViolation) => void;
}
/** Result of refresh rate validation */
export interface RefreshValidation {
    allowed: boolean;
    retryAfter?: number;
}
/**
 * Validates that a network URL is in the plugin's allowed domains list
 */
export declare function validateNetworkDomain(url: string, permissions: PluginPermissions): boolean;
/**
 * Validates that a refresh operation respects the plugin's rate limit
 */
export declare function validateRefreshRate(lastRefreshMs: number | undefined, permissions: PluginPermissions): boolean;
/**
 * Validates that a secret name is in the plugin's allowed secrets list
 */
export declare function validateSecretAccess(secretName: string, permissions: PluginPermissions): boolean;
/**
 * Creates a permission enforcer for a plugin instance
 * Enforces permissions at the host level before plugin receives any APIs
 */
export declare function createPermissionEnforcer(manifest: PluginManifest, options?: EnforcerOptions): {
    /**
     * Creates a proxied fetch function that enforces domain restrictions
     */
    createFetchProxy(originalFetch?: typeof fetch): typeof fetch;
    /**
     * Validates a data refresh operation against rate limit
     */
    validateRefresh(lastRefreshMs?: number): RefreshValidation;
    /**
     * Filters secrets to only those declared in plugin manifest
     * Returns only authorized secrets; records violations for unauthorized access attempts
     */
    getAuthorizedSecrets(availableSecrets: Record<string, string>): Record<string, string>;
    /**
     * INTERNAL ONLY: Used by tests and admin panel
     * Plugins should NOT have access to this
     */
    getManifestPermissions(): PluginPermissions;
    /** Access violation history (for admin panel) */
    getViolations(): PermissionViolation[];
    /** Clear violation history */
    clearViolations(): void;
};
/** Type of enforcer instance for type safety */
export type PluginEnforcer = ReturnType<typeof createPermissionEnforcer>;
//# sourceMappingURL=plugin-permissions.d.ts.map