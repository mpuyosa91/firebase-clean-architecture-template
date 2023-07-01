// eslint-disable-next-line no-undef
module.exports = {
  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:prettier/recommended',
  ],
  plugins: ['@typescript-eslint', 'prettier'],
  rules: {
    'prettier/prettier': 'error',
    'no-console': 'off',
    '@typescript-eslint/no-unused-vars': [
      'error',
      {
        varsIgnorePattern: '^_*$',
        argsIgnorePattern: '^_*$',
        caughtErrorsIgnorePattern: '^_*$',
      },
    ],
    '@typescript-eslint/explicit-module-boundary-types': 'off',
  },
  overrides: [
    {
      files: '*Controller.ts',
      rules: {
        '@typescript-eslint/no-explicit-any': 'off',
      },
    },
  ],
};
