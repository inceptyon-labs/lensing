import { describe, it, expect } from 'vitest';
import { MODULE_SCHEMAS, MODULE_IDS } from '../module-settings';

describe('Module Settings Schemas', () => {
  it('should define exactly 9 modules', () => {
    expect(MODULE_SCHEMAS).toHaveLength(9);
    expect(MODULE_IDS).toHaveLength(9);
  });

  it('should include photo-slideshow module with photoDirectory field', () => {
    const schema = MODULE_SCHEMAS.find((s) => s.id === 'photo-slideshow');
    expect(schema).toBeDefined();
    expect(schema!.name).toBe('Photo Slideshow');
    const dirField = schema!.fields.find((f) => f.key === 'photoDirectory');
    expect(dirField).toBeDefined();
    expect(dirField!.type).toBe('string');
  });

  it('should have a schema for every MODULE_ID', () => {
    const schemaIds = MODULE_SCHEMAS.map((s) => s.id);
    for (const id of MODULE_IDS) {
      expect(schemaIds).toContain(id);
    }
  });

  it('should have no duplicate module IDs', () => {
    const ids = MODULE_SCHEMAS.map((s) => s.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it('should have no duplicate field keys within any module', () => {
    for (const schema of MODULE_SCHEMAS) {
      const keys = schema.fields.map((f) => f.key);
      expect(new Set(keys).size).toBe(keys.length);
    }
  });

  it('should have name and description for every module', () => {
    for (const schema of MODULE_SCHEMAS) {
      expect(schema.name.length).toBeGreaterThan(0);
      expect(schema.description.length).toBeGreaterThan(0);
    }
  });

  it('should have valid field types', () => {
    const validTypes = ['string', 'number', 'boolean', 'select', 'password'];
    for (const schema of MODULE_SCHEMAS) {
      for (const field of schema.fields) {
        expect(validTypes).toContain(field.type);
      }
    }
  });

  it('should have at least one field per module', () => {
    for (const schema of MODULE_SCHEMAS) {
      expect(schema.fields.length).toBeGreaterThan(0);
    }
  });

  it('select fields should have options defined', () => {
    for (const schema of MODULE_SCHEMAS) {
      for (const field of schema.fields) {
        if (field.type === 'select') {
          expect(field.options).toBeDefined();
          expect(field.options!.length).toBeGreaterThan(0);
        }
      }
    }
  });
});
