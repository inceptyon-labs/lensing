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
  retryAfter?: number; // milliseconds to wait before retry
}

/**
 * Validates that a network URL is in the plugin's allowed domains list
 */
export function validateNetworkDomain(url: string, permissions: PluginPermissions): boolean {
  // If no domain restrictions, allow all
  if (!permissions.allowed_domains || permissions.allowed_domains.length === 0) {
    return true;
  }

  try {
    const urlObj = new URL(url);
    const hostname = urlObj.hostname;

    // Check if hostname matches any allowed domain
    return permissions.allowed_domains.some((domain) => {
      // Exact match
      if (hostname === domain) {
        return true;
      }

      // Subdomain match (e.g., api.example.com matches *.example.com if domain is example.com)
      if (hostname.endsWith('.' + domain)) {
        return true;
      }

      return false;
    });
  } catch {
    // Invalid URL - block by default
    return false;
  }
}

/**
 * Validates that a refresh operation respects the plugin's rate limit
 */
export function validateRefreshRate(
  lastRefreshMs: number | undefined,
  permissions: PluginPermissions
): boolean {
  // If no rate limit, allow
  if (!permissions.max_refresh_ms) {
    return true;
  }

  // First refresh always allowed
  if (!lastRefreshMs) {
    return true;
  }

  const now = Date.now();
  const timeSinceLastRefresh = now - lastRefreshMs;

  return timeSinceLastRefresh >= permissions.max_refresh_ms;
}

/**
 * Validates that a secret name is in the plugin's allowed secrets list
 */
export function validateSecretAccess(secretName: string, permissions: PluginPermissions): boolean {
  // If no secrets declared, block all access
  if (!permissions.secrets) {
    return false;
  }

  // Empty array = no secrets allowed
  if (permissions.secrets.length === 0) {
    return false;
  }

  return permissions.secrets.includes(secretName);
}

/**
 * Creates a permission enforcer for a plugin instance
 * Enforces permissions at the host level before plugin receives any APIs
 */
export function createPermissionEnforcer(manifest: PluginManifest, options?: EnforcerOptions) {
  const violations: PermissionViolation[] = [];

  function recordViolation(type: PermissionViolation['type'], details: string): void {
    const violation: PermissionViolation = {
      plugin_id: manifest.id,
      type,
      timestamp: new Date().toISOString(),
      details,
    };
    violations.push(violation);
    options?.onViolation?.(violation);
  }

  return {
    /**
     * Creates a proxied fetch function that enforces domain restrictions
     */
    createFetchProxy(originalFetch: typeof fetch = globalThis.fetch): typeof fetch {
      return async (url, init?) => {
        const urlStr = typeof url === 'string' ? url : url.toString();

        if (!validateNetworkDomain(urlStr, manifest.permissions || {})) {
          recordViolation('network', `Request to ${new URL(urlStr).hostname} not allowed`);
          throw new Error('Permission denied: domain not allowed');
        }

        return originalFetch(url, init);
      };
    },

    /**
     * Validates a data refresh operation against rate limit
     */
    validateRefresh(lastRefreshMs?: number): RefreshValidation {
      const permissions = manifest.permissions || {};
      const allowed = validateRefreshRate(lastRefreshMs, permissions);

      if (!allowed && permissions.max_refresh_ms) {
        const timeSinceLastRefresh = lastRefreshMs ? Date.now() - lastRefreshMs : 0;
        const retryAfter = permissions.max_refresh_ms - timeSinceLastRefresh;

        recordViolation(
          'refresh_rate',
          `Refresh rate exceeded (limit: ${permissions.max_refresh_ms}ms)`
        );

        return {
          allowed: false,
          retryAfter: Math.max(1, retryAfter),
        };
      }

      return { allowed };
    },

    /**
     * Filters secrets to only those declared in plugin manifest
     * Returns only authorized secrets; records violations for unauthorized access attempts
     */
    getAuthorizedSecrets(availableSecrets: Record<string, string>): Record<string, string> {
      const permissions = manifest.permissions || {};
      const authorized: Record<string, string> = {};

      for (const [key, value] of Object.entries(availableSecrets)) {
        if (validateSecretAccess(key, permissions)) {
          authorized[key] = value;
        } else {
          recordViolation('secret_access', `Unauthorized secret access: ${key}`);
        }
      }

      return authorized;
    },

    /**
     * INTERNAL ONLY: Used by tests and admin panel
     * Plugins should NOT have access to this
     */
    getManifestPermissions(): PluginPermissions {
      throw new Error('Plugin cannot access manifest permissions directly');
    },

    /** Access violation history (for admin panel) */
    getViolations(): PermissionViolation[] {
      return [...violations];
    },

    /** Clear violation history */
    clearViolations(): void {
      violations.length = 0;
    },
  };
}

/** Type of enforcer instance for type safety */
export type PluginEnforcer = ReturnType<typeof createPermissionEnforcer>;
