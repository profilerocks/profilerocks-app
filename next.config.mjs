/**
 * @type {import("next").NextConfig}
 */
const nextConfig = {
  allowedDevOrigins: process.env.ALLOWED_DEV_ORIGINS?.split(","),
  compress: true,
  distDir: "dist",
  output: "export",
  reactCompiler: true,
  trailingSlash: false,
  turbopack: {
    rules: {
      "*.svg": {
        loaders: ["@svgr/webpack"],
        as: "*.js"
      }
    }
  },
  typescript: {
    ignoreBuildErrors: true
  }
};

export default nextConfig;
