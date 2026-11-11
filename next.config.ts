import type { NextConfig } from "next";

// Export statique : la partie publique est servie comme de simples fichiers (hébergement léger, bon pour la 3G/4G).
const config: NextConfig = {
  output: "export",
  trailingSlash: true,
  images: { unoptimized: true },
  reactStrictMode: true,
};
export default config;
