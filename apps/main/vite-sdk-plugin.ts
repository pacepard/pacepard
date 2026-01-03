import type { Plugin } from 'vite';
import path from 'path';
import fs from 'fs';

/**
 * Vite plugin to resolve SDK's internal @/ path aliases
 * Rewrites @/ imports in SDK files to relative paths
 */
export function sdkPathAliasPlugin(): Plugin {
  const sdkSrcPath = path.resolve(__dirname, '../../packages/sdk/src');
  
  return {
    name: 'sdk-path-alias',
    enforce: 'pre',
    transform(code, id) {
      // Only process SDK files
      if (id.includes('packages/sdk/src') && code.includes("from '@/")) {
        const fileDir = path.dirname(id);
        const relativeToSdkSrc = path.relative(sdkSrcPath, fileDir);
        
        // Replace @/ imports with relative paths
        const transformedCode = code.replace(
          /from\s+['"]@\/([^'"]+)['"]/g,
          (match, importPath) => {
            const targetPath = path.resolve(sdkSrcPath, importPath);
            const relativePath = path.relative(fileDir, targetPath);
            
            // Normalize the path for use in imports (use forward slashes)
            const normalizedPath = relativePath.split(path.sep).join('/');
            const importPathWithDot = normalizedPath.startsWith('.') 
              ? normalizedPath 
              : `./${normalizedPath}`;
            
            return `from '${importPathWithDot}'`;
          }
        );
        
        return transformedCode !== code ? transformedCode : null;
      }
      return null;
    },
    resolveId(id, importer) {
      // Fallback: also try to resolve @/ imports from SDK files
      if (id.startsWith('@/') && importer) {
        const normalizedImporter = path.isAbsolute(importer) 
          ? importer 
          : path.resolve(process.cwd(), importer);
        
        if (normalizedImporter.includes('packages/sdk/src')) {
          const relativePath = id.slice(2);
          const targetPath = path.resolve(sdkSrcPath, relativePath);
          
          const extensions = ['.ts', '.tsx', '.js', '.jsx', '.json'];
          for (const ext of extensions) {
            const fullPath = targetPath + ext;
            if (fs.existsSync(fullPath)) {
              return fullPath;
            }
          }
          
          if (fs.existsSync(targetPath) && fs.statSync(targetPath).isDirectory()) {
            for (const ext of extensions) {
              const indexPath = path.join(targetPath, `index${ext}`);
              if (fs.existsSync(indexPath)) {
                return indexPath;
              }
            }
          }
          
          return targetPath;
        }
      }
      return null;
    },
  };
}
