import { describe, it, expect } from 'vitest';
import { validateManifest } from '../manifest-validator';

describe('validateManifest', () => {
  const validManifest = {
    id: 'weather',
    name: 'Weather Widget',
    version: '1.0.0',
  };

  describe('valid manifests', () => {
    it('should accept a minimal valid manifest', () => {
      const result = validateManifest(validManifest);
      expect(result.valid).toBe(true);
      expect(result.errors).toEqual([]);
    });

    it('should accept a manifest with all optional fields', () => {
      const full = {
        ...validManifest,
        ui_entry: './dist/widget.js',
        server_entry: './dist/server.js',
        permissions: {
          allowed_domains: ['api.example.com'],
          max_refresh_ms: 60000,
          max_request_burst: 10,
          secrets: ['API_KEY'],
        },
        widget_sizes: ['small', 'medium'],
        dependencies: ['calendar'],
      };
      const result = validateManifest(full);
      expect(result.valid).toBe(true);
      expect(result.errors).toEqual([]);
    });
  });

  describe('missing required fields', () => {
    it('should reject null input', () => {
      const result = validateManifest(null);
      expect(result.valid).toBe(false);
      expect(result.errors).toContain('Manifest must be a non-null object');
    });

    it('should reject non-object input', () => {
      const result = validateManifest('not-an-object');
      expect(result.valid).toBe(false);
      expect(result.errors).toContain('Manifest must be a non-null object');
    });

    it('should reject missing id', () => {
      const result = validateManifest({ name: validManifest.name, version: validManifest.version });
      expect(result.valid).toBe(false);
      expect(result.errors).toContain('Missing required field: id');
    });

    it('should reject missing name', () => {
      const result = validateManifest({ id: validManifest.id, version: validManifest.version });
      expect(result.valid).toBe(false);
      expect(result.errors).toContain('Missing required field: name');
    });

    it('should reject missing version', () => {
      const result = validateManifest({ id: validManifest.id, name: validManifest.name });
      expect(result.valid).toBe(false);
      expect(result.errors).toContain('Missing required field: version');
    });

    it('should report multiple missing fields', () => {
      const result = validateManifest({});
      expect(result.valid).toBe(false);
      expect(result.errors.length).toBeGreaterThanOrEqual(3);
    });
  });

  describe('invalid field types', () => {
    it('should reject non-string id', () => {
      const result = validateManifest({ ...validManifest, id: 123 });
      expect(result.valid).toBe(false);
      expect(result.errors).toContain('Field "id" must be a string');
    });

    it('should reject non-string name', () => {
      const result = validateManifest({ ...validManifest, name: true });
      expect(result.valid).toBe(false);
      expect(result.errors).toContain('Field "name" must be a string');
    });

    it('should reject non-string version', () => {
      const result = validateManifest({ ...validManifest, version: 1 });
      expect(result.valid).toBe(false);
      expect(result.errors).toContain('Field "version" must be a string');
    });

    it('should reject empty id', () => {
      const result = validateManifest({ ...validManifest, id: '' });
      expect(result.valid).toBe(false);
      expect(result.errors).toContain('Field "id" must not be empty');
    });

    it('should reject empty name', () => {
      const result = validateManifest({ ...validManifest, name: '' });
      expect(result.valid).toBe(false);
      expect(result.errors).toContain('Field "name" must not be empty');
    });

    it('should reject empty version', () => {
      const result = validateManifest({ ...validManifest, version: '' });
      expect(result.valid).toBe(false);
      expect(result.errors).toContain('Field "version" must not be empty');
    });
  });

  describe('permissions validation', () => {
    it('should reject non-object permissions', () => {
      const result = validateManifest({ ...validManifest, permissions: 'invalid' });
      expect(result.valid).toBe(false);
      expect(result.errors).toContain('Field "permissions" must be an object');
    });

    it('should reject non-array allowed_domains', () => {
      const result = validateManifest({
        ...validManifest,
        permissions: { allowed_domains: 'example.com' },
      });
      expect(result.valid).toBe(false);
      expect(result.errors).toContain('permissions.allowed_domains must be an array of strings');
    });

    it('should reject non-number max_refresh_ms', () => {
      const result = validateManifest({
        ...validManifest,
        permissions: { max_refresh_ms: '60000' },
      });
      expect(result.valid).toBe(false);
      expect(result.errors).toContain('permissions.max_refresh_ms must be a positive number');
    });

    it('should reject negative max_refresh_ms', () => {
      const result = validateManifest({
        ...validManifest,
        permissions: { max_refresh_ms: -1 },
      });
      expect(result.valid).toBe(false);
      expect(result.errors).toContain('permissions.max_refresh_ms must be a positive number');
    });
  });

  describe('optional field validation', () => {
    it('should reject non-string ui_entry', () => {
      const result = validateManifest({ ...validManifest, ui_entry: 123 });
      expect(result.valid).toBe(false);
      expect(result.errors).toContain('Field "ui_entry" must be a string');
    });

    it('should reject non-array dependencies', () => {
      const result = validateManifest({ ...validManifest, dependencies: 'calendar' });
      expect(result.valid).toBe(false);
      expect(result.errors).toContain('Field "dependencies" must be an array of strings');
    });

    it('should reject non-array widget_sizes', () => {
      const result = validateManifest({ ...validManifest, widget_sizes: 'small' });
      expect(result.valid).toBe(false);
      expect(result.errors).toContain('Field "widget_sizes" must be an array');
    });

    it('should reject non-string elements in dependencies', () => {
      const result = validateManifest({ ...validManifest, dependencies: ['calendar', 123] });
      expect(result.valid).toBe(false);
      expect(result.errors).toContain('Field "dependencies" must be an array of strings');
    });

    it('should reject non-string elements in allowed_domains', () => {
      const result = validateManifest({
        ...validManifest,
        permissions: { allowed_domains: ['api.example.com', 123] },
      });
      expect(result.valid).toBe(false);
      expect(result.errors).toContain('permissions.allowed_domains must be an array of strings');
    });

    it('should reject non-string elements in secrets', () => {
      const result = validateManifest({
        ...validManifest,
        permissions: { secrets: ['API_KEY', 123] },
      });
      expect(result.valid).toBe(false);
      expect(result.errors).toContain('permissions.secrets must be an array of strings');
    });

    it('should reject NaN for max_refresh_ms', () => {
      const result = validateManifest({
        ...validManifest,
        permissions: { max_refresh_ms: NaN },
      });
      expect(result.valid).toBe(false);
      expect(result.errors).toContain('permissions.max_refresh_ms must be a positive number');
    });

    it('should reject Infinity for max_refresh_ms', () => {
      const result = validateManifest({
        ...validManifest,
        permissions: { max_refresh_ms: Infinity },
      });
      expect(result.valid).toBe(false);
      expect(result.errors).toContain('permissions.max_refresh_ms must be a positive number');
    });

    it('should accept valid max_request_burst', () => {
      const result = validateManifest({
        ...validManifest,
        permissions: { max_request_burst: 10 },
      });
      expect(result.valid).toBe(true);
    });

    it('should reject non-number max_request_burst', () => {
      const result = validateManifest({
        ...validManifest,
        permissions: { max_request_burst: '10' },
      });
      expect(result.valid).toBe(false);
      expect(result.errors).toContain('permissions.max_request_burst must be a positive number');
    });

    it('should reject negative max_request_burst', () => {
      const result = validateManifest({
        ...validManifest,
        permissions: { max_request_burst: -5 },
      });
      expect(result.valid).toBe(false);
      expect(result.errors).toContain('permissions.max_request_burst must be a positive number');
    });

    it('should reject NaN for max_request_burst', () => {
      const result = validateManifest({
        ...validManifest,
        permissions: { max_request_burst: NaN },
      });
      expect(result.valid).toBe(false);
      expect(result.errors).toContain('permissions.max_request_burst must be a positive number');
    });

    it('should reject Infinity for max_request_burst', () => {
      const result = validateManifest({
        ...validManifest,
        permissions: { max_request_burst: Infinity },
      });
      expect(result.valid).toBe(false);
      expect(result.errors).toContain('permissions.max_request_burst must be a positive number');
    });
  });

  describe('return type', () => {
    it('should return parsed manifest on success', () => {
      const result = validateManifest(validManifest);
      expect(result.valid).toBe(true);
      expect(result.manifest).toBeDefined();
      expect(result.manifest?.id).toBe('weather');
    });

    it('should not return manifest on failure', () => {
      const result = validateManifest({});
      expect(result.valid).toBe(false);
      expect(result.manifest).toBeUndefined();
    });
  });
});
