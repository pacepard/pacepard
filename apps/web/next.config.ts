/** next.config.ts */
import createMDX from "@next/mdx";
import type { NextConfig } from "next";

const mdx = createMDX({
  options: {
    remarkPlugins: [],
    rehypePlugins: [],
  },
});

const nextConfig: NextConfig = {
  pageExtensions: ["js", "jsx", "mdx", "ts", "tsx"],
  images: { unoptimized: true },
  experimental: {
    mdxRs: false,
  },
  // Docker/Coolify: ESLint flat config pulls repo-wide deps; lint stays in CI (`pnpm lint`).
  eslint: {
    ignoreDuringBuilds: process.env.NEXT_DISABLE_ESLINT === "1",
  },
};

export default mdx(nextConfig);
