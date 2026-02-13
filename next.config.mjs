/** @type {import('next').NextConfig} */
const nextConfig = {
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
