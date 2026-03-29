module.exports = {
  extends: ['standard', 'plugin:prettier/recommended'],
  parserOptions: {
    sourceType: 'module'
  },
  env: {
    es6: true,
    node: true
  },
  overrides: [
    {
      files: ['test/**/*.js'],
      extends: ['plugin:jest/recommended'],
      env: {
        jest: true
      }
    }
  ],
  rules: {
    'prettier/prettier': ['error', { singleQuote: true, semi: false }],
    'no-unused-expressions': 0
  }
}
