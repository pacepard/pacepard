
import path from "path";
import tailwindcss from "@tailwindcss/vite";
import { defineConfig, loadEnv } from "vite";
import react from '@vitejs/plugin-react-swc';
import { sdkPathAliasPlugin } from './vite-sdk-plugin';
import { blocsPathAliasPlugin } from './vite-blocs-plugin';

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), "");
  const PORT = env.PORT ? parseInt(env.PORT) : 5176;

  return {
    plugins: [sdkPathAliasPlugin(), blocsPathAliasPlugin(), react(), tailwindcss()],
    resolve: {
      alias: {
        "@": path.resolve(__dirname, "./src"),
        "@pacepard/ui/globals.css": path.resolve(__dirname, "../../packages/ui/src/styles/globals.css"),
        "@pacepard/ui": path.resolve(__dirname, "../../packages/ui/src"),
        "@pacepard/ui/lib": path.resolve(__dirname, "../../packages/ui/src/lib"),
        "@pacepard/ui/components": path.resolve(__dirname, "../../packages/ui/src/components"),
        "@pacepard/ui/hooks": path.resolve(__dirname, "../../packages/ui/src/hooks"),
        "@pacepard/sdk": path.resolve(__dirname, "../../packages/sdk/src"),
        "@pacepard/blocs/primitives": path.resolve(__dirname, "../../packages/blocs/src/core/primitives"),
        "@pacepard/blocs/ui": path.resolve(__dirname, "../../packages/blocs/src/core/ui"),
        "@pacepard/blocs/node": path.resolve(__dirname, "../../packages/blocs/src/core/node"),
        "@pacepard/blocs/icons": path.resolve(__dirname, "../../packages/blocs/src/core/icons"),
        "@pacepard/blocs/editor": path.resolve(__dirname, "../../packages/blocs/src/editor"),
        "@pacepard/blocs": path.resolve(__dirname, "../../packages/blocs/src"),
      },
      extensions: ['.js', '.jsx', '.ts', '.tsx', '.json'],
      preserveSymlinks: false,
      dedupe: ['react', 'react-dom', '@tanstack/react-query', '@tanstack/query-core', '@tanstack/query-devtools'],
    },
    server: {
      port: PORT,
      // Bind to 127.0.0.1 to avoid EPERM on ::1 in sandboxes/restricted environments
      host: '127.0.0.1',
    },
    optimizeDeps: {
      include: [
        '@pacepard/ui',
        'react',
        'react-dom',
      ],
      exclude: [
        '@pacepard/sdk',
        '@pacepard/blocs',
      ],
      esbuildOptions: {
        resolveExtensions: ['.tsx', '.ts', '.jsx', '.js', '.mjs'],
      },
    },
  };
});
