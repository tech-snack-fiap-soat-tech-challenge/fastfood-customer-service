// @ts-check
import eslint from '@eslint/js';
import tseslint from 'typescript-eslint';
import importPlugin from 'eslint-plugin-import';

export default tseslint.config(
  eslint.configs.recommended,
  tseslint.configs.recommended,
  importPlugin.flatConfigs.typescript,
  {
    ignores: ['**/dist/*', '**/database/*', '**/coverage/*', '*.config.mjs'],
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
          groups: ['external', 'internal'],
          pathGroups: [{ pattern: '@/*', group: 'internal' }],
          'newlines-between': 'always',
        },
      ],
    },
  },
);
