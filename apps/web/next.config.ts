/** next.config.ts */
import createMDX from "@next/mdx";
import type { NextConfig } from "next";
import path from "path";

const mdx = createMDX({
  options: {
    remarkPlugins: [],
    rehypePlugins: [],
  },
});

const nextConfig: NextConfig = {
  pageExtensions: ["js", "jsx", "mdx", "ts", "tsx"],
  // Standalone output bundles only needed node_modules into .next/standalone,
  // eliminating the full pnpm install in the Docker production stage.
  output: "standalone",
  // Tells Next.js file tracing to resolve workspace-symlinked packages
  // (e.g. @pacepard/ui) from the monorepo root, not the app directory.
  outputFileTracingRoot: path.join(__dirname, "../../"),
  images: { unoptimized: true },
  experimental: {
    mdxRs: false,
  },
  // Docker/Coolify: lint and type checks run in CI, not during Docker build.
  eslint: {
    ignoreDuringBuilds: process.env.NEXT_DISABLE_ESLINT === "1",
  },
  typescript: {
    ignoreBuildErrors: process.env.NEXT_DISABLE_TYPECHECK === "1",
  },
};

export default mdx(nextConfig);
