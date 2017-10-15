'use strict';

var webpack = require('webpack');
var config = require('./base.js');
var path = require('path');

config.entry = ['./test'];
config.output = {
  path: '.tmp',
  filename: 'test.bundle.js'
};

config.resolve = {
  modules: [
    path.join(__dirname, "..", "node_modules"),
    path.join(__dirname, "..", "src"),
  ],
  extensions: ['.js', '.jsx'] 
};

// As per https://github.com/airbnb/enzyme/issues/47#issuecomment-258510723
config.plugins = config.plugins.concat([
  new webpack.IgnorePlugin(/react\/addons/),
  new webpack.IgnorePlugin(/react\/lib\/ReactContext/),
  new webpack.IgnorePlugin(/react\/lib\/ExecutionEnvironment/)
]);

config.module.loaders.push({
  test: /\.json$/, 
  loader: 'json-loader'
});

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
        configFile: './.eslintrc'
      }
    }
  })
);

config.plugins.push(
  new webpack.DefinePlugin({
    'process.env.NODE_ENV': `'test'`
  })
);

module.exports = config;
