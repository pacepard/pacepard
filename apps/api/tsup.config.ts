import { defineConfig } from 'tsup';

export default defineConfig({
    // Main entry point - tsup will bundle dependencies automatically
    entry: ['src/server.ts'],
    format: ['esm'],
    target: 'node20',
    outDir: 'dist',
    clean: true,
    bundle: true, // Bundle all dependencies into single file
    splitting: false,
    sourcemap: false,
    minify: false,
    dts: false,
    // tsup/esbuild automatically adds .js extensions to relative imports
    // when compiling to ESM format, which satisfies Node.js ESM requirements
    onSuccess: 'copyfiles -u 1 "src/_data/**/*" "src/views/**/*" dist/',
});
