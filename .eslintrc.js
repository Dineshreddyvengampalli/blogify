module.exports = {
  env: {
    es2022: true,
    node: true,
    jest: true,
  },
  extends: [
    'airbnb-base',
    'airbnb-typescript/base',
  ],
  parser: '@typescript-eslint/parser',
  parserOptions: {
    project: './tsconfig.json',
  },
  plugins: [
    '@typescript-eslint',
  ],
  rules: {
    'max-len': 0,
    'no-restricted-syntax': 'off',
    'no-await-in-loop': 'off',
    'no-continue': 'off',
    'guard-for-in': 'off',
    '@typescript-eslint/type-annotation-spacing': 'error',
    'import/no-cycle': 'off',
  },
};
