module.exports = {
  root: true,
  env: {
    es6: true,
    node: true,
  },
  parserOptions: {
    sourceType: 'module',
    ecmaVersion: 12,
  },
  extends: [
    'eslint:recommended',
    'plugin:prettier/recommended',
    'plugin:jest/recommended',
  ],
  rules: {},
};
