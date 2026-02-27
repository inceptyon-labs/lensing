import { describe, it, expect } from 'vitest';
import {
  MODULE_SCHEMAS,
  MODULE_IDS,
  getIntegrationFields,
  getWidgetFields,
  moduleNeedsIntegration,
} from '../module-settings';

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

  it('every field should have a category of integration or widget', () => {
    for (const schema of MODULE_SCHEMAS) {
      for (const field of schema.fields) {
        expect(field.category).toBeDefined();
        expect(['integration', 'widget']).toContain(field.category);
      }
    }
  });
});

describe('Config field category helpers', () => {
  it('getIntegrationFields returns only integration-category fields', () => {
    const weather = MODULE_SCHEMAS.find((s) => s.id === 'weather')!;
    const integrationFields = getIntegrationFields(weather);
    expect(integrationFields.length).toBeGreaterThan(0);
    for (const f of integrationFields) {
      expect(f.category).toBe('integration');
    }
    // provider and apiKey are integration fields
    const keys = integrationFields.map((f) => f.key);
    expect(keys).toContain('provider');
    expect(keys).toContain('apiKey');
    expect(keys).not.toContain('lat');
    expect(keys).not.toContain('units');
  });

  it('getWidgetFields returns only widget-category fields', () => {
    const weather = MODULE_SCHEMAS.find((s) => s.id === 'weather')!;
    const widgetFields = getWidgetFields(weather);
    expect(widgetFields.length).toBeGreaterThan(0);
    for (const f of widgetFields) {
      expect(f.category).toBe('widget');
    }
    const keys = widgetFields.map((f) => f.key);
    expect(keys).toContain('lat');
    expect(keys).toContain('lon');
    expect(keys).toContain('units');
    expect(keys).not.toContain('apiKey');
  });

  it('moduleNeedsIntegration returns true for modules with integration fields', () => {
    const weather = MODULE_SCHEMAS.find((s) => s.id === 'weather')!;
    const calendar = MODULE_SCHEMAS.find((s) => s.id === 'calendar')!;
    const ha = MODULE_SCHEMAS.find((s) => s.id === 'home-assistant')!;
    const allergies = MODULE_SCHEMAS.find((s) => s.id === 'allergies')!;
    const photoSlideshow = MODULE_SCHEMAS.find((s) => s.id === 'photo-slideshow')!;
    const pir = MODULE_SCHEMAS.find((s) => s.id === 'pir')!;

    expect(moduleNeedsIntegration(weather)).toBe(true);
    expect(moduleNeedsIntegration(calendar)).toBe(true);
    expect(moduleNeedsIntegration(ha)).toBe(true);
    expect(moduleNeedsIntegration(allergies)).toBe(true);
    expect(moduleNeedsIntegration(photoSlideshow)).toBe(true);
    expect(moduleNeedsIntegration(pir)).toBe(true);
  });

  it('moduleNeedsIntegration returns false for modules with only widget fields', () => {
    const crypto = MODULE_SCHEMAS.find((s) => s.id === 'crypto')!;
    const news = MODULE_SCHEMAS.find((s) => s.id === 'news')!;
    const sports = MODULE_SCHEMAS.find((s) => s.id === 'sports')!;

    expect(moduleNeedsIntegration(crypto)).toBe(false);
    expect(moduleNeedsIntegration(news)).toBe(false);
    expect(moduleNeedsIntegration(sports)).toBe(false);
  });

  it('crypto has no integration fields and all widget fields', () => {
    const crypto = MODULE_SCHEMAS.find((s) => s.id === 'crypto')!;
    expect(getIntegrationFields(crypto)).toHaveLength(0);
    expect(getWidgetFields(crypto)).toHaveLength(1);
    expect(getWidgetFields(crypto)[0].key).toBe('watchlist');
  });

  it('calendar has both integration and widget fields', () => {
    const calendar = MODULE_SCHEMAS.find((s) => s.id === 'calendar')!;
    const integration = getIntegrationFields(calendar);
    const widget = getWidgetFields(calendar);

    expect(integration.map((f) => f.key)).toEqual(
      expect.arrayContaining(['serverUrl', 'username', 'password'])
    );
    expect(widget.map((f) => f.key)).toEqual(expect.arrayContaining(['calendarPath', 'rangeDays']));
  });
});
