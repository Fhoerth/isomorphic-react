const path = require('path')
const ExtractTextPlugin = require('extract-text-webpack-plugin')

module.exports = (config, isProd) => {
  if (isProd) {
    const extractCSS = new ExtractTextPlugin({
      filename: path.join('styles', 'styles.[hash].css')
    })

    config.module.rules.push({
      test: [/\.s(a|c)ss$/],
      use: extractCSS.extract({
        use: [{
          loader: 'css-loader',
          options: {
            minimize: true,
            modules: true,
            camelCase: true,
            importLoaders: 1,
            localIdentName: '[name]__[local]___[hash:base64:5]'
          }
        }, {
          loader: 'autoprefixer-loader',
        }, {
          loader: 'sass-loader',
          options: {
            includePaths: ['node_modules']
          }
        }],
        publicPath: path.resolve(__dirname, '..', 'build')
      })
    })

    config.plugins.push(extractCSS)
  } else {
    config.module.rules.push({
      test: [/\.s(a|c)ss$/, /\.css$/],
      use: [{
        loader: 'style-loader'
      }, {
        loader: 'css-loader',
        options: {
          modules: true,
          camelCase: true,
          importLoaders: 1,
          localIdentName: '[name]__[local]___[hash:base64:5]'
        }
      }, {
        loader: 'autoprefixer-loader'
      }, {
        loader: 'sass-loader',
        options: {
          includePaths: ['node_modules']
        }
      }]

    })
  }

  return config
}
