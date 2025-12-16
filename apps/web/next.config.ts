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
  images: { unoptimized: true },
  experimental: {
    mdxRs: false,
  },
  outputFileTracingRoot: path.join(__dirname, "../../"), 
};

export default mdx(nextConfig);
