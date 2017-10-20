const path = require('path')
const webpack = require('webpack')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const nodeExternals = require('webpack-node-externals')

const htmlWebpackPlugin = new HtmlWebpackPlugin({
  filename: '__ssr-template__.html',
  // minify: {
  //   collapseInlineTagWhitespace: true,
  //   collapseWhitespace: true
  // },
  template: '!!ejs-loader!' + path.join(__dirname, '..', 'public', 'index.html')
})

const babelLoader = {
  test: /\.(js|jsx)$/,
  exclude: /node_modules/,
  loaders: ['babel-loader']
}

const dev = {
  entry: {
    app: [
      'react-hot-loader/patch',
      'webpack-hot-middleware/client?reload=true',
      path.join(__dirname, '..', 'src', 'index.js'),
    ],
    vendor: ['react', 'react-dom', 'redux', 'react-router']
  },
  devtool: 'eval-source-map',
  output: {
    filename: path.join('js', '[name].js'),
    path: path.resolve(__dirname, 'build'),
    publicPath: '/'
  },
  module: {
    loaders: [],
    rules: [babelLoader]
  },
  plugins: [
    htmlWebpackPlugin,
    new webpack.HotModuleReplacementPlugin(),
    new webpack.optimize.CommonsChunkPlugin({
      name: 'vendor',
      filename: 'vendor.js'
    })
  ]
}

const prod = {
  entry: {
    app: [
      path.join(__dirname, '..', 'src', 'index.js'),
    ]
  },
  output: {
    filename: path.join('js', '[name].[hash].js'),
    path: path.resolve('build'),
    publicPath: '/'
  },
  module: {
    loaders: [],
    rules: [babelLoader]
  },
  plugins: [
    htmlWebpackPlugin,
    new webpack.optimize.UglifyJsPlugin({
      compress: { warnings: false }
    }),
    new webpack.DefinePlugin({
      'process.env': {
        'NODE_ENV': JSON.stringify('production')
      }
    })
  ]
}

module.exports = { dev, prod }
