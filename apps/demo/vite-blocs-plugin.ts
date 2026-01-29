import type { Plugin } from 'vite';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

/**
 * Vite plugin to resolve Blocs package's internal @/ path aliases
 * Rewrites @/ imports in Blocs files to relative paths
 */
export function blocsPathAliasPlugin(): Plugin {
  const __filename = fileURLToPath(import.meta.url);
  const pluginDir = path.dirname(__filename);
  const blocsSrcPath = path.resolve(pluginDir, '../../packages/blocs/src');

  return {
    name: 'blocs-path-alias',
    enforce: 'pre',
    transform(code, id) {
      const isBlocsFile =
        id.includes('packages/blocs/src') || id.includes('@pacepard/blocs');
      const hasAtImports =
        code.includes("from '@/") ||
        code.includes("import '@/") ||
        code.includes('from "@/') ||
        code.includes('import "@/');

      // Only process blocs package files
      // Transform @/ imports to relative paths BEFORE Vite's alias resolution
      if (isBlocsFile && hasAtImports) {
        const fileDir = path.dirname(id);
        const extensions = ['.ts', '.tsx', '.js', '.jsx', '.json', '.scss', '.css'];

        // Replace @/ imports with relative paths
        // Handle both "from '@/...'" and "import '@/...'" patterns
        let transformedCode = code.replace(
          /from\s+['"]@\/([^'"]+)['"]/g,
          (match, importPath) => {
            const targetPath = path.resolve(blocsSrcPath, importPath);

            // Try to find the actual file with extension
            let actualPath = targetPath;
            for (const ext of extensions) {
              const fullPath = targetPath + ext;
              if (fs.existsSync(fullPath)) {
                actualPath = fullPath;
                break;
              }
            }

            // Recalculate relative path from actual file
            const actualRelativePath = path.relative(fileDir, actualPath);

            // Normalize the path for use in imports (use forward slashes)
            const normalizedPath = actualRelativePath.split(path.sep).join('/');
            const importPathWithDot = normalizedPath.startsWith('.')
              ? normalizedPath
              : `./${normalizedPath}`;

            // Remove extension for import statement (Vite/TypeScript will resolve it)
            // Keep .scss and .css so style imports resolve
            const importPathWithoutExt = importPathWithDot.replace(
              /\.(ts|tsx|js|jsx|json)$/,
              ''
            );

            return `from '${importPathWithoutExt}'`;
          }
        );

        // Also handle import '@/...' statements
        transformedCode = transformedCode.replace(
          /import\s+['"]@\/([^'"]+)['"]/g,
          (match, importPath) => {
            const targetPath = path.resolve(blocsSrcPath, importPath);

            // Try to find the actual file with extension
            let actualPath = targetPath;
            for (const ext of extensions) {
              const fullPath = targetPath + ext;
              if (fs.existsSync(fullPath)) {
                actualPath = fullPath;
                break;
              }
            }

            // Recalculate relative path from actual file
            const actualRelativePath = path.relative(fileDir, actualPath);

            // Normalize the path for use in imports (use forward slashes)
            const normalizedPath = actualRelativePath.split(path.sep).join('/');
            const importPathWithDot = normalizedPath.startsWith('.')
              ? normalizedPath
              : `./${normalizedPath}`;

            // Remove extension for import statement (keep .scss/.css for styles)
            const importPathWithoutExt = importPathWithDot.replace(
              /\.(ts|tsx|js|jsx|json)$/,
              ''
            );

            return `import '${importPathWithoutExt}'`;
          }
        );

        return transformedCode !== code ? transformedCode : null;
      }
      return null;
    },
    resolveId(id, importer) {
      // Intercept @/ imports when importer is a blocs file
      // This must run BEFORE Vite's alias resolution
      if (importer && id.startsWith('@/')) {
        const normalizedImporter = path.isAbsolute(importer)
          ? importer
          : path.resolve(process.cwd(), importer);

        if (
          normalizedImporter.includes('packages/blocs/src') ||
          normalizedImporter.includes('@pacepard/blocs')
        ) {
          const relativePath = id.slice(2); // Remove '@/' prefix
          const targetPath = path.resolve(blocsSrcPath, relativePath);

          // Try with extensions
          const extensions = ['.ts', '.tsx', '.js', '.jsx', '.json', '.scss', '.css'];
          for (const ext of extensions) {
            const fullPath = targetPath + ext;
            if (fs.existsSync(fullPath)) {
              return fullPath;
            }
          }

          // Try as directory with index file
          if (fs.existsSync(targetPath) && fs.statSync(targetPath).isDirectory()) {
            for (const ext of extensions) {
              const indexPath = path.join(targetPath, `index${ext}`);
              if (fs.existsSync(indexPath)) {
                return indexPath;
              }
            }
          }

          // Return the path even if file doesn't exist yet (Vite will handle the error)
          return targetPath;
        }
      }

      // Also handle already-resolved paths that point to wrong location
      // This catches cases where Vite's alias already resolved @/ to demo app
      if (importer && path.isAbsolute(id) && id.includes('apps/demo/src')) {
        const normalizedImporter = path.isAbsolute(importer)
          ? importer
          : path.resolve(process.cwd(), importer);

        if (
          normalizedImporter.includes('packages/blocs/src') ||
          normalizedImporter.includes('@pacepard/blocs')
        ) {
          // Extract the relative path from the wrong resolution
          const wrongBase = path.resolve(pluginDir, './src');
          const relativePath = path.relative(wrongBase, id);

          // Resolve it correctly relative to blocs package
          const correctPath = path.resolve(blocsSrcPath, relativePath);

          // Try with extensions
          const extensions = ['.ts', '.tsx', '.js', '.jsx', '.json', '.scss', '.css'];
          for (const ext of extensions) {
            const fullPath = correctPath + ext;
            if (fs.existsSync(fullPath)) {
              return fullPath;
            }
          }

          // Try as directory
          if (fs.existsSync(correctPath) && fs.statSync(correctPath).isDirectory()) {
            for (const ext of extensions) {
              const indexPath = path.join(correctPath, `index${ext}`);
              if (fs.existsSync(indexPath)) {
                return indexPath;
              }
            }
          }

          // Return path without extension - Vite will try to resolve it
          return correctPath;
        }
      }

      return null;
    },
  };
}
