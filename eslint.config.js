export default [
  {
    'extends': ['eslint:recommend', 'prettier'],
    'rules': {
      'no-console': 'off',
      'no-unused-vars': 'warn',
      'prefer-const': ['error'],
      'quotes': ['error', 'single'],
      'func-style': ['warn', 'declaration', { allowArrowFunctions: true }],
      'comma-dangle': ['error', 'always'],
      'curly': ['warn', 'all'],
      'max-len': [0, 120, 'error', { ignoreUrls: true }],
    },
  },
]
