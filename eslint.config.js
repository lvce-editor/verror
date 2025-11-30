import * as config from '@lvce-editor/eslint-config'
import * as actions from '@lvce-editor/eslint-plugin-github-actions'

export default [
  ...config.default,
  ...actions.default,
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
]
