module.exports = {
  root: true,
  env: {
    es6: true,
    node: true,
  },
  parserOptions: {
    sourceType: 'module',
    ecmaVersion: 11,
  },
  extends: [
    'eslint:recommended',
    'plugin:prettier/recommended',
    'plugin:jest/recommended',
  ],
  rules: {
    'func-names': 'off',
    'no-console': 'off',
    'no-param-reassign': 'off',
    'no-self-assign': 'off',
    'no-restricted-syntax': 'off',
    'guard-for-in': 'off',
  },
};
