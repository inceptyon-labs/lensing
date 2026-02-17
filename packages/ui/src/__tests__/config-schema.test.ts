import { describe, it, expect } from 'vitest';
import { validateConfigValue, buildDefaultConfig } from '../config-schema';
import type { ConfigField, PluginConfigSchema } from '@lensing/types';

describe('Config Schema', () => {
  describe('validateConfigValue', () => {
    it('should validate string field', () => {
      const field: ConfigField = {
        key: 'name',
        type: 'string',
        label: 'Name',
      };

      expect(validateConfigValue('hello', field)).toBe(true);
      expect(validateConfigValue(123, field)).toBe(false);
      expect(validateConfigValue(true, field)).toBe(false);
    });

    it('should validate number field', () => {
      const field: ConfigField = {
        key: 'count',
        type: 'number',
        label: 'Count',
      };

      expect(validateConfigValue(42, field)).toBe(true);
      expect(validateConfigValue(3.14, field)).toBe(true);
      expect(validateConfigValue('42', field)).toBe(false);
      expect(validateConfigValue(true, field)).toBe(false);
    });

    it('should validate boolean field', () => {
      const field: ConfigField = {
        key: 'enabled',
        type: 'boolean',
        label: 'Enabled',
      };

      expect(validateConfigValue(true, field)).toBe(true);
      expect(validateConfigValue(false, field)).toBe(true);
      expect(validateConfigValue(1, field)).toBe(false);
      expect(validateConfigValue('true', field)).toBe(false);
    });

    it('should validate select field', () => {
      const field: ConfigField = {
        key: 'color',
        type: 'select',
        label: 'Color',
        options: [
          { label: 'Red', value: 'red' },
          { label: 'Blue', value: 'blue' },
        ],
      };

      expect(validateConfigValue('red', field)).toBe(true);
      expect(validateConfigValue('blue', field)).toBe(true);
      expect(validateConfigValue('green', field)).toBe(false);
      expect(validateConfigValue('RED', field)).toBe(false); // case-sensitive
    });

    it('should respect min constraint on numbers', () => {
      const field: ConfigField = {
        key: 'port',
        type: 'number',
        label: 'Port',
        min: 1024,
      };

      expect(validateConfigValue(1024, field)).toBe(true);
      expect(validateConfigValue(8080, field)).toBe(true);
      expect(validateConfigValue(512, field)).toBe(false);
    });

    it('should respect max constraint on numbers', () => {
      const field: ConfigField = {
        key: 'port',
        type: 'number',
        label: 'Port',
        max: 65535,
      };

      expect(validateConfigValue(8080, field)).toBe(true);
      expect(validateConfigValue(65535, field)).toBe(true);
      expect(validateConfigValue(65536, field)).toBe(false);
    });

    it('should respect both min and max constraints', () => {
      const field: ConfigField = {
        key: 'priority',
        type: 'number',
        label: 'Priority',
        min: 1,
        max: 100,
      };

      expect(validateConfigValue(1, field)).toBe(true);
      expect(validateConfigValue(50, field)).toBe(true);
      expect(validateConfigValue(100, field)).toBe(true);
      expect(validateConfigValue(0, field)).toBe(false);
      expect(validateConfigValue(101, field)).toBe(false);
    });

    it('should reject unknown field types', () => {
      const field = {
        key: 'unknown',
        type: 'custom' as ConfigField['type'],
        label: 'Unknown',
      };

      expect(validateConfigValue('anything', field)).toBe(false);
      expect(validateConfigValue(42, field)).toBe(false);
      expect(validateConfigValue(true, field)).toBe(false);
    });
  });

  describe('buildDefaultConfig', () => {
    it('should build config from schema with defaults', () => {
      const schema: PluginConfigSchema = {
        fields: [
          { key: 'host', type: 'string', label: 'Host', default: 'localhost' },
          { key: 'port', type: 'number', label: 'Port', default: 8080 },
          { key: 'ssl', type: 'boolean', label: 'SSL', default: false },
        ],
      };

      const config = buildDefaultConfig(schema);
      expect(config).toEqual({
        host: 'localhost',
        port: 8080,
        ssl: false,
      });
    });

    it('should skip fields without defaults', () => {
      const schema: PluginConfigSchema = {
        fields: [
          { key: 'host', type: 'string', label: 'Host', default: 'localhost' },
          { key: 'user', type: 'string', label: 'User' }, // no default
          { key: 'port', type: 'number', label: 'Port', default: 8080 },
        ],
      };

      const config = buildDefaultConfig(schema);
      expect(config).toEqual({
        host: 'localhost',
        port: 8080,
      });
      expect(config.user).toBeUndefined();
    });

    it('should handle empty schema', () => {
      const schema: PluginConfigSchema = {
        fields: [],
      };

      const config = buildDefaultConfig(schema);
      expect(config).toEqual({});
    });

    it('should handle schema with all field types', () => {
      const schema: PluginConfigSchema = {
        fields: [
          { key: 'name', type: 'string', label: 'Name', default: 'test' },
          { key: 'count', type: 'number', label: 'Count', default: 5 },
          {
            key: 'mode',
            type: 'select',
            label: 'Mode',
            options: [
              { label: 'Auto', value: 'auto' },
              { label: 'Manual', value: 'manual' },
            ],
            default: 'auto',
          },
          { key: 'debug', type: 'boolean', label: 'Debug', default: true },
        ],
      };

      const config = buildDefaultConfig(schema);
      expect(config).toEqual({
        name: 'test',
        count: 5,
        mode: 'auto',
        debug: true,
      });
    });
  });
});
