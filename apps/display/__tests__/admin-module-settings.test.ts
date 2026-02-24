import { describe, it, expect } from 'vitest';
import { readFileSync, existsSync } from 'fs';
import { join } from 'path';

describe('AdminModuleSettings Component', () => {
  const settingsPath = join(__dirname, '../src/lib/AdminModuleSettings.svelte');

  it('should have AdminModuleSettings.svelte file', () => {
    expect(existsSync(settingsPath)).toBe(true);
  });

  it('should import MODULE_SCHEMAS from @lensing/types', () => {
    const source = readFileSync(settingsPath, 'utf-8');
    expect(source).toContain('MODULE_SCHEMAS');
    expect(source).toContain('@lensing/types');
  });

  it('should import AdminModuleCard', () => {
    const source = readFileSync(settingsPath, 'utf-8');
    expect(source).toContain('AdminModuleCard');
  });

  it('should fetch settings on mount', () => {
    const source = readFileSync(settingsPath, 'utf-8');
    expect(source).toContain("fetch('/settings')");
  });

  it('should save settings via PUT /settings', () => {
    const source = readFileSync(settingsPath, 'utf-8');
    expect(source).toContain("method: 'PUT'");
    expect(source).toContain("'/settings'");
  });

  it('should render each MODULE_SCHEMAS entry', () => {
    const source = readFileSync(settingsPath, 'utf-8');
    expect(source).toContain('{#each MODULE_SCHEMAS');
  });

  it('should show loading state', () => {
    const source = readFileSync(settingsPath, 'utf-8');
    expect(source).toContain('Loading settings');
  });

  it('should show error state', () => {
    const source = readFileSync(settingsPath, 'utf-8');
    expect(source).toContain('Error:');
  });
});

describe('AdminModuleCard Component', () => {
  const cardPath = join(__dirname, '../src/lib/AdminModuleCard.svelte');

  it('should have AdminModuleCard.svelte file', () => {
    expect(existsSync(cardPath)).toBe(true);
  });

  it('should accept schema prop', () => {
    const source = readFileSync(cardPath, 'utf-8');
    expect(source).toContain('export let schema');
  });

  it('should accept enabled prop', () => {
    const source = readFileSync(cardPath, 'utf-8');
    expect(source).toContain('export let enabled');
  });

  it('should accept config prop', () => {
    const source = readFileSync(cardPath, 'utf-8');
    expect(source).toContain('export let config');
  });

  it('should accept onSave callback', () => {
    const source = readFileSync(cardPath, 'utf-8');
    expect(source).toContain('export let onSave');
  });

  it('should display module name and description', () => {
    const source = readFileSync(cardPath, 'utf-8');
    expect(source).toContain('schema.name');
    expect(source).toContain('schema.description');
  });

  it('should show enable/disable toggle', () => {
    const source = readFileSync(cardPath, 'utf-8');
    expect(source).toContain('Enable');
    expect(source).toContain('Disable');
  });

  it('should show configure button', () => {
    const source = readFileSync(cardPath, 'utf-8');
    expect(source).toContain('Configure');
  });

  it('should use AdminConfigForm for field rendering', () => {
    const source = readFileSync(cardPath, 'utf-8');
    expect(source).toContain('AdminConfigForm');
  });

  it('should show restart required notice after save', () => {
    const source = readFileSync(cardPath, 'utf-8');
    expect(source).toContain('restart required');
  });

  it('should use design system tokens', () => {
    const source = readFileSync(cardPath, 'utf-8');
    expect(source).toContain('--event-horizon');
    expect(source).toContain('--edge');
    expect(source).toContain('--ember');
  });
});

describe('Admin Page Tabs', () => {
  const pagePath = join(__dirname, '../src/routes/admin/+page.svelte');

  it('should import AdminModuleSettings', () => {
    const source = readFileSync(pagePath, 'utf-8');
    expect(source).toContain('AdminModuleSettings');
  });

  it('should have Plugins tab', () => {
    const source = readFileSync(pagePath, 'utf-8');
    expect(source).toContain('Plugins');
  });

  it('should have Settings tab', () => {
    const source = readFileSync(pagePath, 'utf-8');
    expect(source).toContain('Settings');
  });

  it('should conditionally render plugin list or module settings', () => {
    const source = readFileSync(pagePath, 'utf-8');
    expect(source).toContain('AdminPluginList');
    expect(source).toContain('AdminModuleSettings');
  });

  it('should track activeTab state', () => {
    const source = readFileSync(pagePath, 'utf-8');
    expect(source).toContain('activeTab');
  });
});

describe('AdminConfigForm password support', () => {
  const formPath = join(__dirname, '../src/lib/AdminConfigForm.svelte');

  it('should support password field type', () => {
    const source = readFileSync(formPath, 'utf-8');
    expect(source).toContain('type="password"');
  });

  it('should check for password type in conditional', () => {
    const source = readFileSync(formPath, 'utf-8');
    expect(source).toContain("field.type === 'password'");
  });
});
