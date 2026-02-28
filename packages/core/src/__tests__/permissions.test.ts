import { describe, it, expect, beforeEach, vi } from 'vitest';
import {
  validateNetworkDomain,
  validateRefreshRate,
  validateSecretAccess,
  createPermissionEnforcer,
  type PermissionViolation,
} from '../plugin-permissions';
import type { PluginManifest, PluginPermissions } from '@lensing/types';

describe('Permission Validators', () => {
  describe('validateNetworkDomain', () => {
    it('should allow requests to declared allowed domains', () => {
      const permissions: PluginPermissions = {
        allowed_domains: ['api.example.com', 'data.example.com'],
      };
      expect(validateNetworkDomain('https://api.example.com/data', permissions)).toBe(true);
      expect(validateNetworkDomain('https://data.example.com/v1/users', permissions)).toBe(true);
    });

    it('should block requests to undeclared domains', () => {
      const permissions: PluginPermissions = {
        allowed_domains: ['api.example.com'],
      };
      expect(validateNetworkDomain('https://evil.com/steal', permissions)).toBe(false);
      expect(validateNetworkDomain('https://api.example.com.evil.com/data', permissions)).toBe(
        false
      );
    });

    it('should allow requests when no domain restrictions set', () => {
      const permissions: PluginPermissions = {};
      expect(validateNetworkDomain('https://any.domain.com/data', permissions)).toBe(true);
    });

    it('should block localhost even when declared in allowed_domains (SSRF protection)', () => {
      const permissions: PluginPermissions = {
        allowed_domains: ['localhost'],
      };
      expect(validateNetworkDomain('http://localhost:3000/api', permissions)).toBe(false);
      expect(validateNetworkDomain('http://localhost/api', permissions)).toBe(false);
    });
  });

  describe('validateRefreshRate', () => {
    it('should allow refresh when cooldown has passed', () => {
      const permissions: PluginPermissions = {
        max_refresh_ms: 5000, // 5 second minimum between refreshes
      };
      const lastRefresh = Date.now() - 6000; // 6 seconds ago
      expect(validateRefreshRate(lastRefresh, permissions)).toBe(true);
    });

    it('should block refresh when cooldown has not passed', () => {
      const permissions: PluginPermissions = {
        max_refresh_ms: 5000,
      };
      const lastRefresh = Date.now() - 4000; // only 4 seconds ago
      expect(validateRefreshRate(lastRefresh, permissions)).toBe(false);
    });

    it('should allow refresh when no rate limit set', () => {
      const permissions: PluginPermissions = {};
      expect(validateRefreshRate(Date.now(), permissions)).toBe(true);
    });

    it('should allow first refresh (no lastRefresh)', () => {
      const permissions: PluginPermissions = {
        max_refresh_ms: 5000,
      };
      expect(validateRefreshRate(undefined, permissions)).toBe(true);
    });

    it('should reject invalid timestamps (NaN, negative, infinity)', () => {
      const permissions: PluginPermissions = {
        max_refresh_ms: 5000,
      };
      expect(validateRefreshRate(NaN, permissions)).toBe(false);
      expect(validateRefreshRate(-1000, permissions)).toBe(false);
      expect(validateRefreshRate(Infinity, permissions)).toBe(false);
    });

    it('should allow refresh with zero or negative max_refresh_ms', () => {
      expect(validateRefreshRate(Date.now(), { max_refresh_ms: 0 })).toBe(true);
      expect(validateRefreshRate(Date.now(), { max_refresh_ms: -1 })).toBe(true);
    });
  });

  describe('validateSecretAccess', () => {
    it('should allow access to declared secrets', () => {
      const permissions: PluginPermissions = {
        secrets: ['API_KEY', 'DB_PASSWORD'],
      };
      expect(validateSecretAccess('API_KEY', permissions)).toBe(true);
      expect(validateSecretAccess('DB_PASSWORD', permissions)).toBe(true);
    });

    it('should block access to undeclared secrets', () => {
      const permissions: PluginPermissions = {
        secrets: ['API_KEY'],
      };
      expect(validateSecretAccess('ADMIN_TOKEN', permissions)).toBe(false);
      expect(validateSecretAccess('OTHER_SECRET', permissions)).toBe(false);
    });

    it('should block all secrets when none declared', () => {
      const permissions: PluginPermissions = {};
      expect(validateSecretAccess('ANY_SECRET', permissions)).toBe(false);
    });

    it('should allow any secret when secrets array is empty but present', () => {
      const permissions: PluginPermissions = {
        secrets: [],
      };
      // Empty array = no secrets allowed
      expect(validateSecretAccess('API_KEY', permissions)).toBe(false);
    });
  });
});

