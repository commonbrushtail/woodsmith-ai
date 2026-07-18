/** @type {import('next').NextConfig} */
const nextConfig = {
  // Emit a self-contained server bundle (.next/standalone) for a lean Docker image.
  output: 'standalone',
  experimental: {
    serverActions: {
      bodySizeLimit: '10mb',
    },
  },
  images: {
    disableStaticImages: true,
  },
  turbopack: {},
  webpack(config) {
    config.module.rules.push({
      test: /\.(png|jpe?g|gif|svg|webp|avif|ico)$/i,
      type: 'asset/resource',
    })
    return config
  },
}

export default nextConfig
