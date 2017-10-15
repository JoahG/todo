'use strict';

var webpack = require('webpack');
var config = require('./base.js');
var path = require('path');

config.module.loaders.push(
  {
    test: /\.js$/,
    exclude: /node_modules/,
    loaders: ['babel-loader', 'eslint-loader']
  }
);

config.module.loaders.push(
  {
    test: /\.jsx$/,
    exclude: /node_modules/,
    loaders: ['babel-loader', 'eslint-loader']
  }
);

config.plugins.push(
  new webpack.LoaderOptionsPlugin({
    options: {
      eslint: {
        configFile: './.eslintrc',
        fix: true
      }
    }
  })
);

config.plugins.push(
  new webpack.DefinePlugin({
    'process.env.NODE_ENV': `'development'`,
    'process.env.IS_BETA': true
  })
);

config.plugins.push(
  new webpack.optimize.CommonsChunkPlugin({
    name: 'vendor',
    minChunks: Infinity,
    filename: 'vendor.bundle.min.js'
  })
);

module.exports = config;
