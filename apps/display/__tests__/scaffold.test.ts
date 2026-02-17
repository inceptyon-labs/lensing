import { describe, it, expect } from 'vitest';
import * as fs from 'fs';
import * as path from 'path';

describe('SvelteKit scaffold', () => {
  const appDir = path.join(__dirname, '..');

  it('should have package.json with SvelteKit dependencies', () => {
    const pkgPath = path.join(appDir, 'package.json');
    expect(fs.existsSync(pkgPath)).toBe(true);

    const pkg = JSON.parse(fs.readFileSync(pkgPath, 'utf-8'));
    expect(pkg.name).toBe('@lensing/display');
    expect(pkg.devDependencies['svelte']).toBeDefined();
    expect(pkg.devDependencies['@sveltejs/kit']).toBeDefined();
    expect(pkg.devDependencies['vite']).toBeDefined();
    expect(pkg.devDependencies['typescript']).toBeDefined();
  });

  it('should have tsconfig.json with strict mode', () => {
    const tsConfigPath = path.join(appDir, 'tsconfig.json');
    expect(fs.existsSync(tsConfigPath)).toBe(true);

    const tsConfig = JSON.parse(fs.readFileSync(tsConfigPath, 'utf-8'));
    expect(tsConfig.compilerOptions.strict).toBe(true);
    expect(tsConfig.compilerOptions.moduleResolution).toBe('bundler');
  });

  it('should have vite.config.ts', () => {
    const vitePath = path.join(appDir, 'vite.config.ts');
    expect(fs.existsSync(vitePath)).toBe(true);
  });

  it('should have svelte.config.js', () => {
    const sveltePath = path.join(appDir, 'svelte.config.js');
    expect(fs.existsSync(sveltePath)).toBe(true);
  });

  it('should have src/app.html', () => {
    const appHtmlPath = path.join(appDir, 'src', 'app.html');
    expect(fs.existsSync(appHtmlPath)).toBe(true);

    const content = fs.readFileSync(appHtmlPath, 'utf-8');
    expect(content).toContain('%sveltekit.head%');
    expect(content).toContain('%sveltekit.body%');
  });

  it('should be a pnpm workspace member', () => {
    const workspacePath = path.join(appDir, '..', '..', 'pnpm-workspace.yaml');
    expect(fs.existsSync(workspacePath)).toBe(true);
    const content = fs.readFileSync(workspacePath, 'utf-8');
    expect(content).toContain('apps/*');
  });

  it('should have .gitignore', () => {
    const gitIgnorePath = path.join(appDir, '.gitignore');
    expect(fs.existsSync(gitIgnorePath)).toBe(true);
  });

  it('should have README.md', () => {
    const readmePath = path.join(appDir, 'README.md');
    expect(fs.existsSync(readmePath)).toBe(true);
  });
});
