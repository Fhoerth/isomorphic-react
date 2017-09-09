const path = require('path')
const webpack = require('webpack')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const nodeExternals = require('webpack-node-externals')
const ExtractTextPlugin = require('extract-text-webpack-plugin')

const extractCSS = new ExtractTextPlugin({
  filename: path.join('styles', 'styles.[hash].css')
})

const client = {
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
    loaders: [{
      test: /\.(js|jsx)$/,
      exclude: /node_modules/,
      loaders: ['babel-loader']
    }, {
      test: [/\.s(a|c)ss$/, /\.css$/],
      use: extractCSS.extract({
        use: ['css-loader?modules&camelCase=true&importLoaders=1&localIdentName=[name]__[local]___[hash:base64:5]', 'autoprefixer-loader', 'sass-loader'],
        publicPath: path.resolve(__dirname, '..', 'build')
      })
    }]
  },
  plugins: [
    extractCSS,
    new HtmlWebpackPlugin({
      filename: '__ssr-template__.html',
      minify: {
        collapseInlineTagWhitespace: true,
        collapseWhitespace: true
      },
      template: '!!ejs-loader!' + path.join(__dirname, '..', 'public', 'index.html')
    }),
    new webpack.DefinePlugin({
      'process.env': {
        'NODE_ENV': JSON.stringify('production')
      }
    }),
    new webpack.optimize.UglifyJsPlugin({
      compress: { warnings: false }
    })
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
    }, {
      test: [/\.s(a|c)ss$/, /\.css$/],
      loader: 'css-loader/locals?modules&camelCase=true&importLoaders=1&localIdentName=[name]__[local]___[hash:base64:5]!autoprefixer-loader!sass-loader'
    }]
  }
}

module.exports = { client, server }
