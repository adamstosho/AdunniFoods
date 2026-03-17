/** @type {import('next').NextConfig} */
const nextConfig = {

  images: {
    // Enable Next/Image optimization (better LCP/CLS + caching)
    unoptimized: false,
    remotePatterns: [
      { protocol: "https", hostname: "hebbkx1anhila5yf.public.blob.vercel-storage.com" },
      { protocol: "https", hostname: "images.unsplash.com" },
      { protocol: "https", hostname: "source.unsplash.com" },
      { protocol: "https", hostname: "res.cloudinary.com" },
    ],
  },
}

export default nextConfig
