import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "export",
  trailingSlash: true,
  images: { unoptimized: true },
  basePath: process.env.GITHUB_PAGES === "true" ? "/elia-future-readiness-survey-results" : "",
  assetPrefix: process.env.GITHUB_PAGES === "true" ? "/elia-future-readiness-survey-results/" : "",
};

export default nextConfig;
