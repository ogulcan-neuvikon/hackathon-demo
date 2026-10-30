import type { NextConfig } from "next";

// basePath is only needed for GitHub Pages, which serves the site from
// /<repo>/. On Vercel (or any host serving from the domain root) it must be
// empty, or the root URL 404s.
const isGitHubPages = process.env.GITHUB_ACTIONS === "true";
const repo = "/hackathon-demo";

const nextConfig: NextConfig = {
  output: "export",
  basePath: isGitHubPages ? repo : "",
  assetPrefix: isGitHubPages ? repo : "",
  trailingSlash: true,
  images: { unoptimized: true },
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
};

export default nextConfig;
