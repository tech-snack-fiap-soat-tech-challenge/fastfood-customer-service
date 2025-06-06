// @ts-check
import eslint from '@eslint/js';
import tseslint from 'typescript-eslint';
import importPlugin from 'eslint-plugin-import';

export default tseslint.config(
  eslint.configs.recommended,
  tseslint.configs.recommended,
  importPlugin.flatConfigs.typescript,
  {
    ignores: ['**/dist/*', '**/database/*', '**/deployment/*', '**/coverage/*', '*.config.mjs'],
  },
  {
    files: ['**/*.ts', '**/*.js'],
    languageOptions: {
      sourceType: 'commonjs',
      parserOptions: {
        projectService: true,
        tsconfigRootDir: import.meta.dirname,
      },
    },
    plugins: { import: importPlugin },
    settings: {
      'import/resolver': {
        node: {
          extensions: ['.js', '.jsx', '.ts', '.tsx'],
        },
      },
    },
    rules: {
      'no-constant-binary-expression': 'off',
      'import/order': [
        'error',
        {
          groups: ['builtin', 'external', 'internal'],
          pathGroups: [
            { pattern: '@nestjs/', group: 'builtin', position: 'before' },
            { pattern: '@/*', group: 'internal', position: 'after' },
          ],
          'newlines-between': 'always',
        },
      ],
    },
  },
);
