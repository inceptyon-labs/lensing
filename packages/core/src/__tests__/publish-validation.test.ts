import { describe, it, expect } from 'vitest';
import { validatePublish } from '../publish-validation';

describe('validatePublish', () => {
  const validInput = {
    id: 'test-plugin',
    name: 'Test Plugin',
    version: '1.0.0',
    description: 'A test plugin',
    category: 'test',
    connector: {
      type: 'json-api',
      url: 'https://api.example.com',
      method: 'GET',
    },
    html: '<div>{{data}}</div>',
    css: 'div { color: blue; }',
    connectorTested: true,
    sampleData: { data: 'test' },
  };

  it('should pass validation for a valid plugin', () => {
    const result = validatePublish(validInput, []);
    expect(result.valid).toBe(true);
    expect(result.errors).toHaveLength(0);
  });

  it('should fail when plugin ID is not unique', () => {
    const result = validatePublish(validInput, ['test-plugin', 'other-plugin']);
    expect(result.valid).toBe(false);
    expect(result.errors).toContainEqual(
      expect.objectContaining({ field: 'id', code: 'DUPLICATE_ID' })
    );
  });

  it('should fail when plugin ID is empty', () => {
    const result = validatePublish({ ...validInput, id: '' }, []);
    expect(result.valid).toBe(false);
    expect(result.errors).toContainEqual(
      expect.objectContaining({ field: 'id', code: 'REQUIRED' })
    );
  });

  it('should fail when plugin name is empty', () => {
    const result = validatePublish({ ...validInput, name: '' }, []);
    expect(result.valid).toBe(false);
    expect(result.errors).toContainEqual(
      expect.objectContaining({ field: 'name', code: 'REQUIRED' })
    );
  });

  it('should fail when plugin version is empty', () => {
    const result = validatePublish({ ...validInput, version: '' }, []);
    expect(result.valid).toBe(false);
    expect(result.errors).toContainEqual(
      expect.objectContaining({ field: 'version', code: 'REQUIRED' })
    );
  });

  it('should fail when connector URL is empty', () => {
    const result = validatePublish(
      {
        ...validInput,
        connector: { ...validInput.connector, url: '' },
      },
      []
    );
    expect(result.valid).toBe(false);
    expect(result.errors).toContainEqual(
      expect.objectContaining({ field: 'connector.url', code: 'REQUIRED' })
    );
  });

  it('should fail when connector type is empty', () => {
    const result = validatePublish(
      {
        ...validInput,
        connector: { ...validInput.connector, type: '' },
      },
      []
    );
    expect(result.valid).toBe(false);
    expect(result.errors).toContainEqual(
      expect.objectContaining({ field: 'connector.type', code: 'REQUIRED' })
    );
  });

  it('should fail when connector has not been tested', () => {
    const result = validatePublish({ ...validInput, connectorTested: false }, []);
    expect(result.valid).toBe(false);
    expect(result.errors).toContainEqual(
      expect.objectContaining({
        field: 'connectorTested',
        code: 'CONNECTOR_NOT_TESTED',
      })
    );
  });

  it('should fail when template HTML is empty', () => {
    const result = validatePublish({ ...validInput, html: '' }, []);
    expect(result.valid).toBe(false);
    expect(result.errors).toContainEqual(
      expect.objectContaining({ field: 'html', code: 'REQUIRED' })
    );
  });

  it('should fail when template HTML is only whitespace', () => {
    const result = validatePublish({ ...validInput, html: '   \n  ' }, []);
    expect(result.valid).toBe(false);
    expect(result.errors).toContainEqual(
      expect.objectContaining({ field: 'html', code: 'REQUIRED' })
    );
  });

  it('should fail when package size exceeds 10MB', () => {
    const largeHtml = '<div>' + 'x'.repeat(11 * 1024 * 1024) + '</div>';
    const result = validatePublish({ ...validInput, html: largeHtml }, []);
    expect(result.valid).toBe(false);
    expect(result.errors).toContainEqual(
      expect.objectContaining({ field: 'size', code: 'TOO_LARGE' })
    );
  });

  it('should fail when template has unresolved placeholders', () => {
    const result = validatePublish(
      {
        ...validInput,
        html: '<div>{{name}} {{missing}}</div>',
        sampleData: { name: 'Test' },
      },
      []
    );
    expect(result.valid).toBe(false);
    expect(result.errors).toContainEqual(
      expect.objectContaining({ field: 'html', code: 'UNRESOLVED_PLACEHOLDERS' })
    );
  });

  it('should pass when all placeholders resolve with sampleData', () => {
    const result = validatePublish(
      {
        ...validInput,
        html: '<div>{{name}} {{value}}</div>',
        sampleData: { name: 'Test', value: 123 },
      },
      []
    );
    expect(result.valid).toBe(true);
    expect(result.errors).toHaveLength(0);
  });

  it('should collect all errors at once', () => {
    const result = validatePublish(
      {
        id: '',
        name: '',
        version: '',
        description: 'test',
        category: 'test',
        connector: {
          type: '',
          url: '',
        },
        html: '',
        css: '',
        connectorTested: false,
        sampleData: null,
      },
      ['other']
    );
    expect(result.valid).toBe(false);
    expect(result.errors.length).toBeGreaterThan(4);
    expect(result.errors.map((e) => e.field).sort()).toContain('id');
    expect(result.errors.map((e) => e.field).sort()).toContain('name');
    expect(result.errors.map((e) => e.field).sort()).toContain('version');
    expect(result.errors.map((e) => e.field).sort()).toContain('html');
  });

  it('should extract placeholders from template with regex', () => {
    const result = validatePublish(
      {
        ...validInput,
        html: '<div>{{user.name}} {{items[0].title}} {{status}}</div>',
        sampleData: { user: { name: 'Alice' }, items: [{ title: 'Item 1' }], status: 'ok' },
      },
      []
    );
    expect(result.valid).toBe(true);
    expect(result.errors).toHaveLength(0);
  });

  it('should handle missing sampleData as unresolved placeholders', () => {
    const result = validatePublish(
      {
        ...validInput,
        html: '<div>{{name}}</div>',
        sampleData: null,
      },
      []
    );
    expect(result.valid).toBe(false);
    expect(result.errors).toContainEqual(
      expect.objectContaining({ field: 'html', code: 'UNRESOLVED_PLACEHOLDERS' })
    );
  });

  it('should calculate size from uncompressed content', () => {
    const result = validatePublish(
      {
        id: 'size-test',
        name: 'Size Test',
        version: '1.0.0',
        description: 'x'.repeat(1000),
        category: 'test',
        connector: {
          type: 'json-api',
          url: 'https://api.example.com',
        },
        html: '<div>' + 'x'.repeat(1024 * 1024 * 5) + '</div>',
        css: 'div { color: blue; }' + 'x'.repeat(1024 * 1024 * 4),
        connectorTested: true,
        sampleData: null,
      },
      []
    );
    expect(result.valid).toBe(false);
    expect(result.errors).toContainEqual(
      expect.objectContaining({ field: 'size', code: 'TOO_LARGE' })
    );
  });
});
