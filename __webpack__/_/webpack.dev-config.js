module.exports = (config, isClient) => {
  console.log('Cargando', isClient);
  if (isClient) {
    // console.log('Pusheando', config.module.loaders);
    config.module.loaders.push({
      test: [/\.s(a|c)ss$/, /\.css$/],
      loader: 'style-loader!css-loader?modules&camelCase=true&importLoaders=1&localIdentName=[name]__[local]___[hash:base64:5]!autoprefixer-loader!sass-loader'
    })
    // console.log(config.module.loaders);
  } else {
    // console.log('pUSHEANDO SERVER');
    config.module.loaders.push({
      test: [/\.s(a|c)ss$/, /\.css$/],
      loader: 'css-loader/locals?modules&camelCase=true&importLoaders=1&localIdentName=[name]__[local]___[hash:base64:5]!autoprefixer-loader!sass-loader'
    })
  }
  return config
}
