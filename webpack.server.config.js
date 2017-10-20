module.exports = config => {
  config.module.rules.push({
    test: [/\.s(a|c)ss$/, /\.css$/],
    use: [{
      loader: 'css-loader/locals',
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

  return config
}
