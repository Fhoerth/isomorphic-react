const path = require('path')
const webpack = require('webpack')
const nodeExternals = require('webpack-node-externals')
const StatsWriterPlugin = require('webpack-stats-plugin').StatsWriterPlugin;
const HtmlWebpackPlugin = require('html-webpack-plugin')

const htmlWebpackPlugin = new HtmlWebpackPlugin({
  filename: '__ssr-template__.html',
  minify: {
    collapseInlineTagWhitespace: true,
    collapseWhitespace: true
  },
  favicon: false,
  excludeChunks: true,
  chunks: [],
  template: '!!ejs-loader!' + path.join(__dirname, '..', 'public', 'index.html')
})

const server = {
  name: 'server',
  target: 'node',
  devtool: 'inline-source-map',
  externals: [nodeExternals()],
  entry: [
    path.join(__dirname, '..', 'src', 'app', 'serverRenderer.js'),
  ],
  output: {
    filename: path.join('js', 'server.js'),
    path: path.resolve(__dirname, '..', 'build'),
    publicPath: 'build',
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
    htmlWebpackPlugin,
    new StatsWriterPlugin({
      filename: 'stats.json' // Default
    }),
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