describe('PermissionEnforcer', () => {
  let enforcer: ReturnType<typeof createPermissionEnforcer>;
  let mockFetch: ReturnType<typeof vi.fn>;
  let violations: PermissionViolation[];

  beforeEach(() => {
    violations = [];
    mockFetch = vi.fn();

    const manifest: PluginManifest = {
      id: 'test-plugin',
      name: 'Test Plugin',
      version: '1.0.0',
      permissions: {
        allowed_domains: ['api.test.com'],
        max_refresh_ms: 5000,
        secrets: ['API_KEY'],
      },
    };

    enforcer = createPermissionEnforcer(manifest, {
      onViolation: (violation) => violations.push(violation),
    });
  });

  describe('enforced fetch', () => {
    it('should allow fetch to allowed domains', async () => {
      mockFetch.mockResolvedValue(new Response(JSON.stringify({ ok: true }), { status: 200 }));

      const enforcedFetch = enforcer.createFetchProxy(mockFetch);
      const response = await enforcedFetch('https://api.test.com/data');

      expect(response.status).toBe(200);
      expect(violations.length).toBe(0);
    });

    it('should block fetch to unauthorized domains', async () => {
      const enforcedFetch = enforcer.createFetchProxy(mockFetch);

      await expect(enforcedFetch('https://evil.com/data')).rejects.toThrow(
        'Permission denied: domain not allowed'
      );

      expect(violations.length).toBe(1);
      expect(violations[0].type).toBe('network');
      expect(violations[0].plugin_id).toBe('test-plugin');
      expect(violations[0].details).toContain('evil.com');
    });

    it('should handle fetch with Request object', async () => {
      mockFetch.mockResolvedValue(new Response('ok', { status: 200 }));

      const enforcedFetch = enforcer.createFetchProxy(mockFetch);
      const request = new Request('https://api.test.com/data');

      const response = await enforcedFetch(request);
      expect(response.status).toBe(200);
      expect(violations.length).toBe(0);
    });

    it('should block fetch with Request object to unauthorized domain', async () => {
      const enforcedFetch = enforcer.createFetchProxy(mockFetch);
      const request = new Request('https://evil.com/data');

      await expect(enforcedFetch(request)).rejects.toThrow('Permission denied: domain not allowed');
      expect(violations.length).toBe(1);
      expect(violations[0].type).toBe('network');
    });

    it('should handle fetch with URL object', async () => {
      mockFetch.mockResolvedValue(new Response('ok', { status: 200 }));

      const enforcedFetch = enforcer.createFetchProxy(mockFetch);
      const url = new URL('https://api.test.com/data');

      const response = await enforcedFetch(url);
      expect(response.status).toBe(200);
      expect(violations.length).toBe(0);
    });

    it('should block fetch with invalid URL', async () => {
      const enforcedFetch = enforcer.createFetchProxy(mockFetch);

      await expect(enforcedFetch('not a valid url')).rejects.toThrow(
        'Permission denied: domain not allowed'
      );
      expect(violations.length).toBe(1);
      expect(violations[0].type).toBe('network');
      expect(violations[0].details).toContain('Invalid or disallowed URL');
    });
  });

  describe('enforced refresh', () => {
    it('should allow refresh when rate limit respected', () => {
      const lastRefresh = Date.now() - 6000; // 6 seconds ago
      const result = enforcer.validateRefresh(lastRefresh);

      expect(result.allowed).toBe(true);
      expect(violations.length).toBe(0);
    });

    it('should block refresh when rate limit exceeded', () => {
      const lastRefresh = Date.now() - 2000; // only 2 seconds ago
      const result = enforcer.validateRefresh(lastRefresh);

      expect(result.allowed).toBe(false);
      expect(result.retryAfter).toBeGreaterThan(0);
      expect(violations.length).toBe(1);
      expect(violations[0].type).toBe('refresh_rate');
    });
  });

  describe('enforced secret access', () => {
    it('should return allowed secrets', () => {
      const secrets = enforcer.getAuthorizedSecrets({ API_KEY: 'secret123', DB_PASS: 'secret456' });

      expect(secrets).toEqual({ API_KEY: 'secret123' });
      // DB_PASS is not in allowed list, so 1 violation recorded
      expect(violations.length).toBe(1);
      expect(violations[0].type).toBe('secret_access');
    });

    it('should filter out unauthorized secrets', () => {
      const secrets = enforcer.getAuthorizedSecrets({
        API_KEY: 'secret123',
        ADMIN_TOKEN: 'should_not_appear',
      });

      expect(secrets).toEqual({ API_KEY: 'secret123' });
      expect(violations.length).toBe(1);
      expect(violations[0].type).toBe('secret_access');
      expect(violations[0].details).toContain('ADMIN_TOKEN');
    });

    it('should return empty object when no secrets allowed', () => {
      const restrictiveEnforcer = createPermissionEnforcer({
        id: 'restrictive',
        name: 'Restrictive',
        version: '1.0.0',
        permissions: { secrets: [] },
      });

      const secrets = restrictiveEnforcer.getAuthorizedSecrets({ API_KEY: 'secret' });
      expect(secrets).toEqual({});
    });
  });

  describe('violation tracking', () => {
    it('should track all violation types', async () => {
      const enforcedFetch = enforcer.createFetchProxy(mockFetch);

      // Network violation
      await expect(enforcedFetch('https://evil.com/data')).rejects.toThrow();

      // Refresh violation
      const lastRefresh = Date.now() - 2000;
      enforcer.validateRefresh(lastRefresh);

      // Secret violation
      enforcer.getAuthorizedSecrets({ UNAUTHORIZED: 'secret' });

      expect(violations.length).toBe(3);
      expect(violations[0].type).toBe('network');
      expect(violations[1].type).toBe('refresh_rate');
      expect(violations[2].type).toBe('secret_access');

      violations.forEach((v) => {
        expect(v.plugin_id).toBe('test-plugin');
        expect(v.timestamp).toBeDefined();
        expect(v.details).toBeDefined();
      });
    });
  });

  describe('host-level enforcement', () => {
    it('should prevent plugins from accessing raw permissions', () => {
      // Plugins should not receive manifest.permissions directly
      // They only get the enforced API (proxied fetch, filtered secrets, etc.)
      expect(() => {
        // This should fail - permissions are hidden from plugin
        enforcer.getManifestPermissions();
      }).toThrow();
    });

    it('should provide isolated context for each plugin', async () => {
      // Each enforcer has isolated rules - verify through their enforcement
      const violations1: PermissionViolation[] = [];
      const violations2: PermissionViolation[] = [];

      // Mock fetch for allowed requests
      const mockFetchAllowed = vi.fn().mockResolvedValue(new Response('ok', { status: 200 }));

      const enforcer1WithTracking = createPermissionEnforcer(
        {
          id: 'plugin-1',
          name: 'Plugin 1',
          version: '1.0.0',
          permissions: { allowed_domains: ['domain1.com'] },
        },
        { onViolation: (v) => violations1.push(v) }
      );

      const enforcer2WithTracking = createPermissionEnforcer(
        {
          id: 'plugin-2',
          name: 'Plugin 2',
          version: '1.0.0',
          permissions: { allowed_domains: ['domain2.com'] },
        },
        { onViolation: (v) => violations2.push(v) }
      );

      const fetch1 = enforcer1WithTracking.createFetchProxy(mockFetchAllowed);
      const fetch2 = enforcer2WithTracking.createFetchProxy(mockFetchAllowed);

      // Plugin 1 can access domain1, but NOT domain2
      await expect(fetch1('https://domain1.com/data')).resolves.toBeDefined();
      await expect(fetch1('https://domain2.com/data')).rejects.toThrow(
        'Permission denied: domain not allowed'
      );

      // Plugin 2 can access domain2, but NOT domain1
      await expect(fetch2('https://domain2.com/data')).resolves.toBeDefined();
      await expect(fetch2('https://domain1.com/data')).rejects.toThrow(
        'Permission denied: domain not allowed'
      );

      // Violations are isolated per enforcer
      expect(violations1.length).toBe(1); // Only plugin-1's domain2 violation
      expect(violations1[0].plugin_id).toBe('plugin-1');
      expect(violations2.length).toBe(1); // Only plugin-2's domain1 violation
      expect(violations2[0].plugin_id).toBe('plugin-2');
    });
  });
});
