import type { NextConfig } from "next";
/** @type {import('next').NextConfig} */

const nextConfig: NextConfig = {
  output: 'export',
  basePath: '/Blockchain_projects/project7/ballot-next',
  images: {
    unoptimized: true,
  },
};

export default nextConfig;
