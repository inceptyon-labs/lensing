import eslint from '@eslint/js';
import tseslint from 'typescript-eslint';
import sveltePlugin from 'eslint-plugin-svelte';
import globals from 'globals';
import eslintConfigPrettier from 'eslint-config-prettier';

export default tseslint.config(
  // Base JS recommended rules
  eslint.configs.recommended,

  // TypeScript rules for .ts/.tsx/.js files
  ...tseslint.configs.recommended,
  {
    files: ['**/*.ts', '**/*.tsx', '**/*.js'],
    languageOptions: {
      ecmaVersion: 2022,
      sourceType: 'module',
      globals: {
        ...globals.browser,
        ...globals.node,
        ...globals.es2021,
      },
      parserOptions: {
        project: './tsconfig.base.json',
        extraFileExtensions: ['.svelte'],
      },
    },
    rules: {
      '@typescript-eslint/no-unused-vars': ['error', { argsIgnorePattern: '^_' }],
    },
  },

  // Svelte files
  ...sveltePlugin.configs['flat/recommended'],
  {
    files: ['**/*.svelte'],
    languageOptions: {
      parserOptions: {
        parser: tseslint.parser,
        project: './tsconfig.base.json',
      },
    },
  },

  // Prettier compatibility (disable conflicting rules)
  eslintConfigPrettier,
  ...sveltePlugin.configs['flat/prettier'],

  // Ignore patterns
  {
    ignores: [
      'node_modules/',
      'dist/',
      '.svelte-kit/',
      'build/',
      '.turbo/',
      '*.config.js',
      '*.config.ts',
      'pnpm-lock.yaml',
    ],
  }
);
