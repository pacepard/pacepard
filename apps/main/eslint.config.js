import { config } from '@pacepard/configs/eslint/react-internal'

export default [
  {
    ignores: ['dist/**', 'node_modules/**'],
  },
  ...config,
]
