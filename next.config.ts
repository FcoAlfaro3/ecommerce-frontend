import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    // Requerido desde Next.js 16: calidades permitidas para optimizar.
    qualities: [75],
    formats: ["image/avif", "image/webp"],
    // Las imágenes del catálogo vienen de la API (campo image_url).
    remotePatterns: [
      { protocol: "https", hostname: "**" },
    ],
  },
};

export default nextConfig;
