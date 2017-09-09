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
    path.join(__dirname, '..', 'src', 'App.js'),
  ],
  output: {
    filename: path.join('js', 'server.js'),
    path: path.resolve(__dirname, '..', 'build'),
    publicPath: 'build/',
    libraryTarget: 'commonjs2'
  },
  module: {
    loaders: [{
      test: /\.(js|jsx)$/,
      loaders: ['babel-loader']
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
