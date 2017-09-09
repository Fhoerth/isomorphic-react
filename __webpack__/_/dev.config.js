const path = require('path')
const webpack = require('webpack')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const nodeExternals = require('webpack-node-externals')

const client = {
  entry: {
    app: [
      'react-hot-loader/patch',
      'webpack-hot-middleware/client?reload=true',
      path.join(__dirname, '..', 'src', 'index.js'),
    ],
    vendor: ['react', 'react-dom', 'redux', 'react-router']
  },
  output: {
    filename: path.join('js', '[name].js'),
    path: path.resolve(__dirname, 'build'),
    publicPath: '/'
  },
  module: {
    loaders: [{
      test: /\.(js|jsx)$/,
      exclude: /node_modules/,
      loaders: ['babel-loader']
    }]
  },
  plugins: [
    new HtmlWebpackPlugin({
      filename: '__ssr-template__.html',
      minify: {
        collapseInlineTagWhitespace: true,
        collapseWhitespace: true
      },
      template: '!!ejs-loader!' + path.join(__dirname, '..', 'public', 'index.html')
    }),
    new webpack.optimize.CommonsChunkPlugin({
      name: 'vendor',
      filename: 'vendor.js'
    }),
    new webpack.HotModuleReplacementPlugin()
  ]
}

const server = {
  name: 'server',
  target: 'node',
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
  }
}

module.exports = { client, server }
