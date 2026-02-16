import { describe, it, expect } from 'vitest';
import { execSync } from 'node:child_process';

describe('ESLint configuration', () => {
  it('loads without errors and lints existing code', () => {
    // ESLint should exit 0 on existing clean code
    const result = execSync('npx eslint packages/types/src/index.ts', {
      cwd: process.cwd(),
      encoding: 'utf-8',
      stdio: ['pipe', 'pipe', 'pipe'],
    });
    // No output means no errors
    expect(result.trim()).toBe('');
  });

  it('detects intentional lint errors', () => {
    // ESLint should catch unused variables
    expect(() => {
      execSync('echo "const unused = 1;" | npx eslint --stdin --stdin-filename test.ts', {
        cwd: process.cwd(),
        encoding: 'utf-8',
        stdio: ['pipe', 'pipe', 'pipe'],
      });
    }).toThrow();
  });
});

describe('Prettier configuration', () => {
  it('loads and checks existing code', () => {
    // Prettier check should exit 0 on formatted code
    const result = execSync('npx prettier --check packages/types/src/index.ts', {
      cwd: process.cwd(),
      encoding: 'utf-8',
      stdio: ['pipe', 'pipe', 'pipe'],
    });
    // When all files are formatted, Prettier says "All matched files use Prettier code style!"
    expect(result).toContain('Prettier code style');
  });
});
