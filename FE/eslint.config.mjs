import { dirname } from 'path'
import { fileURLToPath } from 'url'
import { FlatCompat } from '@eslint/eslintrc'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

const compat = new FlatCompat({
  baseDirectory: __dirname
})

const eslintConfig = [
  ...compat.config({
    extends: [
      'next/core-web-vitals',
      'next/typescript',
      'plugin:tailwindcss/recommended',
      'plugin:@tanstack/query/recommended'
    ],
    rules: {
      'react/no-unescaped-entities': 'off',
      '@next/next/no-page-custom-font': 'off',
      // "no-console": ["error", { allow: ["info", "warn", "error"] }],
      'tailwindcss/classnames-order': 'off',
      'tailwindcss/no-custom-classname': 'off',
      '@typescript-eslint/no-require-imports': 'off',
      'tailwindcss/enforces-negative-arbitrary-values': 'off',
      '@typescript-eslint/no-unused-vars': 'off'
    },
    overrides: [
      {
        files: ['*.ts', '*.tsx', '*.js'],
        parser: '@typescript-eslint/parser'
      }
    ]
  })
]

export default eslintConfig
