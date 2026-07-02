/** @type {import('next').NextConfig} */
const nextConfig = {
  // Disable static page generation to avoid Firebase server-side errors
  output: undefined,
  experimental: {
    // Optimize package imports for faster loading
    optimizePackageImports: ["firebase"],
  },
};

module.exports = nextConfig;
