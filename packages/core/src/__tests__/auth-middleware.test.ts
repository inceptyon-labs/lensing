import { describe, it, expect } from 'vitest';
import {
  extractBearerToken,
  isProtectedRoute,
  isLoopbackAddress,
  isHostAllowed,
  isOriginAllowed,
} from '../auth-middleware';
import { hostname } from 'node:os';

describe('auth-middleware', () => {
  describe('extractBearerToken', () => {
    it('should extract token from valid Bearer header', () => {
      expect(extractBearerToken('Bearer abc123')).toBe('abc123');
    });

    it('should return null for missing header', () => {
      expect(extractBearerToken(undefined)).toBeNull();
    });

    it('should return null for empty string', () => {
      expect(extractBearerToken('')).toBeNull();
    });

    it('should return null for non-Bearer scheme', () => {
      expect(extractBearerToken('Basic abc123')).toBeNull();
    });

    it('should return null for Bearer without token', () => {
      expect(extractBearerToken('Bearer ')).toBeNull();
      expect(extractBearerToken('Bearer')).toBeNull();
    });

    it('should be case-insensitive for Bearer prefix', () => {
      expect(extractBearerToken('bearer abc123')).toBe('abc123');
      expect(extractBearerToken('BEARER abc123')).toBe('abc123');
    });

    it('should trim whitespace from token', () => {
      expect(extractBearerToken('Bearer  abc123 ')).toBe('abc123');
    });
  });

  describe('isProtectedRoute', () => {
    it('should not protect /health', () => {
      expect(isProtectedRoute('/health', 'GET')).toBe(false);
    });

    it('should not protect GET /marketplace', () => {
      expect(isProtectedRoute('/marketplace', 'GET')).toBe(false);
    });

    it('should not protect GET /marketplace/categories', () => {
      expect(isProtectedRoute('/marketplace/categories', 'GET')).toBe(false);
    });

    it('should not protect GET /marketplace/:id', () => {
      expect(isProtectedRoute('/marketplace/plugin-1', 'GET')).toBe(false);
    });

    it('should not protect GET /plugins', () => {
      expect(isProtectedRoute('/plugins', 'GET')).toBe(false);
    });

    it('should not protect GET /plugins/:id/template', () => {
      expect(isProtectedRoute('/plugins/weather/template', 'GET')).toBe(false);
    });

    it('should not protect GET /layout', () => {
      expect(isProtectedRoute('/layout', 'GET')).toBe(false);
    });

    it('should not protect GET /display/settings', () => {
      expect(isProtectedRoute('/display/settings', 'GET')).toBe(false);
    });

    it('should not protect GET /display/capabilities', () => {
      expect(isProtectedRoute('/display/capabilities', 'GET')).toBe(false);
    });

    it('should not protect GET /api/admin/marketplace', () => {
      expect(isProtectedRoute('/api/admin/marketplace', 'GET')).toBe(false);
    });

    it('should not protect OPTIONS requests', () => {
      expect(isProtectedRoute('/settings', 'OPTIONS')).toBe(false);
    });

    it('should protect POST /plugins', () => {
      expect(isProtectedRoute('/plugins', 'POST')).toBe(true);
    });

    it('should protect PUT /settings', () => {
      expect(isProtectedRoute('/settings', 'PUT')).toBe(true);
    });

    it('should protect GET /settings', () => {
      expect(isProtectedRoute('/settings', 'GET')).toBe(true);
    });

    it('should protect PUT /layout', () => {
      expect(isProtectedRoute('/layout', 'PUT')).toBe(true);
    });

    it('should protect POST /plugins/install', () => {
      expect(isProtectedRoute('/plugins/install', 'POST')).toBe(true);
    });

    it('should protect PUT /plugins/:id/config', () => {
      expect(isProtectedRoute('/plugins/weather/config', 'PUT')).toBe(true);
    });

    it('should protect PUT /plugins/:id/enabled', () => {
      expect(isProtectedRoute('/plugins/weather/enabled', 'PUT')).toBe(true);
    });

    it('should protect POST /modules/:id/restart', () => {
      expect(isProtectedRoute('/modules/weather/restart', 'POST')).toBe(true);
    });

    it('should protect POST /api/admin/marketplace', () => {
      expect(isProtectedRoute('/api/admin/marketplace', 'POST')).toBe(true);
    });

    it('should protect PUT /display/brightness', () => {
      expect(isProtectedRoute('/display/brightness', 'PUT')).toBe(true);
    });

    it('should protect POST /marketplace/:id/install', () => {
      expect(isProtectedRoute('/marketplace/plugin-1/install', 'POST')).toBe(true);
    });

    it('should protect POST /marketplace/:id/update', () => {
      expect(isProtectedRoute('/marketplace/plugin-1/update', 'POST')).toBe(true);
    });

    it('should protect POST /plugins/reload', () => {
      expect(isProtectedRoute('/plugins/reload', 'POST')).toBe(true);
    });

    it('should protect PUT /display/rotation', () => {
      expect(isProtectedRoute('/display/rotation', 'PUT')).toBe(true);
    });

    it('should protect POST /api/admin/builder/save', () => {
      expect(isProtectedRoute('/api/admin/builder/save', 'POST')).toBe(true);
    });

    it('should protect POST /ask', () => {
      expect(isProtectedRoute('/ask', 'POST')).toBe(true);
    });
  });

  describe('isLoopbackAddress', () => {
    it('should accept loopback forms and reject others', () => {
      expect(isLoopbackAddress('127.0.0.1')).toBe(true);
      expect(isLoopbackAddress('127.5.5.5')).toBe(true);
      expect(isLoopbackAddress('::1')).toBe(true);
      expect(isLoopbackAddress('::ffff:127.0.0.1')).toBe(true);
      expect(isLoopbackAddress('192.168.1.5')).toBe(false);
      expect(isLoopbackAddress('::ffff:192.168.1.5')).toBe(false);
      expect(isLoopbackAddress(undefined)).toBe(false);
    });
  });

  describe('isHostAllowed', () => {
    it('should allow LAN-style hosts', () => {
      for (const h of [
        undefined,
        '192.168.2.10:3100',
        '[::1]:3100',
        'localhost:3100',
        'raspberrypi:3100',
        'pi.local',
        'pi.home.arpa',
        'pi.lan:3100',
        hostname().toUpperCase(),
      ]) {
        expect(isHostAllowed(h, [])).toBe(true);
      }
    });

    it('should reject public names unless allowlisted', () => {
      expect(isHostAllowed('evil.example.com', [])).toBe(false);
      expect(isHostAllowed('evil.example.com:3100', [])).toBe(false);
      expect(isHostAllowed('dash.example.com:3100', ['Dash.Example.com'])).toBe(true);
    });
  });

  describe('isOriginAllowed', () => {
    it('should require Origin host to match Host when present', () => {
      expect(isOriginAllowed(undefined, 'pi:3100')).toBe(true);
      expect(isOriginAllowed('http://pi:3100', 'pi:3100')).toBe(true);
      expect(isOriginAllowed('http://evil.com', 'pi:3100')).toBe(false);
      expect(isOriginAllowed('http://pi:3000', 'pi:3100')).toBe(false);
      expect(isOriginAllowed('null', 'pi:3100')).toBe(false);
    });
  });

  describe('public display reads', () => {
    it('should not protect GET /data-bus or /photos/*', () => {
      expect(isProtectedRoute('/data-bus', 'GET')).toBe(false);
      expect(isProtectedRoute('/photos/a.jpg', 'GET')).toBe(false);
      expect(isProtectedRoute('/settings', 'GET')).toBe(true);
      expect(isProtectedRoute('/plugins/x/config', 'GET')).toBe(true);
    });
  });
});
