// /** @type {import('next').NextConfig} */
// const nextConfig = {
//   serverExternalPackages: ['unpdf', 'mammoth', '@pinecone-database/pinecone'],
// }

// module.exports = nextConfig;

/** @type {import('next').NextConfig} */
const nextConfig = {
  serverExternalPackages: ['pdftojson', 'mammoth'], 
  turbopack: {}, 
  webpack: (config) => {
    config.resolve.fallback = {
      ...config.resolve.fallback,
      canvas: false,
      '@napi-rs/canvas': false
    };
    return config;
  }
};

module.exports = nextConfig;
