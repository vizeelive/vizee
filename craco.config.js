const CracoLessPlugin = require('craco-less');

module.exports = {
  webpack: {
    configure: (webpackConfig) => {
      webpackConfig.module.rules.push({
        test: /\.mjs$/,
        include: /node_modules/,
        type: 'javascript/auto'
      });
      return webpackConfig;
    }
  },
  plugins: [
    {
      plugin: CracoLessPlugin,
      options: {
        lessLoaderOptions: {
          lessOptions: {
            modifyVars: {
              '@primary-color': '#ee326e',
              '@link-color': '#ee326e',
              // '@layout-header-background': '#131c26',
              '@font-size-base': '16px'
            },
            javascriptEnabled: true
          }
        }
      }
    }
  ],
  style: {
    postcss: {
      plugins: [require('tailwindcss')('./tailwind.config.js')]
    }
  }
};
