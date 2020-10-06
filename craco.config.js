const { when, whenDev, whenProd, whenTest, ESLINT_MODES, POSTCSS_MODES } = require("@craco/craco");

module.exports = {
    webpack: {
        alias: {},
        plugins: [],
        configure: { 
            module: {
                rules: [
                  {
                    test: /\.scss$/i,
                    use: 'raw-loader',
                  },
                ],
              },
        },
        configure: (webpackConfig, { env, paths }) => { return webpackConfig; }
    }
};