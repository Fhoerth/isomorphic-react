const path = require('path')
const webpack = require('webpack')
const nodeExternals = require('webpack-node-externals')
var WebpackSourceMapSupport = require("webpack-source-map-support")

const server = {
  name: 'server',
  target: 'node',
  devtool: 'inline-source-map',
  externals: [nodeExternals()],
  entry: [
    path.join(__dirname, '..', 'src', 'app', 'index.js'),
  ],
  output: {
    filename: path.join('js', 'server.js'),
    path: path.resolve(__dirname, '..', 'build'),
    publicPath: 'build/',
    libraryTarget: 'commonjs2'
  },
  module: {
    rules: [{
      test: /\.(js|jsx)$/,
      use: {
        loader: 'babel-loader'
      }
    }]
  },
  plugins: [
    new webpack.BannerPlugin({
      banner: `require("source-map-support").install({
        hookRequire: true,
        environment: 'node'
      });`,
      raw: true,
      entryOnly: false
    })
  ]
}

module.exports = server
