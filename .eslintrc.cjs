// eslint-disable-next-line @typescript-eslint/no-var-requires
const path = require('path')

/** @type {import("eslint").Linter.Config} */
const config = {
  overrides: [
    {
      extends: [
        'plugin:@typescript-eslint/recommended-requiring-type-checking',
      ],
      files: ['*.ts', '*.tsx'],
      parserOptions: { project: path.join(__dirname, 'tsconfig.json') },
    },
  ],
  parser: '@typescript-eslint/parser',
  parserOptions: { project: path.join(__dirname, 'tsconfig.json') },
  plugins: ['@typescript-eslint'],
  extends: [
    'next/core-web-vitals',
    'plugin:@typescript-eslint/recommended',
    'eslint:recommended',
    'plugin:react/recommended',
  ],
  rules: {
    '@typescript-eslint/ban-ts-comment': [
      'error',
      { 'ts-ignore': 'allow-with-description' },
    ],
    '@typescript-eslint/no-misused-promises': [
      2,
      { checksVoidReturn: { attributes: false } },
    ],
    '@typescript-eslint/consistent-type-imports': [
      'warn',
      {
        prefer: 'type-imports',
        fixStyle: 'inline-type-imports',
      },
    ],
    '@typescript-eslint/no-unused-vars': ['warn', { argsIgnorePattern: '^_' }],
    'react/react-in-jsx-scope': 'off',
    'react/no-unused-vars': 'off',
    'react/prop-types': 'off', // Using TypeScript
    'no-unused-vars': 'off',
    'array-bracket-newline': ['error', { multiline: true }],
    // 'array-bracket-spacing': [
    //   'warn',
    //   'always',
    // ],
    'arrow-parens': ['warn', 'always'],
    'arrow-spacing': [
      'warn',
      {
        before: true,
        after: true,
      },
    ],
    'block-spacing': ['warn', 'always'],
    'brace-style': ['warn', '1tbs', { allowSingleLine: true }],
    camelcase: ['warn', { properties: 'never' }],
    'comma-spacing': [
      'warn',
      {
        before: false,
        after: true,
      },
    ],
    'comma-style': ['warn', 'last'],
    'computed-property-spacing': ['warn', 'never'],
    curly: ['warn', 'multi-line', 'consistent'],
    'dot-location': ['warn', 'property'],
    'eol-last': ['warn', 'always'],
    'func-call-spacing': ['warn', 'never'],
    'function-call-argument-newline': ['warn', 'consistent'],
    'jsx-quotes': ['warn', 'prefer-single'],
    'key-spacing': [
      'warn',
      {
        beforeColon: false,
        afterColon: true,
      },
    ],
    'keyword-spacing': [
      'warn',
      {
        before: true,
        after: true,
      },
    ],
    'no-multiple-empty-lines': [
      'warn',
      {
        max: 1,
        maxEOF: 0,
      },
    ],
    'no-trailing-spaces': ['warn', { ignoreComments: true }],
    'object-property-newline': ['warn', { allowAllPropertiesOnSameLine: true }],
    quotes: [
      'warn',
      'single',
      {
        avoidEscape: true,
        allowTemplateLiterals: true,
      },
    ],
    semi: ['warn', 'never'],
  },
}

module.exports = config
