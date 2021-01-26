module.exports = {
  root: true,
  extends: [
    'airbnb-base',
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
