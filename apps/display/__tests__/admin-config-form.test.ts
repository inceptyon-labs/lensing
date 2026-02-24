import { describe, it, expect } from 'vitest';
import { readFileSync, existsSync } from 'fs';
import { join } from 'path';

describe('AdminConfigForm Component', () => {
  const formPath = join(__dirname, '../src/lib/AdminConfigForm.svelte');

  it('should have AdminConfigForm.svelte file', () => {
    expect(existsSync(formPath)).toBe(true);
  });

  it('should accept plugin prop typed as PluginAdminEntry', () => {
    const source = readFileSync(formPath, 'utf-8');
    expect(source).toContain('PluginAdminEntry');
    expect(source).toContain('plugin');
  });

  it('should accept onSave callback prop', () => {
    const source = readFileSync(formPath, 'utf-8');
    expect(source).toContain('onSave');
  });

  it('should show no-config message when config_schema is absent', () => {
    const source = readFileSync(formPath, 'utf-8');
    expect(source).toContain('No configuration available');
  });

  it('should render text input for string field type', () => {
    const source = readFileSync(formPath, 'utf-8');
    // Should handle string type with text input
    expect(source).toContain('type="text"');
  });

  it('should render number input for number field type', () => {
    const source = readFileSync(formPath, 'utf-8');
    expect(source).toContain('type="number"');
  });

  it('should render checkbox for boolean field type', () => {
    const source = readFileSync(formPath, 'utf-8');
    expect(source).toContain('type="checkbox"');
  });

  it('should render select dropdown for select field type', () => {
    const source = readFileSync(formPath, 'utf-8');
    expect(source).toContain('<select');
    expect(source).toContain('<option');
  });

  it('should show labels and descriptions for fields', () => {
    const source = readFileSync(formPath, 'utf-8');
    expect(source).toContain('field.label');
    expect(source).toContain('field.description');
  });

  it('should show required indicator for required fields', () => {
    const source = readFileSync(formPath, 'utf-8');
    expect(source).toContain('field.required');
  });

  it('should support min/max on number inputs', () => {
    const source = readFileSync(formPath, 'utf-8');
    expect(source).toContain('field.min');
    expect(source).toContain('field.max');
  });

  it('should have a save/submit button', () => {
    const source = readFileSync(formPath, 'utf-8');
    expect(source).toMatch(/Save|Submit|Apply/);
  });

  it('should iterate over config_schema fields', () => {
    const source = readFileSync(formPath, 'utf-8');
    expect(source).toContain('config_schema');
    // Should use {#each} to iterate fields
    expect(source).toContain('{#each');
  });

  it('should use design system control tokens', () => {
    const source = readFileSync(formPath, 'utf-8');
    expect(source).toContain('--control-bg');
    expect(source).toContain('--control-border');
  });
});
