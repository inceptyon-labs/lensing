import { describe, it, expect } from 'vitest';
import { extractBearerToken, isProtectedRoute } from '../auth-middleware';

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

    it('should not protect GET /plugins/:id/template', () => {
      expect(isProtectedRoute('/plugins/weather/template', 'GET')).toBe(false);
    });

    it('should not protect OPTIONS requests', () => {
      expect(isProtectedRoute('/settings', 'OPTIONS')).toBe(false);
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
});
