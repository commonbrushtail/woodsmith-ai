import js from '@eslint/js'
import globals from 'globals'
import reactHooks from 'eslint-plugin-react-hooks'
import { defineConfig, globalIgnores } from 'eslint/config'

export default defineConfig([
  // Build output + one-off dev/migration scripts (not shipped app code).
  globalIgnores(['.next', 'dist', 'coverage', 'playwright-report', 'test-results', 'scripts']),
  {
    files: ['**/*.{js,jsx}'],
    extends: [
      js.configs.recommended,
    ],
    plugins: {
      'react-hooks': reactHooks,
    },
    languageOptions: {
      ecmaVersion: 2020,
      // Next.js code spans browser (components) and Node (server actions,
      // middleware, config) runtimes, so allow both global sets.
      globals: { ...globals.browser, ...globals.node },
      parserOptions: {
        ecmaVersion: 'latest',
        ecmaFeatures: { jsx: true },
        sourceType: 'module',
      },
    },
    rules: {
      'no-unused-vars': ['error', { varsIgnorePattern: '^[A-Z_]' }],
      // Only the two classic, universally-valuable hooks rules. The v7
      // `recommended` bundle also enables React Compiler rules
      // (set-state-in-effect, static-components, immutability, …) which are
      // inappropriately strict for this non-Compiler app — they flag idiomatic
      // patterns like the ClientOnly mount effect. rules-of-hooks stays because
      // it caught a real hook-order bug in ProductDetailClient.
      'react-hooks/rules-of-hooks': 'error',
      'react-hooks/exhaustive-deps': 'warn',
    },
  },
])
