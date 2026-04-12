import { config } from '@pacepard/configs/eslint/react-internal.js'

export default [
  {
    ignores: ['dist/**', 'node_modules/**'],
  },
  ...config,
]
