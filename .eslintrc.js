module.exports = {
  root: true,
  parser: '@typescript-eslint/parser',
  plugins: ['@typescript-eslint', 'prettier'],
  extends: [
    'eslint:recommended',
    '@typescript-eslint/recommended',
    'prettier',
    'plugin:prettier/recommended',
  ],
  parserOptions: {
    ecmaVersion: 2020,
    sourceType: 'module',
    project: './tsconfig.json',
  },
  env: {
    node: true,
    es6: true,
  },
  rules: {
    'prettier/prettier': 'error',
    '@typescript-eslint/no-unused-vars': ['error', { argsIgnorePattern: '^_' }],
    '@typescript-eslint/explicit-function-return-type': 'warn',
    '@typescript-eslint/no-explicit-any': 'warn',
    '@typescript-eslint/prefer-const': 'error',
    'no-console': 'warn',
    'prefer-const': 'error',
  },
  overrides: [
    {
      files: ['src/main/**/*.ts'],
      env: {
        node: true,
        browser: false,
      },
    },
    {
      files: ['src/renderer/**/*.ts'],
      env: {
        browser: true,
        node: false,
      },
      globals: {
        electronAPI: 'readonly',
      },
    },
    {
      files: ['tests/**/*.ts', '**/*.test.ts'],
      env: {
        jest: true,
      },
    },
  ],
};