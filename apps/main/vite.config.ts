import path from "path";
import tailwindcss from "@tailwindcss/vite";
import { defineConfig, loadEnv } from "vite";
import react from '@vitejs/plugin-react-swc';
import { sdkPathAliasPlugin } from './vite-sdk-plugin';

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), "");
  const PORT = env.PORT ? parseInt(env.PORT) : 5176;

  return {
    plugins: [sdkPathAliasPlugin(), react(), tailwindcss()],
    resolve: {
      alias: {
        "@": path.resolve(__dirname, "./src"),
        "@pacepard/ui/globals.css": path.resolve(__dirname, "../../packages/ui/src/styles/globals.css"),
        "@pacepard/ui": path.resolve(__dirname, "../../packages/ui/src"),
        "@pacepard/ui/lib": path.resolve(__dirname, "../../packages/ui/src/lib"),
        "@pacepard/ui/components": path.resolve(__dirname, "../../packages/ui/src/components"),
        "@pacepard/ui/hooks": path.resolve(__dirname, "../../packages/ui/src/hooks"),
        "@pacepard/sdk": path.resolve(__dirname, "../../packages/sdk/src"),
      },
      extensions: ['.js', '.jsx', '.ts', '.tsx', '.json'],
      preserveSymlinks: true,
      dedupe: ['react', 'react-dom', '@tanstack/react-query', '@tanstack/query-core', '@tanstack/query-devtools'],
    },
    css: {
      preprocessorOptions: {
        css: {
          additionalData: undefined,
        },
      },
    },
    define: {
      'import.meta.env.VITE_APP_API_URL': JSON.stringify(env.VITE_APP_API_URL || ''),
    },
    server: {
      port: PORT,
    },
    optimizeDeps: {
      include: [
        '@pacepard/ui',
        '@pacepard/core',
        'react',
        'react-dom',
        'react-router',
        'react-router-dom',
        '@tanstack/react-query',
        '@tanstack/query-core',
        '@tanstack/query-devtools',
      ],
      exclude: [
        '@pacepard/sdk',
      ],
      esbuildOptions: {
        resolveExtensions: ['.tsx', '.ts', '.jsx', '.js', '.mjs'],
      },
    },
  };
});
