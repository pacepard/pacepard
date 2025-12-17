import { config } from '@pacepard/configs/eslint/base'

export default [
  {
    ignores: ['node_modules/**', 'dist/**'],
  },
  ...config,
]
