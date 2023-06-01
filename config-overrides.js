const webpack = require('webpack');
const path = require('path');
const { useBabelRc, override } = require('customize-cra');
const ModuleScopePlugin = require('react-dev-utils/ModuleScopePlugin');

module.exports = function override(config) {
  const fallback = config.resolve.fallback || {};
  Object.assign(fallback, {
    "crypto": path.join(path.resolve(__dirname), 'node_modules', 'crypto-browserify'),
    "stream": path.join(path.resolve(__dirname), 'node_modules', 'stream-browserify'),
    "assert": path.join(path.resolve(__dirname), 'node_modules', 'assert'),
    "http": path.join(path.resolve(__dirname), 'node_modules', 'stream-http'),
    "https": path.join(path.resolve(__dirname), 'node_modules', 'https-browserify'),
    "os": path.join(path.resolve(__dirname), 'node_modules', 'os-browserify'),
    "url": path.join(path.resolve(__dirname), 'node_modules', 'url'),
    "util": path.join(path.resolve(__dirname), 'node_modules', 'util'),
    "zlib": path.join(path.resolve(__dirname), 'node_modules', 'browserify-zlib'),
    "path": path.join(path.resolve(__dirname), 'node_modules', 'path-browserify'),
  });
  config.resolve.fallback = fallback;
  config.plugins = (config.plugins || []).concat([
    new webpack.ProvidePlugin({
      process: 'process/browser',
      Buffer: ['buffer', 'Buffer'],
    }),
  ]);
  config.module.rules.push({
    test: /\.m?js/,
    resolve: {
      fullySpecified: false,
    },
  });
  config.resolve.plugins = config.resolve.plugins.filter(plugin => !(plugin instanceof ModuleScopePlugin));
  return config;
};