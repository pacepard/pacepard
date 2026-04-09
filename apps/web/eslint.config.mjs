import { nextJsConfig } from '../../configs/eslint/next.js'

const eslintConfig = [
  {
    ignores: ['node_modules/**', '.next/**', 'out/**', 'build/**', 'next-env.d.ts'],
  },
  ...nextJsConfig,
]

export default eslintConfig
