import { config } from '@pacepard/configs/eslint/react-internal.js'

export default [
  {
    ignores: ['node_modules/**', 'dist/**'],
  },
  ...config,
]
