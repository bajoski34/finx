const { FlatCompat } = require('@eslint/eslintrc');
const js = require('@eslint/js');
const { fixupConfigRules } = require('@eslint/compat');

const compat = new FlatCompat({
  baseDirectory: __dirname,
  recommendedConfig: js.configs.recommended,
});

module.exports = [
  { ignores: ['**/dist', '**/coverage', '**/node_modules'] },
  ...fixupConfigRules(
    compat.extends(
      '@nx/typescript',
      '@nx/javascript',
    )
  ),
  {
    files: ['**/*.ts', '**/*.tsx', '**/*.js', '**/*.jsx'],
    rules: {
      '@typescript-eslint/no-explicit-any': 'warn',
      '@typescript-eslint/no-unused-vars': ['error', { argsIgnorePattern: '^_' }],
      'prefer-const': 'error',
      'no-var': 'error',
    },
  },
  {
    files: ['**/*.ts', '**/*.tsx'],
    rules: {},
  },
  {
    files: ['**/*.js', '**/*.jsx'],
    rules: {},
  },
];