import { describe, it, expect } from 'vitest';
import { readFileSync } from 'fs';
import { join } from 'path';

describe('AdminPluginUpload Component', () => {
  const componentPath = join(__dirname, '../src/lib/AdminPluginUpload.svelte');

  it('should have AdminPluginUpload.svelte file', () => {
    const source = readFileSync(componentPath, 'utf-8');
    expect(source).toBeTruthy();
  });

  it('should have a file input that accepts .zip files', () => {
    const source = readFileSync(componentPath, 'utf-8');
    expect(source).toContain('type="file"');
    expect(source).toContain('.zip');
  });

  it('should have a drop zone for drag-and-drop', () => {
    const source = readFileSync(componentPath, 'utf-8');
    expect(source).toContain('dragover');
    expect(source).toContain('drop');
  });

  it('should have an upload/install button', () => {
    const source = readFileSync(componentPath, 'utf-8');
    expect(source).toMatch(/[Ii]nstall|[Uu]pload/);
  });

  it('should show error state feedback', () => {
    const source = readFileSync(componentPath, 'utf-8');
    expect(source).toContain('error');
  });

  it('should emit onInstalled callback', () => {
    const source = readFileSync(componentPath, 'utf-8');
    expect(source).toContain('onInstalled');
  });

  it('should POST to /plugins/install with zip body', () => {
    const source = readFileSync(componentPath, 'utf-8');
    expect(source).toContain('/plugins/install');
    expect(source).toContain('POST');
  });

  it('should use design system tokens for styling', () => {
    const source = readFileSync(componentPath, 'utf-8');
    expect(source).toContain('--edge');
    expect(source).toContain('--ember');
    expect(source).toContain('--void');
  });

  it('should show uploading state while request is in flight', () => {
    const source = readFileSync(componentPath, 'utf-8');
    expect(source).toMatch(/uploading|loading|submitting/i);
  });
});

describe('AdminPluginList integration', () => {
  const listPath = join(__dirname, '../src/lib/AdminPluginList.svelte');

  it('should import AdminPluginUpload', () => {
    const source = readFileSync(listPath, 'utf-8');
    expect(source).toContain('AdminPluginUpload');
  });

  it('should render AdminPluginUpload component', () => {
    const source = readFileSync(listPath, 'utf-8');
    expect(source).toContain('<AdminPluginUpload');
  });
});
