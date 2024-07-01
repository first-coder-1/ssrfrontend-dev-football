const {
  locales,
  fallbackLocale: defaultLocale,
} = require("./src/locales/constants");

const withBundleAnalyzer = require("@next/bundle-analyzer")({
  enabled: false,
});
/** @type {import('next').NextConfig} */

const nextConfig = withBundleAnalyzer({
  reactStrictMode: false,
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**",
      },
    ],
  },
  async rewrites() {
    return [
      {
        source: "/_error",
        destination: "/not-found",
        // permanent: true,
      },
    ];
  },
  swcMinify: true,
  modularizeImports: {
    "@mui/material": {
      transform: "@mui/material/{{member}}",
    },

    "@mui/icons-material": {
      transform: "@mui/icons-material/{{member}}",
    },
    "@mui/styles": {
      transform: "@mui/styles/{{member}}",
    },
    "@mui/lab": {
      transform: "@mui/lab/{{member}}",
    },
  },
  i18n: {
    locales,
    defaultLocale,
    localeDetection: false,
  },
  trailingSlash: false,
  webpack: (
    config,
    { buildId, dev, isServer, defaultLoaders, nextRuntime, webpack }
  ) => {
    config.optimization.splitChunks = {
      ...config.optimization.splitChunks,
      cacheGroups: {
        // Basic framework
        react: {
          chunks: "all",
          test: /([\\/]react[\\/]|react-dom|react-router|react-dom-router|history|scheduler|object-assign)/,
          name: "react",
          priority: 100,
        },
        babel: {
          chunks: "all",
          test: /(regenerator-runtime|@babel|events)/,
          name: "babel",
          priority: 100,
        },
        // Packages
        styles: {
          chunks: "all",
          name: "styles",
          test: /(@emotion|tss-react|hoist-non-react-statics|stylis|jss|is-in-browser|css-vendor)/,
          priority: 80,
        },
        // reactplayer: {
        //   chunks: "all",
        //   test: /react-player/,
        //   name: "react-player",
        //   priority: 80,
        // },
        // firebase: {
        //   chunks: "all",
        //   test: /firebase/,
        //   name: "firebase",
        //   priority: 80,
        // },
        lodash: {
          chunks: "all",
          test: /lodash/,
          name: "lodash",
          priority: 80,
        },
        // reactsociallogin: {
        //   chunks: "all",
        //   test: /react-social-login/,
        //   name: "react-social-login",
        //   priority: 80,
        // },
        // reactvirtualized: {
        //   chunks: "all",
        //   test: /(react-virtualized|react-lifecycles-compat)/,
        //   name: "react-virtualized",
        //   priority: 80,
        // },
        // reactdfp: {
        //   chunks: "all",
        //   test: /react-dfp/,
        //   name: "react-dfp",
        //   priority: 80,
        // },
        mobx: {
          chunks: "all",
          test: /mobx/,
          name: "mobx",
          priority: 80,
        },
        // intl: {
        //   chunks: "all",
        //   test: /intl|querystring|cookie|invariant|escape-html/,
        //   name: "intl",
        //   priority: 80,
        // },
        axios: {
          chunks: "all",
          test: /axios/,
          name: "axios",
          priority: 80,
        },
      },
    };
    return config; // Important: return the modified config
  },
});

module.exports = nextConfig;
