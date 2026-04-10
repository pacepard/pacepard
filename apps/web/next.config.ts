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
  images: { unoptimized: true },
  experimental: {
    mdxRs: false,
    // Required for standalone in a pnpm monorepo: tells Next.js file tracing
    // to resolve workspace-symlinked packages (e.g. @pacepard/ui) from the repo root.
    outputFileTracingRoot: path.join(__dirname, "../../"),
  },
  // Docker/Coolify: ESLint flat config pulls repo-wide deps; lint stays in CI (`pnpm lint`).
  eslint: {
    ignoreDuringBuilds: process.env.NEXT_DISABLE_ESLINT === "1",
  },
};

export default mdx(nextConfig);
