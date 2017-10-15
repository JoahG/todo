'use strict';

var webpack = require('webpack');
var webpackUglifyJsPlugin = require('webpack-uglify-js-plugin');
var ExtractTextPlugin = require('extract-text-webpack-plugin');

module.exports = {
  cache: true,
  entry: {
    main: [
      './src/index.jsx',
      './scss/global.scss'
    ],
    vendor: [
      'react', 
      'react-dom',
      'react-redux',
      'react-router'
    ]
  },
  output: {
    path: 'dist',
    filename: 'app.bundle.min.js',
    chunkFilename: '[id].[hash].bundle.min.js',
    publicPath: '/'
  },
  module: {
    loaders: [
      {
        test: /\.jsx$/, 
        loader: 'babel-loader', 
        exclude: /(node_modules|bower_components)/
      },
      {
        test: /\.js$/, 
        loader: 'babel-loader', 
        exclude: /(node_modules|bower_components)/
      },
      {
        test: /\.scss$/,
        loader: ExtractTextPlugin.extract(['css-loader', 'sass-loader'])
      }
    ]
  },
  performance: {
    hints: false
  },
  plugins: [
    new webpack.ExtendedAPIPlugin(),
    new ExtractTextPlugin({
      filename: 'styles.bundle.css',
      allChunks: true,
    })
  ]
};
