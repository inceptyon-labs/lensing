import { describe, it, expect } from 'vitest';
import {
  validateNetworkDomain,
  createPermissionEnforcer,
  type PermissionViolation,
} from '../plugin-permissions';
import type { PluginManifest } from '@lensing/types';

describe('validateNetworkDomain with URL blocklist', () => {
  describe('blocklist always applies', () => {
    it('should block localhost regardless of allowed_domains', () => {
      const permissions = { allowed_domains: ['localhost', 'example.com'] };
      expect(validateNetworkDomain('http://localhost/', permissions)).toBe(false);
    });

    it('should block 127.0.0.1 regardless of allowed_domains', () => {
      const permissions = { allowed_domains: ['127.0.0.1', 'example.com'] };
      expect(validateNetworkDomain('http://127.0.0.1/', permissions)).toBe(false);
    });

    it('should block private IPs like 192.168.1.1 by default', () => {
      const permissions = { allowed_domains: ['example.com'] };
      expect(validateNetworkDomain('http://192.168.1.1/', permissions)).toBe(false);
    });

    it('should block link-local 169.254.x.x even with allowed_domains', () => {
      const permissions = { allowed_domains: ['169.254.1.1', 'example.com'] };
      expect(validateNetworkDomain('http://169.254.1.1/', permissions)).toBe(false);
    });

    it('should block metadata endpoints like metadata.google.internal', () => {
      const permissions = { allowed_domains: ['metadata.google.internal'] };
      expect(validateNetworkDomain('http://metadata.google.internal/', permissions)).toBe(false);
    });
  });

  describe('allowed_domains still work for public URLs', () => {
    it('should allow a URL that is in allowed_domains', () => {
      const permissions = { allowed_domains: ['api.example.com'] };
      expect(validateNetworkDomain('https://api.example.com/data', permissions)).toBe(true);
    });

    it('should block a URL not in allowed_domains', () => {
      const permissions = { allowed_domains: ['api.example.com'] };
      expect(validateNetworkDomain('https://api.other.com/data', permissions)).toBe(false);
    });

    it('should allow subdomains of allowed domains', () => {
      const permissions = { allowed_domains: ['example.com'] };
      expect(validateNetworkDomain('https://api.example.com/', permissions)).toBe(true);
    });

    it('should allow no restrictions when allowed_domains is empty', () => {
      const permissions = { allowed_domains: [] };
      expect(validateNetworkDomain('https://api.example.com/', permissions)).toBe(true);
      expect(validateNetworkDomain('https://api.other.com/', permissions)).toBe(true);
    });
  });
});

describe('PluginEnforcer fetch proxy with blocklist', () => {
  it('should block fetch to localhost', async () => {
    const manifest: PluginManifest = {
      id: 'test-plugin',
      name: 'Test',
      version: '1.0.0',
      permissions: { allowed_domains: [] }, // No restrictions
    };
    const enforcer = createPermissionEnforcer(manifest);
    const fetchProxy = enforcer.createFetchProxy(async () => {
      throw new Error('Should not reach real fetch');
    });

    try {
      await fetchProxy('http://localhost/api');
      throw new Error('Should have blocked');
    } catch (err) {
      expect((err as Error).message).toBe('Permission denied: domain not allowed');
    }
  });

  it('should block fetch to private IP like 10.0.0.1', async () => {
    const manifest: PluginManifest = {
      id: 'test-plugin',
      name: 'Test',
      version: '1.0.0',
      permissions: { allowed_domains: [] },
    };
    const enforcer = createPermissionEnforcer(manifest);
    const fetchProxy = enforcer.createFetchProxy(async () => {
      throw new Error('Should not reach real fetch');
    });

    try {
      await fetchProxy('http://10.0.0.1/api');
      throw new Error('Should have blocked');
    } catch (err) {
      expect((err as Error).message).toBe('Permission denied: domain not allowed');
    }
  });

  it('should allow fetch to public URL in allowed_domains', async () => {
    let fetchCalled = false;
    const manifest: PluginManifest = {
      id: 'test-plugin',
      name: 'Test',
      version: '1.0.0',
      permissions: { allowed_domains: ['api.example.com'] },
    };
    const enforcer = createPermissionEnforcer(manifest);
    const fetchProxy = enforcer.createFetchProxy(async () => {
      fetchCalled = true;
      return {
        ok: true,
        status: 200,
        json: async () => ({ data: 'test' }),
      } as Response;
    });

    await fetchProxy('https://api.example.com/data');
    expect(fetchCalled).toBe(true);
  });

  it('should record violation when blocklist blocks URL', async () => {
    const violations: PermissionViolation[] = [];
    const manifest: PluginManifest = {
      id: 'test-plugin',
      name: 'Test',
      version: '1.0.0',
      permissions: { allowed_domains: [] },
    };
    const enforcer = createPermissionEnforcer(manifest, {
      onViolation: (v) => violations.push(v),
    });
    const fetchProxy = enforcer.createFetchProxy(async () => {
      throw new Error('Should not reach');
    });

    try {
      await fetchProxy('http://192.168.1.1/api');
    } catch {
      // Expected
    }

    expect(violations).toHaveLength(1);
    expect(violations[0].type).toBe('network');
    expect(violations[0].details).toContain('192.168.1.1');
  });
});
