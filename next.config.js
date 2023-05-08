const path = require("path");
const SRC = path.resolve(__dirname, "public/music/");

/** @type {import('next').NextConfig} */
const nextConfig = {
  webpack(config, { isServer }) {
    config.module.rules.push({
      test: /\.(ogg|mp3|wav|mpe?g)$/i,
      exclude: config.exclude,
      use: [
        {
          loader: require.resolve("url-loader"),
          options: {
            limit: config.inlineImageLimit,
            fallback: require.resolve("file-loader"),
            publicPath: `${config.assetPrefix}/_next/static/music/`,
            outputPath: `${isServer ? "../" : ""}static/music/`,
            name: "[name]-[hash].[ext]",
            esModule: config.esModule || false,
          },
        },
      ],
    });

    config.resolve.fallback = { fs: false };

    return config;
  },
  async headers() {
    return [
      // {
      //   source: "/",
      //   headers: [
      //     {
      //       key: "Cross-Origin-Embedder-Policy",
      //       value: "require-corp",
      //     },
      //     {
      //       key: "Cross-Origin-Opener-Policy",
      //       value: "same-origin",
      //     },
      //   ],
      // },
    ];
  },
};

module.exports = nextConfig;
