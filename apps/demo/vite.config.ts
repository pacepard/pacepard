import { defineConfig } from 'vite'
import path from 'path'
import react from '@vitejs/plugin-react'
import { blocsPathAliasPlugin } from './vite-blocs-plugin'

// https://vite.dev/config/
export default defineConfig({
  plugins: [blocsPathAliasPlugin(), react()],
  resolve: {
    alias: [
      { find: '@', replacement: path.resolve(__dirname, './src') },
      { find: '@simple', replacement: path.resolve(__dirname, './src/simple') },
      { find: '@notion-like', replacement: path.resolve(__dirname, './src/notion-like') },
      // Blocs subpaths first so they match before the base package
      { find: '@pacepard/blocs/primitives', replacement: path.resolve(__dirname, '../../packages/blocs/src/core/primitives') },
      { find: '@pacepard/blocs/ui', replacement: path.resolve(__dirname, '../../packages/blocs/src/core/ui') },
      { find: '@pacepard/blocs/node', replacement: path.resolve(__dirname, '../../packages/blocs/src/core/node') },
      { find: '@pacepard/blocs/icons', replacement: path.resolve(__dirname, '../../packages/blocs/src/core/icons') },
      { find: '@pacepard/blocs/utils', replacement: path.resolve(__dirname, '../../packages/blocs/src/utils') },
      { find: '@pacepard/blocs/styles', replacement: path.resolve(__dirname, '../../packages/blocs/src/styles') },
      { find: '@pacepard/blocs', replacement: path.resolve(__dirname, '../../packages/blocs/src') },
    ],
  },
})
