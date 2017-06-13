const path = require('path');
const webpack = require('webpack');

module.exports = {
  context: __dirname,
  entry: './lyrical.js',
  output: {
    path: path.resolve(__dirname, 'js'),
    filename: 'public/bundle.js',
  },
  module: {
    loaders: [
      {
        test: [/\.js?$/],
        exclude: /(node_modules)/,
        loader: 'babel-loader',
        query: {
          presets: ['es2015']
        }
      }
    ]
  },
  // devtool: 'source-map',
  plugins: [
  new webpack.optimize.UglifyJsPlugin({
    comments: false, // remove comments
    compress: {
      unused: true,
      dead_code: true, // big one--strip code that will never execute
      warnings: false, // good for prod apps so users can't peek behind curtain
      drop_debugger: true,
      conditionals: true,
      evaluate: true,
      drop_console: true, // strips console statements
      sequences: true,
      booleans: true,
      }
    })
  ],
  resolve: {
    extensions: ['*', '.js']
  }
};
