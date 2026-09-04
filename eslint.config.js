import { defineConfig } from 'eslint/config'
import * as config from '@lvce-editor/eslint-config'

export default defineConfig([
  ...config.default,
  ...config.recommendedActions,
  {
    rules: {
      'unicorn/error-message': 'off',
      '@typescript-eslint/prefer-readonly-parameter-types': 'off',
      'github-actions/ci-versions': 'off',
    },
  },
  {
    ignores: ['src/index.d.ts'],
  },
])
