'use strict';

var webpack = require('webpack');
var config = require('./base.js');
var webpackUglifyJsPlugin = require('webpack-uglify-js-plugin');

config.cache = false;

config.plugins.push(
  new webpack.optimize.UglifyJsPlugin({
    compress: {
        warnings: false
    },
    comments: false
  })
);

config.plugins.push(
  new webpack.DefinePlugin({
    'process.env.NODE_ENV': `'production'`,
    'process.env.IS_BETA': process.env.FIELD_ASSIST_DOMAIN == `https://beta.getfieldassist.com` || process.env.LAUNCHED !== `true` ? `true` : `false` 
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
