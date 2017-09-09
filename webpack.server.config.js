module.exports = config => {
  config.module.loaders.push({
    test: [/\.s(a|c)ss$/, /\.css$/],
    loader: 'css-loader/locals?modules&camelCase=true&importLoaders=1&localIdentName=[name]__[local]___[hash:base64:5]!autoprefixer-loader!sass-loader'
  })

  return config
}
