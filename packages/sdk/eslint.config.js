import { config } from '@pacepard/configs/eslint/react-internal'

export default [
  {
    ignores: ['node_modules/**', 'dist/**'],
  },
  ...config,
]
