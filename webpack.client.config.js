const path = require('path')
const ExtractTextPlugin = require('extract-text-webpack-plugin')

module.exports = (config, isProd) => {
  if (isProd) {
    const extractCSS = new ExtractTextPlugin({
      filename: path.join('styles', 'styles.[hash].css')
    })

    config.module.loaders.push({
      test: [/\.s(a|c)ss$/, /\.css$/],
      use: extractCSS.extract({
        use: ['css-loader?modules&camelCase=true&importLoaders=1&localIdentName=[name]__[local]___[hash:base64:5]', 'autoprefixer-loader', 'sass-loader'],
        publicPath: path.resolve(__dirname, '..', 'build')
      })
    })

    config.plugins.push(extractCSS)
  } else {
    config.module.loaders.push({
      test: [/\.s(a|c)ss$/, /\.css$/],
      loader: 'style-loader!css-loader?modules&camelCase=true&importLoaders=1&localIdentName=[name]__[local]___[hash:base64:5]!autoprefixer-loader!sass-loader'
    })
  }

  return config
}
